'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const emailSchema = z.string().email('Email inválido').max(255)

export async function subscribe(email: string) {
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) {
    return { success: false, error: 'Por favor ingresa un email válido.' }
  }

  const supabase = await createClient()

  // Check for existing subscriber
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, is_active')
    .eq('email', parsed.data.toLowerCase())
    .single()

  if (existing) {
    if (!existing.is_active) {
      // Re-activate
      await supabase
        .from('subscribers')
        .update({ is_active: true })
        .eq('id', existing.id)
    }
    return { success: false, duplicate: true }
  }

  // Insert new subscriber
  const { error } = await supabase
    .from('subscribers')
    .insert({
      email: parsed.data.toLowerCase(),
      source: 'website',
    })

  if (error) {
    console.error('Subscribe error:', error)
    return { success: false, error: 'Hubo un error. Intenta nuevamente en unos segundos.' }
  }

  // TODO: Send welcome email via Resend when configured
  // await sendWaitlistWelcomeEmail(parsed.data)

  return { success: true }
}
