import { createAdminClient } from '@/lib/supabase/admin'
import { OrdersTable } from '@/components/admin/orders-table'

export default async function PedidosPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      buyer_name,
      buyer_email,
      child_name,
      total_amount,
      shipping_city,
      shipping_region,
      tracking_number,
      created_at
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">Pedidos</h1>
        <p className="text-sm text-text-muted mt-1">
          {orders?.length || 0} pedido{orders?.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
