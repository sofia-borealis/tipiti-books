import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'

interface Order {
  id: string
  status: string
  buyer_name: string
  child_name: string | null
  total_amount: number | null
  created_at: string
}

interface RecentOrdersProps {
  orders: Order[]
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'text-text-muted bg-cream' },
  paid: { label: 'Pagado', className: 'text-blue bg-blue/10' },
  processing: { label: 'En proceso', className: 'text-terracota bg-terracota/10' },
  shipped: { label: 'Enviado', className: 'text-sage bg-sage/10' },
  delivered: { label: 'Entregado', className: 'text-sage bg-sage/20' },
  cancelled: { label: 'Cancelado', className: 'text-terracota-dark bg-terracota/10' },
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCLP = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl border border-border-light shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text">Pedidos recientes</h2>
        <Link
          href="/admin/pedidos"
          className="text-xs text-terracota hover:text-terracota-dark transition-colors flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map(order => {
            const s = STATUS_LABELS[order.status] || STATUS_LABELS['pending']
            return (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-cream/50 transition-colors"
              >
                <Package className="w-4 h-4 text-terracota shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{order.buyer_name}</p>
                  <p className="text-xs text-text-muted">
                    {order.child_name || 'Sin nombre'} · {new Date(order.created_at).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${s.className}`}>
                  {s.label}
                </span>
                <span className="text-sm font-medium text-text shrink-0">
                  {formatCLP(order.total_amount)}
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-text-muted text-center py-6">No hay pedidos aún</p>
      )}
    </div>
  )
}
