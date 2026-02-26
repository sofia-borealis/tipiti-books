import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderDetail } from '@/components/admin/order-detail'
import { ArrowLeft } from 'lucide-react'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (!order) notFound()

  // Fetch associated book title
  let bookTitle = ''
  if (order.book_id) {
    const { data: book } = await supabase
      .from('books')
      .select('title_template')
      .eq('id', order.book_id)
      .single()
    bookTitle = book?.title_template || ''
  }

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a pedidos
      </Link>

      <h1 className="text-2xl font-bold text-text font-display mb-1">
        Pedido #{orderId.slice(0, 8).toUpperCase()}
      </h1>
      <p className="text-sm text-text-muted mb-6">
        {new Date(order.created_at).toLocaleDateString('es-CL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <OrderDetail order={order} bookTitle={bookTitle} />
    </div>
  )
}
