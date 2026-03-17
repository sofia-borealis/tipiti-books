import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sceneId = formData.get('sceneId') as string | null
    const bookId = formData.get('bookId') as string | null
    const sceneNumber = formData.get('sceneNumber') as string | null

    if (!file || !sceneId || !bookId || !sceneNumber) {
      return NextResponse.json(
        { error: 'file, sceneId, bookId, and sceneNumber are required' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createAdminClient()
    const storagePath = `base-illustrations/${bookId}/scene-${sceneNumber}.png`

    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
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

    const baseIllustrationUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

    const { error: updateError } = await supabase
      .from('scenes')
      .update({ base_illustration_url: baseIllustrationUrl })
      .eq('id', sceneId)

    if (updateError) {
      return NextResponse.json(
        { error: `DB update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, baseIllustrationUrl })
  } catch (err) {
    console.error('Upload base illustration error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
