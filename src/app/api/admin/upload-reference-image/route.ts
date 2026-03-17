import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const supabase = createAdminClient()
    const storagePath = `references/${bookId}/${variantId}.png`

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

    const referenceImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/character-sheets/${storagePath}`

    const { error: updateError } = await supabase
      .from('character_variants')
      .update({ reference_image_url: referenceImageUrl })
      .eq('id', variantId)

    if (updateError) {
      return NextResponse.json(
        { error: `DB update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, referenceImageUrl })
  } catch (err) {
    console.error('Upload reference image error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
