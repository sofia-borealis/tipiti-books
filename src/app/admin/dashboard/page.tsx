import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from '@/components/admin/dashboard-cards'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DashboardAlerts } from '@/components/admin/dashboard-alerts'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Sales today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', today.toISOString())
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])

  const salesToday = (todayOrders || []).reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const orderCountToday = todayOrders?.length || 0

  // Pending orders (paid but not shipped)
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['paid', 'processing'])

  // Approved variants / total
  const { count: totalVariants } = await supabase
    .from('character_variants')
    .select('*', { count: 'exact', head: true })

  const { count: approvedVariants } = await supabase
    .from('character_variants')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  // Subscribers
  const { count: subscriberCount } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Last 7 days sales for chart
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { data: weekOrders } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])

  // Group by day
  const dailySales: { date: string; total: number; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = (weekOrders || []).filter(o =>
      o.created_at.startsWith(dateStr)
    )
    dailySales.push({
      date: dateStr,
      total: dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      count: dayOrders.length,
    })
  }

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, status, buyer_name, child_name, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Overdue alerts: paid orders older than 3 days
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const { data: overdueOrders } = await supabase
    .from('orders')
    .select('id, buyer_name, child_name, created_at')
    .eq('status', 'paid')
    .lt('created_at', threeDaysAgo.toISOString())
    .order('created_at')

  const formatCLP = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text font-display">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Bienvenida, Sofi</p>
      </div>

      {/* Alerts */}
      {overdueOrders && overdueOrders.length > 0 && (
        <DashboardAlerts orders={overdueOrders} />
      )}

      {/* Metric cards */}
      <DashboardCards
        salesToday={formatCLP(salesToday)}
        orderCountToday={orderCountToday}
        pendingOrders={pendingOrders || 0}
        approvedVariants={`${approvedVariants || 0}/${totalVariants || 0}`}
        subscriberCount={subscriberCount || 0}
      />

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales chart */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Ventas últimos 7 días</h2>
          <div className="flex items-end gap-1 h-32">
            {dailySales.map((day) => {
              const maxTotal = Math.max(...dailySales.map(d => d.total), 1)
              const height = day.total > 0 ? Math.max((day.total / maxTotal) * 100, 4) : 4
              const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short' })
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-text-muted">
                    {day.count > 0 ? day.count : ''}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-terracota/20 hover:bg-terracota/40 transition-colors"
                    style={{ height: `${height}%` }}
                    title={`${formatCLP(day.total)} (${day.count} pedidos)`}
                  />
                  <span className="text-[10px] text-text-muted">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent orders */}
        <RecentOrders orders={recentOrders || []} />
      </div>
    </div>
  )
}
