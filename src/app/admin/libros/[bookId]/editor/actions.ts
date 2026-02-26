'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const sceneSchema = z.object({
  scene_number: z.number().int().min(0),
  text_narrative: z.string().max(500).optional(),
  visual_description: z.string().max(2000).optional(),
  text_position: z.enum(['top', 'bottom', 'overlay']).optional(),
  camera_angle: z.string().max(200).optional(),
  lighting: z.string().max(200).optional(),
  emotion: z.string().max(200).optional(),
  character_position: z.string().max(200).optional(),
})

export type SceneFormData = z.infer<typeof sceneSchema>

export async function createScene(bookId: string, data: SceneFormData) {
  const parsed = sceneSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Datos inválidos: ' + parsed.error.issues.map(i => i.message).join(', ') }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scenes')
    .insert({ book_id: bookId, ...parsed.data })

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe una escena con ese número.' }
    return { error: 'Error al crear la escena.' }
  }

  revalidatePath(`/admin/libros/${bookId}/editor`)
  return { success: true }
}

export async function updateScene(sceneId: string, bookId: string, data: Partial<SceneFormData>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scenes')
    .update(data)
    .eq('id', sceneId)

  if (error) {
    return { error: 'Error al actualizar la escena.' }
  }

  revalidatePath(`/admin/libros/${bookId}/editor`)
  return { success: true }
}

export async function deleteScene(sceneId: string, bookId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scenes')
    .delete()
    .eq('id', sceneId)

  if (error) {
    return { error: 'Error al eliminar la escena.' }
  }

  revalidatePath(`/admin/libros/${bookId}/editor`)
  return { success: true }
}

export async function reorderScenes(bookId: string, sceneIds: string[]) {
  const supabase = createAdminClient()

  // Update scene_number for each scene based on new order
  const updates = sceneIds.map((id, index) =>
    supabase
      .from('scenes')
      .update({ scene_number: index + 1 })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const failed = results.find(r => r.error)

  if (failed?.error) {
    return { error: 'Error al reordenar las escenas.' }
  }

  revalidatePath(`/admin/libros/${bookId}/editor`)
  return { success: true }
}
