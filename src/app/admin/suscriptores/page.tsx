import { createAdminClient } from '@/lib/supabase/admin'
import { Users } from 'lucide-react'
import { SubscribersTable } from '@/components/admin/subscribers-table'

export default async function SuscriptoresPage() {
  const supabase = createAdminClient()

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, source, is_active, subscribed_at')
    .order('subscribed_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-6 h-6 text-terracota" strokeWidth={1.5} />
        <h1 className="text-2xl font-display font-bold text-text">Suscriptores</h1>
      </div>

      {error ? (
        <div className="bg-terracota/10 text-terracota-dark rounded-xl p-4 text-sm">
          Error al cargar suscriptores. Intenta recargar la página.
        </div>
      ) : (
        <SubscribersTable subscribers={subscribers || []} />
      )}
    </div>
  )
}
