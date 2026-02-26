import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/admin/generate-test
 *
 * Generates a SINGLE test image for one scene of one variant.
 * Bypasses Inngest — useful for testing fal.ai + Supabase Storage pipeline.
 *
 * Body: { bookId: string, sceneNumber?: number }
 *
 * What it does:
 * 1. Fetches the book's style_prompt + first scene
 * 2. Generates one image via fal.ai (girl, light skin, blonde, straight)
 * 3. Uploads to Supabase Storage
 * 4. Creates character_variant + variant_page records
 * 5. Returns the public image URL
 */
export async function POST(request: Request) {
  try {
    const { bookId, sceneNumber = 1 } = await request.json()

    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY
    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Fetch book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, style_prompt, generation_engine')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: `Book not found: ${bookError?.message}` }, { status: 404 })
    }

    // 2. Fetch scene
    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('id, scene_number, visual_description, text_narrative')
      .eq('book_id', bookId)
      .eq('scene_number', sceneNumber)
      .single()

    if (sceneError || !scene) {
      return NextResponse.json({ error: `Scene ${sceneNumber} not found: ${sceneError?.message}` }, { status: 404 })
    }

    // 3. Build prompt
    const testVariant = {
      gender: 'girl',
      skin_tone: 'light',
      hair_color: 'blonde',
      hair_type: 'straight',
      has_glasses: false,
    }

    const characterDesc = 'young girl with light skin, straight blonde hair'
    const scenePrompt = scene.visual_description
      ? `${scene.visual_description}\n\nCharacter: ${characterDesc}`
      : `A watercolor illustration of a scene featuring a ${characterDesc}`

    const fullPrompt = `${book.style_prompt}\n\n${scenePrompt}`

    console.log('Generating with prompt:', fullPrompt.slice(0, 200) + '...')

    // 4. Call fal.ai
    const model = book.generation_engine || 'fal-ai/flux/schnell' // use schnell for fast testing
    const falResponse = await fetch(`https://fal.run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        image_size: { width: 1024, height: 1024 },
        num_images: 1,
      }),
    })

    if (!falResponse.ok) {
      const errText = await falResponse.text()
      return NextResponse.json({ error: `fal.ai error: ${errText}` }, { status: 500 })
    }

    const falData = await falResponse.json()
    const imageUrl = falData.images?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned from fal.ai', data: falData }, { status: 500 })
    }

    console.log('Image generated:', imageUrl)

    // 5. Create or get variant record
    const { data: variant, error: variantError } = await supabase
      .from('character_variants')
      .upsert({
        book_id: bookId,
        ...testVariant,
        status: 'pending_review',
      }, {
        onConflict: 'book_id,gender,skin_tone,hair_color,hair_type,has_glasses',
      })
      .select('id')
      .single()

    if (variantError || !variant) {
      // Return the image URL even if DB insert fails
      return NextResponse.json({
        warning: `Variant DB insert failed: ${variantError?.message}`,
        imageUrl,
        prompt: fullPrompt,
      })
    }

    // 6. Download image and upload to Supabase Storage
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    const storagePath = `books/${bookId}/variants/${variant.id}/scene-${sceneNumber}.png`

    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      })

    let publicImageUrl = imageUrl // fallback to fal.ai URL
    if (uploadError) {
      console.error('Storage upload failed:', uploadError)
    } else {
      publicImageUrl = `${supabaseUrl}/storage/v1/object/public/variant-pages/${storagePath}`

      // 7. Create variant_page record
      await supabase.from('variant_pages').upsert({
        variant_id: variant.id,
        scene_id: scene.id,
        image_url: publicImageUrl,
        prompt_used: fullPrompt,
        generation_model: model,
      }, {
        onConflict: 'variant_id,scene_id',
      })
    }

    return NextResponse.json({
      success: true,
      variantId: variant.id,
      sceneId: scene.id,
      imageUrl: publicImageUrl,
      falImageUrl: imageUrl,
      prompt: fullPrompt.slice(0, 300),
    })
  } catch (err) {
    console.error('Generate test error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
