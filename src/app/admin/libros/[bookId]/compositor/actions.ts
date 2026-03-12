'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateWithLora } from '@/lib/fal/experimental-client'
import { revalidatePath } from 'next/cache'

const positionSchema = z.object({
  character_x: z.number().min(0).max(100),
  character_y: z.number().min(0).max(100),
  character_scale: z.number().min(0.05).max(2.0),
  character_flip: z.boolean(),
})

export async function updateCharacterPosition(
  sceneId: string,
  bookId: string,
  data: z.infer<typeof positionSchema>
) {
  const parsed = positionSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Datos de posición inválidos.' }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scenes')
    .update(parsed.data)
    .eq('id', sceneId)

  if (error) {
    return { error: `Error al actualizar posición: ${error.message}` }
  }

  revalidatePath(`/admin/libros/${bookId}/compositor`)
}

export async function approveComposition(
  variantPageId: string,
  bookId: string
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('variant_pages')
    .update({ status: 'approved' })
    .eq('id', variantPageId)

  if (error) {
    return { error: `Error al aprobar: ${error.message}` }
  }

  revalidatePath(`/admin/libros/${bookId}/compositor`)
}

export async function generateBackground(data: {
  sceneId: string
  bookId: string
  sceneNumber: number
  prompt: string
  stylePrompt: string
}) {
  try {
    // Generate with style LoRA (no character LoRA for backgrounds)
    const result = await generateWithLora({
      prompt: data.prompt,
      stylePrompt: data.stylePrompt,
      includeStyleLora: true,
      includeCharacterLora: false,
      width: 2200,
      height: 1800,
    })

    // Download and save to Supabase as the scene background
    const supabase = createAdminClient()

    const imageResponse = await fetch(result.imageUrl)
    if (!imageResponse.ok) throw new Error('No se pudo descargar la imagen generada')
    const buffer = Buffer.from(await imageResponse.arrayBuffer())

    const storagePath = `backgrounds/${data.bookId}/scene-${data.sceneNumber}.png`
    const { error: uploadError } = await supabase.storage
      .from('variant-pages')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) throw new Error(uploadError.message)

    const backgroundUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

    const { error: updateError } = await supabase
      .from('scenes')
      .update({ background_url: backgroundUrl })
      .eq('id', data.sceneId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath(`/admin/libros/${data.bookId}/compositor`)

    return {
      success: true,
      backgroundUrl,
      seed: result.seed,
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error al generar fondo',
    }
  }
}
