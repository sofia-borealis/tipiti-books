import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sceneId = formData.get('sceneId') as string | null
    const bookId = formData.get('bookId') as string | null
    const sceneNumber = formData.get('sceneNumber') as string | null
    const pageWidth = Number(formData.get('pageWidth')) || 2598
    const pageHeight = Number(formData.get('pageHeight')) || 2126

    if (!file || !sceneId || !bookId || !sceneNumber) {
      return NextResponse.json(
        { error: 'file, sceneId, bookId, and sceneNumber are required' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Resize to page dimensions
    const resized = await sharp(buffer)
      .resize(pageWidth, pageHeight, { fit: 'cover' })
      .png()
      .toBuffer()

    const supabase = createAdminClient()
    const storagePath = `backgrounds/${bookId}/scene-${sceneNumber}.png`

    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
      .upload(storagePath, resized, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const backgroundUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

    // Update scene with background URL
    const { error: updateError } = await supabase
      .from('scenes')
      .update({ background_url: backgroundUrl })
      .eq('id', sceneId)

    if (updateError) {
      return NextResponse.json(
        { error: `DB update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, backgroundUrl })
  } catch (err) {
    console.error('Upload background error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
