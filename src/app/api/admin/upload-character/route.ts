import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const variantId = formData.get('variantId') as string | null
    const bookId = formData.get('bookId') as string | null

    if (!file || !variantId || !bookId) {
      return NextResponse.json(
        { error: 'file, variantId, and bookId are required' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate alpha channel
    const metadata = await sharp(buffer).metadata()
    const hasAlpha = (metadata.channels || 0) >= 4
    let hasTransparency = false

    if (hasAlpha) {
      const stats = await sharp(buffer).stats()
      const alphaChannel = stats.channels[3]
      hasTransparency = alphaChannel ? alphaChannel.min < 255 : false
    }

    const supabase = createAdminClient()
    const storagePath = `${bookId}/${variantId}.png`

    const { error: uploadError } = await supabase.storage
      .from('character-sheets')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const characterUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/character-sheets/${storagePath}`

    // Update variant with character layer URL
    const { error: updateError } = await supabase
      .from('character_variants')
      .update({ character_layer_url: characterUrl })
      .eq('id', variantId)

    if (updateError) {
      return NextResponse.json(
        { error: `DB update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      characterUrl,
      hasAlpha,
      hasTransparency,
      warning: !hasTransparency
        ? 'Esta imagen no tiene fondo transparente. Considera procesarla con remove.bg.'
        : undefined,
    })
  } catch (err) {
    console.error('Upload character error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
