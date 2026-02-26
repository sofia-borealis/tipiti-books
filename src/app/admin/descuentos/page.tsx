import { createAdminClient } from '@/lib/supabase/admin'
import { DiscountManager } from '@/components/admin/discount-manager'

export default async function DescuentosPage() {
  const supabase = createAdminClient()

  const { data: codes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">Códigos de descuento</h1>
        <p className="text-sm text-text-muted mt-1">
          {codes?.length || 0} código{codes?.length !== 1 ? 's' : ''} creados
        </p>
      </div>

      <DiscountManager codes={codes || []} />
    </div>
  )
}
