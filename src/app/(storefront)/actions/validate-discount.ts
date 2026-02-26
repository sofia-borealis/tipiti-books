'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateDiscount(code: string) {
  if (!code.trim()) {
    return { valid: false, error: 'Ingresa un código de descuento.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, code, type, value, max_uses, used_count, expires_at, is_active')
    .eq('code', code.trim().toUpperCase())
    .single()

  if (error || !data) {
    return { valid: false, error: 'Código no válido.' }
  }

  if (!data.is_active) {
    return { valid: false, error: 'Este código ya no está activo.' }
  }

  if (data.max_uses && data.used_count >= data.max_uses) {
    return { valid: false, error: 'Este código ha alcanzado su límite de usos.' }
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Este código ha expirado.' }
  }

  return {
    valid: true,
    discount: {
      id: data.id,
      code: data.code,
      type: data.type as 'percentage' | 'fixed',
      value: Number(data.value),
    },
  }
}
