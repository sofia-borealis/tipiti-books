'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
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
