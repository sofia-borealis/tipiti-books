import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { composeLayers } from '@/lib/compose/layer-composer'

export async function POST(request: NextRequest) {
  try {
    const { sceneId, variantId, bookId, pageWidth = 2598, pageHeight = 2126 } = await request.json()

    if (!sceneId || !variantId || !bookId) {
      return NextResponse.json(
        { error: 'sceneId, variantId, and bookId are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch scene data
    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('id, scene_number, background_url, character_x, character_y, character_scale, character_flip')
      .eq('id', sceneId)
      .single()

    if (sceneError || !scene) {
      return NextResponse.json(
        { error: `Scene not found: ${sceneError?.message}` },
        { status: 404 }
      )
    }

    if (!scene.background_url) {
      return NextResponse.json(
        { error: 'Esta escena no tiene fondo. Sube un fondo primero.' },
        { status: 400 }
      )
    }

    // Fetch variant data
    const { data: variant, error: variantError } = await supabase
      .from('character_variants')
      .select('id, character_layer_url')
      .eq('id', variantId)
      .single()

    if (variantError || !variant) {
      return NextResponse.json(
        { error: `Variant not found: ${variantError?.message}` },
        { status: 404 }
      )
    }

    if (!variant.character_layer_url) {
      return NextResponse.json(
        { error: 'Esta variante no tiene imagen de personaje. Sube una primero.' },
        { status: 400 }
      )
    }

    // Download background and character images
    const [bgResponse, charResponse] = await Promise.all([
      fetch(scene.background_url),
      fetch(variant.character_layer_url),
    ])

    if (!bgResponse.ok) {
      return NextResponse.json(
        { error: 'No se pudo descargar el fondo' },
        { status: 500 }
      )
    }
    if (!charResponse.ok) {
      return NextResponse.json(
        { error: 'No se pudo descargar la imagen del personaje' },
        { status: 500 }
      )
    }

    const backgroundBuffer = Buffer.from(await bgResponse.arrayBuffer())
    const characterBuffer = Buffer.from(await charResponse.arrayBuffer())

    // Compose layers
    const { composedBuffer } = await composeLayers({
      backgroundBuffer,
      characterBuffer,
      characterX: scene.character_x ?? 50,
      characterY: scene.character_y ?? 50,
      characterScale: scene.character_scale ?? 0.6,
      characterFlip: scene.character_flip ?? false,
      pageWidth,
      pageHeight,
    })

    // Upload composed image
    const storagePath = `composed/${bookId}/${variantId}/scene-${scene.scene_number}.png`

    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
      .upload(storagePath, composedBuffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const composedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

    // Upsert variant_page record
    await supabase.from('variant_pages').upsert(
      {
        variant_id: variantId,
        scene_id: sceneId,
        image_url: composedUrl,
        prompt_used: 'layer-composition',
        generation_model: 'sharp-compose',
        status: 'composed',
      },
      { onConflict: 'variant_id,scene_id' }
    )

    return NextResponse.json({
      success: true,
      composedUrl,
    })
  } catch (err) {
    console.error('Compose layers error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
