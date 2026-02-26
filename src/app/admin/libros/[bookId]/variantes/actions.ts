'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveVariant(variantId: string, bookId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('character_variants')
    .update({ status: 'approved' })
    .eq('id', variantId)

  if (error) return { error: 'Error al aprobar variante.' }
  revalidatePath(`/admin/libros/${bookId}/variantes`)
  return { success: true }
}

export async function rejectVariant(variantId: string, bookId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('character_variants')
    .update({ status: 'rejected' })
    .eq('id', variantId)

  if (error) return { error: 'Error al rechazar variante.' }
  revalidatePath(`/admin/libros/${bookId}/variantes`)
  return { success: true }
}

export async function bulkUpdateVariants(
  variantIds: string[],
  status: 'approved' | 'rejected',
  bookId: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('character_variants')
    .update({ status })
    .in('id', variantIds)

  if (error) return { error: `Error al actualizar variantes.` }
  revalidatePath(`/admin/libros/${bookId}/variantes`)
  return { success: true, count: variantIds.length }
}

export async function regenerateVariant(variantId: string, bookId: string) {
  const supabase = await createClient()

  // Reset variant status to pending so the generation pipeline can pick it up again
  const { error } = await supabase
    .from('character_variants')
    .update({ status: 'pending' })
    .eq('id', variantId)

  if (error) return { error: 'Error al marcar para regenerar.' }

  // TODO: Dispatch Inngest event to regenerate this specific variant
  // await inngest.send({ name: 'variant/generate-pages', data: { variantId, bookId } })

  revalidatePath(`/admin/libros/${bookId}/variantes`)
  return { success: true }
}
