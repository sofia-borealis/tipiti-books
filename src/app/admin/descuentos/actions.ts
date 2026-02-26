'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const discountSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9]+$/, 'Solo mayúsculas y números'),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(1),
  max_uses: z.number().int().min(1).optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
})

export type DiscountFormData = z.infer<typeof discountSchema>

export async function createDiscountCode(data: DiscountFormData) {
  const parsed = discountSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Datos inválidos: ' + parsed.error.issues.map(i => i.message).join(', ') }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('discount_codes')
    .insert({
      ...parsed.data,
      expires_at: parsed.data.expires_at || null,
    })

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un código con ese nombre.' }
    return { error: 'Error al crear el código.' }
  }

  revalidatePath('/admin/descuentos')
  return { success: true }
}

export async function updateDiscountCode(codeId: string, data: Partial<DiscountFormData>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discount_codes')
    .update(data)
    .eq('id', codeId)

  if (error) return { error: 'Error al actualizar el código.' }
  revalidatePath('/admin/descuentos')
  return { success: true }
}

export async function deleteDiscountCode(codeId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', codeId)

  if (error) return { error: 'Error al eliminar el código.' }
  revalidatePath('/admin/descuentos')
  return { success: true }
}

export async function toggleDiscountActive(codeId: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discount_codes')
    .update({ is_active: !isActive })
    .eq('id', codeId)

  if (error) return { error: 'Error al cambiar estado.' }
  revalidatePath('/admin/descuentos')
  return { success: true }
}
