/**
 * E2E Test: Full pipeline fal.ai → Supabase Storage → DB records
 * Run: npx tsx scripts/test-e2e-generate.ts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(import.meta.dirname || __dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FAL_KEY = process.env.FAL_KEY!
const bookId = '2da03b21-9149-4dcd-ab05-34d672dd24c8'

async function testE2E() {
  // 1. Fetch book
  const { data: book, error: bookErr } = await supabase
    .from('books')
    .select('id, style_prompt, generation_engine')
    .eq('id', bookId)
    .single()

  if (bookErr || !book) {
    console.error('Book not found:', bookErr?.message)
    process.exit(1)
  }
  console.log('Book:', book.id, '- engine:', book.generation_engine || 'default')

  // 2. Fetch scene 1
  const { data: scene, error: sceneErr } = await supabase
    .from('scenes')
    .select('id, scene_number, visual_description, text_narrative')
    .eq('book_id', bookId)
    .eq('scene_number', 1)
    .single()

  if (sceneErr || !scene) {
    console.error('Scene not found:', sceneErr?.message)
    process.exit(1)
  }
  console.log('Scene:', scene.scene_number, '-', (scene.visual_description || '').slice(0, 80) + '...')

  // 3. Build prompt
  const characterDesc = 'young girl with light skin, straight blonde hair'
  const scenePrompt = scene.visual_description
    ? `${scene.visual_description}\n\nCharacter: ${characterDesc}`
    : `A watercolor illustration of a scene featuring a ${characterDesc}`

  const fullPrompt = `${book.style_prompt || ''}\n\n${scenePrompt}`
  console.log('Prompt length:', fullPrompt.length, 'chars')
  console.log('Prompt preview:', fullPrompt.slice(0, 200) + '...')

  // 4. Generate via fal.ai (schnell for speed)
  console.log('\nGenerating image via fal.ai...')
  const model = 'fal-ai/flux/schnell'
  const falResponse = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: fullPrompt,
      image_size: { width: 1024, height: 1024 },
      num_images: 1,
    }),
  })

  if (!falResponse.ok) {
    console.error('fal.ai error:', await falResponse.text())
    process.exit(1)
  }

  const falData = await falResponse.json()
  const imageUrl = falData.images?.[0]?.url
  if (!imageUrl) {
    console.error('No image returned:', JSON.stringify(falData, null, 2))
    process.exit(1)
  }
  console.log('Image generated:', imageUrl)

  // 5. Create variant record
  const testVariant = {
    gender: 'girl',
    skin_tone: 'light',
    hair_color: 'blonde',
    hair_type: 'straight',
    has_glasses: false,
  }

  const { data: variant, error: varErr } = await supabase
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

  if (varErr || !variant) {
    console.error('Variant error:', varErr?.message)
    console.log('Image URL (fal.ai):', imageUrl)
    return
  }
  console.log('Variant ID:', variant.id)

  // 6. Download and upload to Supabase Storage
  console.log('Downloading and uploading to Storage...')
  const imgRes = await fetch(imageUrl)
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

  const storagePath = `books/${bookId}/variants/${variant.id}/scene-1.png`

  const { error: uploadErr } = await supabase.storage
    .from('variant-pages')
    .upload(storagePath, imgBuffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (uploadErr) {
    console.error('Upload error:', uploadErr.message)
    console.log('Image URL (fal.ai):', imageUrl)
    return
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`
  console.log('Uploaded to Storage:', publicUrl)

  // 7. Create variant_page record
  const { error: pageErr } = await supabase.from('variant_pages').upsert({
    variant_id: variant.id,
    scene_id: scene.id,
    image_url: publicUrl,
    storage_path: storagePath,
  }, {
    onConflict: 'variant_id,scene_id',
  })

  if (pageErr) {
    console.error('variant_page error:', pageErr.message)
  } else {
    console.log('\n=== E2E TEST PASSED ===')
    console.log('Variant:', variant.id)
    console.log('Scene:', scene.id)
    console.log('Public URL:', publicUrl)
  }
}

testE2E().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
