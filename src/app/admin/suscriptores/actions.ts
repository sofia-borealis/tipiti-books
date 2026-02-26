'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleSubscriber(id: string, isActive: boolean) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('subscribers')
    .update({ is_active: !isActive })
    .eq('id', id)

  if (error) {
    return { error: 'No se pudo actualizar el suscriptor.' }
  }

  revalidatePath('/admin/suscriptores')
  return { success: true }
}

export async function exportSubscribersCSV() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('subscribers')
    .select('email, source, is_active, subscribed_at')
    .order('subscribed_at', { ascending: false })

  if (error || !data) {
    return { error: 'No se pudieron exportar los suscriptores.' }
  }

  const header = 'email,fuente,activo,fecha'
  const rows = data.map((s) =>
    `${s.email},${s.source},${s.is_active ? 'sí' : 'no'},${new Date(s.subscribed_at).toLocaleDateString('es-CL')}`
  )

  const csv = [header, ...rows].join('\n')
  return { csv }
}
