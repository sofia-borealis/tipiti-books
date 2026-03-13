'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { generateWithLora } from '@/lib/fal/experimental-client'
import { revalidatePath } from 'next/cache'

export async function generateExperimental(data: {
  bookId: string
  sceneId: string
  sceneNumber: number
  prompt: string
  stylePrompt: string
  includeStyleLora: boolean
  includeCharacterLora: boolean
}) {
  try {
    const result = await generateWithLora({
      prompt: data.prompt,
      stylePrompt: data.stylePrompt,
      includeStyleLora: data.includeStyleLora,
      includeCharacterLora: data.includeCharacterLora,
      width: 2598,
      height: 2126,
    })

    return {
      success: true,
      imageUrl: result.imageUrl,
      seed: result.seed,
      lorasUsed: result.lorasUsed,
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}

export async function useAsBackground(data: {
  sceneId: string
  bookId: string
  sceneNumber: number
  imageUrl: string
}) {
  try {
    const supabase = createAdminClient()

    // Download the generated image
    const response = await fetch(data.imageUrl)
    if (!response.ok) throw new Error('No se pudo descargar la imagen')
    const buffer = Buffer.from(await response.arrayBuffer())

    // Upload to storage
    const storagePath = `backgrounds/${data.bookId}/scene-${data.sceneNumber}.png`
    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) throw new Error(uploadError.message)

    const backgroundUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

    // Update scene
    const { error: updateError } = await supabase
      .from('scenes')
      .update({ background_url: backgroundUrl })
      .eq('id', data.sceneId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath(`/admin/libros/${data.bookId}/compositor`)

    return { success: true, backgroundUrl }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}
