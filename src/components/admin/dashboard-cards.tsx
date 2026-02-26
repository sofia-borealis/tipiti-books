import {
  DollarSign,
  ShoppingCart,
  Sparkles,
  Users,
} from 'lucide-react'

interface DashboardCardsProps {
  salesToday: string
  orderCountToday: number
  pendingOrders: number
  approvedVariants: string
  subscriberCount: number
}

export function DashboardCards({
  salesToday,
  orderCountToday,
  pendingOrders,
  approvedVariants,
  subscriberCount,
}: DashboardCardsProps) {
  const cards = [
    {
      label: 'Ventas hoy',
      value: salesToday,
      subtitle: `${orderCountToday} pedido${orderCountToday !== 1 ? 's' : ''}`,
      icon: DollarSign,
      iconColor: 'text-sage',
      iconBg: 'bg-sage/10',
    },
    {
      label: 'Pedidos pendientes',
      value: pendingOrders.toString(),
      subtitle: 'pagados sin enviar',
      icon: ShoppingCart,
      iconColor: 'text-terracota',
      iconBg: 'bg-terracota/10',
    },
    {
      label: 'Variantes aprobadas',
      value: approvedVariants,
      subtitle: 'del total generado',
      icon: Sparkles,
      iconColor: 'text-blue',
      iconBg: 'bg-blue/10',
    },
    {
      label: 'Suscriptores',
      value: subscriberCount.toString(),
      subtitle: 'activos en waitlist',
      icon: Users,
      iconColor: 'text-terracota',
      iconBg: 'bg-terracota/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-border-light p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-muted">{card.label}</p>
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">{card.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{card.subtitle}</p>
          </div>
        )
      })}
    </div>
  )
}
