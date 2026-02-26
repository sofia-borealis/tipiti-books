'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return { error: 'Error al actualizar el estado.' }
  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${orderId}`)
  return { success: true }
}

export async function markAsShipped(orderId: string, trackingNumber: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'shipped',
      tracking_number: trackingNumber,
      shipped_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) return { error: 'Error al marcar como enviado.' }

  // TODO: Send shipping notification email via Resend
  // const order = await getOrderDetails(orderId)
  // await resend.emails.send({ ... })

  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${orderId}`)
  return { success: true }
}

export async function exportOrdersCSV() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (!orders || orders.length === 0) return { csv: '', error: 'No hay pedidos.' }

  const headers = [
    'ID', 'Estado', 'Email', 'Nombre', 'Libro', 'Niño/a',
    'Total', 'Ciudad', 'Región', 'Tracking', 'Creado',
  ]

  const rows = orders.map(o => [
    o.id.slice(0, 8).toUpperCase(),
    o.status,
    o.buyer_email,
    o.buyer_name,
    o.book_id?.slice(0, 8) || '',
    o.child_name || '',
    o.total_amount || '',
    o.shipping_city || '',
    o.shipping_region || '',
    o.tracking_number || '',
    new Date(o.created_at).toLocaleDateString('es-CL'),
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  return { csv }
}
