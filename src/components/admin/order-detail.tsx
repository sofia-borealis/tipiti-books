'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateOrderStatus, markAsShipped } from '@/app/admin/pedidos/actions'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Download,
  FileText,
} from 'lucide-react'

interface OrderDetailProps {
  order: {
    id: string
    status: string
    buyer_name: string
    buyer_email: string
    buyer_phone: string | null
    child_name: string | null
    book_id: string | null
    variant_id: string | null
    dedication: string | null
    total_amount: number | null
    discount_code: string | null
    discount_amount: number | null
    payment_method: string | null
    payment_id: string | null
    shipping_address: string | null
    shipping_city: string | null
    shipping_region: string | null
    tracking_number: string | null
    shipped_at: string | null
    print_file_url: string | null
    created_at: string
  }
  bookTitle: string
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const TIMELINE_STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export function OrderDetail({ order, bookTitle }: OrderDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '')
  const [error, setError] = useState('')

  const formatCLP = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
  }

  const handleStatusChange = (newStatus: string) => {
    setError('')
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus)
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  const handleMarkShipped = () => {
    if (!trackingNumber.trim()) {
      setError('Ingresa un número de seguimiento.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await markAsShipped(order.id, trackingNumber.trim())
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status)

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-4 py-3 text-sm text-terracota-dark">
          {error}
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="flex items-center justify-between mb-6">
          {TIMELINE_STEPS.map((step, i) => {
            const isCompleted = i <= currentStepIndex && order.status !== 'cancelled'
            const isCurrent = step === order.status
            return (
              <div key={step} className="flex items-center flex-1 last:flex-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-terracota text-white'
                        : isCompleted
                          ? 'bg-sage text-white'
                          : 'bg-cream text-text-muted'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted mt-1 text-center">
                    {STATUS_OPTIONS.find(s => s.value === step)?.label}
                  </span>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                      i < currentStepIndex ? 'bg-sage' : 'bg-border-light'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Manual status change */}
        <div className="flex items-center gap-3 pt-4 border-t border-border-light">
          <span className="text-sm text-text-muted">Cambiar estado:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text outline-none focus-visible:border-terracota"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order info */}
        <div className="bg-white rounded-xl border border-border-light p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text flex items-center gap-2">
            <Package className="w-4 h-4 text-terracota" />
            Información del pedido
          </h2>
          <InfoRow icon={<FileText />} label="Libro" value={bookTitle ? bookTitle.replace('{name}', order.child_name || '...') : '-'} />
          <InfoRow icon={<User />} label="Niño/a" value={order.child_name || '-'} />
          {order.dedication && (
            <div>
              <p className="text-xs text-text-muted mb-1">Dedicatoria</p>
              <p className="text-sm text-text italic bg-cream rounded-lg p-3">&ldquo;{order.dedication}&rdquo;</p>
            </div>
          )}
          <InfoRow icon={<CreditCard />} label="Total" value={formatCLP(order.total_amount)} />
          {order.discount_code && (
            <InfoRow icon={<CreditCard />} label="Descuento" value={`${order.discount_code} (${formatCLP(order.discount_amount)})`} />
          )}
          <InfoRow icon={<CreditCard />} label="Medio de pago" value={order.payment_method || '-'} />
          {order.payment_id && (
            <InfoRow icon={<CreditCard />} label="ID pago" value={order.payment_id} />
          )}
        </div>

        {/* Buyer + Shipping */}
        <div className="bg-white rounded-xl border border-border-light p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text flex items-center gap-2">
            <Truck className="w-4 h-4 text-terracota" />
            Envío y comprador
          </h2>
          <InfoRow icon={<User />} label="Nombre" value={order.buyer_name} />
          <InfoRow icon={<Mail />} label="Email" value={order.buyer_email} />
          <InfoRow icon={<Phone />} label="Teléfono" value={order.buyer_phone || '-'} />
          <InfoRow icon={<MapPin />} label="Dirección" value={order.shipping_address || '-'} />
          <InfoRow icon={<MapPin />} label="Ciudad" value={`${order.shipping_city || '-'}, ${order.shipping_region || '-'}`} />

          {/* Tracking section */}
          <div className="pt-3 border-t border-border-light">
            <p className="text-xs text-text-muted mb-2">Número de seguimiento</p>
            <div className="flex gap-2">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ej: CL1234567890"
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleMarkShipped}
                disabled={isPending}
              >
                <Truck className="w-3.5 h-3.5" />
                Enviado
              </Button>
            </div>
            {order.shipped_at && (
              <p className="text-xs text-sage mt-1">
                Enviado el {new Date(order.shipped_at).toLocaleDateString('es-CL')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PDF download */}
      {order.print_file_url && (
        <div className="bg-white rounded-xl border border-border-light p-4 flex items-center gap-3">
          <Download className="w-5 h-5 text-terracota" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">PDF listo para imprimir</p>
            <p className="text-xs text-text-muted">Archivo generado y listo para descarga</p>
          </div>
          <Button variant="secondary" asChild>
            <a href={order.print_file_url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Descargar PDF
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-muted/50 w-4 h-4 shrink-0">{icon}</span>
      <span className="text-xs text-text-muted w-20 shrink-0">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  )
}
