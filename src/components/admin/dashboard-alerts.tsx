import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface OverdueOrder {
  id: string
  buyer_name: string
  child_name: string | null
  created_at: string
}

interface DashboardAlertsProps {
  orders: OverdueOrder[]
}

export function DashboardAlerts({ orders }: DashboardAlertsProps) {
  return (
    <div className="bg-terracota/5 border border-terracota/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-terracota" />
        <h2 className="text-sm font-semibold text-terracota-dark">
          Pedidos atrasados ({orders.length})
        </h2>
      </div>
      <p className="text-xs text-text-muted mb-3">
        Estos pedidos fueron pagados hace más de 3 días y aún no han sido enviados.
      </p>
      <div className="space-y-2">
        {orders.map(order => {
          const daysAgo = Math.floor(
            (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24)
          )
          return (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-cream/50 transition-colors"
            >
              <div>
                <span className="text-sm text-text">{order.buyer_name}</span>
                <span className="text-xs text-text-muted ml-2">
                  {order.child_name || ''}
                </span>
              </div>
              <span className="text-xs text-terracota font-medium">
                hace {daysAgo} días
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
