'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { validateDiscount } from '@/app/(storefront)/actions/validate-discount'
import { createOrder } from '@/app/(storefront)/actions/create-order'
import { Lock, Tag, Check, CreditCard } from 'lucide-react'

const regiones = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
  'Coquimbo', 'Valparaíso', 'Metropolitana', "O'Higgins",
  'Maule', 'Ñuble', 'Biobío', 'Araucanía',
  'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
]

const PRICE = 29990

export default function CheckoutPage() {
  const router = useRouter()
  const { bookId, childName, dedication, gender, skinTone, hairColor, hairType, hasGlasses } = useConfiguratorStore()
  const [isPending, startTransition] = useTransition()

  // Form state
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [subscribe, setSubscribe] = useState(true)
  const [paymentProvider, setPaymentProvider] = useState<'flow' | 'mercadopago'>('flow')

  // Discount state
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState<{ id: string; code: string; type: string; value: number } | null>(null)
  const [discountError, setDiscountError] = useState('')

  // Error state
  const [error, setError] = useState('')

  const discountAmount = discount
    ? discount.type === 'percentage'
      ? Math.round(PRICE * discount.value / 100)
      : discount.value
    : 0
  const total = Math.max(PRICE - discountAmount, 0)

  const formattedPrice = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

  const handleApplyDiscount = () => {
    startTransition(async () => {
      setDiscountError('')
      const result = await validateDiscount(discountCode)
      if (result.valid && result.discount) {
        setDiscount(result.discount)
      } else {
        setDiscount(null)
        setDiscountError(result.error || 'Código no válido.')
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!buyerName || !buyerEmail || !address || !city || !region) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    startTransition(async () => {
      const result = await createOrder({
        bookId: bookId || '',
        childName: childName || '',
        dedication: dedication || undefined,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || undefined,
        shippingAddress: address,
        shippingCity: city,
        shippingRegion: region,
        discountCodeId: discount?.id,
        discountAmount,
        paymentProvider,
        subscribeNewsletter: subscribe,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.orderId) {
        // TODO: When payment providers are configured, redirect to payment URL
        // For now, go to success page
        router.push(`/pago/success?order=${result.orderId}`)
      }
    })
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center mb-8">
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping info */}
            <div className="bg-white rounded-2xl border border-border-light p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Datos de envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Nombre completo *</label>
                  <Input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Tu nombre" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Email *</label>
                    <Input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} placeholder="tu@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Teléfono</label>
                    <Input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="+56 9 1234 5678" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Dirección *</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, depto" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Ciudad *</label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Santiago" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Región *</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      className="h-12 w-full rounded-xl border-[1.5px] border-border bg-white px-4 text-base text-text outline-none focus-visible:border-terracota focus-visible:ring-[3px] focus-visible:ring-terracota/15"
                    >
                      <option value="">Selecciona región</option>
                      {regiones.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount code */}
            <div className="bg-white rounded-2xl border border-border-light p-6">
              <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Tag className="w-4.5 h-4.5 text-terracota" />
                Código de descuento
              </h2>
              <div className="flex gap-3">
                <Input
                  value={discountCode}
                  onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError('') }}
                  placeholder="TIPITI20"
                  className="flex-1"
                  disabled={!!discount}
                />
                {discount ? (
                  <Button type="button" variant="secondary" size="sm" onClick={() => { setDiscount(null); setDiscountCode('') }}>
                    Quitar
                  </Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={handleApplyDiscount} disabled={isPending || !discountCode.trim()}>
                    Aplicar
                  </Button>
                )}
              </div>
              {discount && (
                <p className="mt-2 text-sm text-sage-dark flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {discount.code}: {discount.type === 'percentage' ? `${discount.value}% de descuento` : formattedPrice(discount.value)}
                </p>
              )}
              {discountError && (
                <p className="mt-2 text-sm text-terracota-dark">{discountError}</p>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-border-light p-6">
              <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-terracota" />
                Método de pago
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('flow')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentProvider === 'flow'
                      ? 'border-terracota bg-terracota/5'
                      : 'border-border-light hover:border-border bg-white'
                  }`}
                >
                  <p className="text-sm font-medium text-text">Flow.cl</p>
                  <p className="text-xs text-text-muted mt-1">Tarjeta o transferencia</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentProvider('mercadopago')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentProvider === 'mercadopago'
                      ? 'border-terracota bg-terracota/5'
                      : 'border-border-light hover:border-border bg-white'
                  }`}
                >
                  <p className="text-sm font-medium text-text">MercadoPago</p>
                  <p className="text-xs text-text-muted mt-1">Todas las opciones</p>
                </button>
              </div>
            </div>

            {/* Newsletter */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-terracota"
              />
              <span className="text-sm text-text-light">
                Quiero recibir novedades y ofertas de Tipiti Books
              </span>
            </label>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border-light p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-text mb-4">Resumen del pedido</h2>

              {/* Book preview */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-border-light">
                <div className="w-20 h-16 shrink-0 rounded-lg bg-rose/15 flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Buenas Noches, {childName || '...'}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Personalizado para {childName || '...'}
                  </p>
                </div>
              </div>

              {/* Prices */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-light">Subtotal</span>
                  <span className="text-text">{formattedPrice(PRICE)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sage-dark">
                    <span>Descuento ({discount?.code})</span>
                    <span>-{formattedPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-light">Envío</span>
                  <span className="text-sage-dark font-medium">Gratis</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border-light text-base font-bold">
                  <span className="text-text">Total</span>
                  <span className="text-terracota">{formattedPrice(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full mt-6" disabled={isPending}>
                <Lock className="w-4 h-4" />
                {isPending ? 'Procesando...' : `Pagar ${formattedPrice(total)}`}
              </Button>

              {error && (
                <p className="mt-3 text-sm text-terracota-dark text-center">{error}</p>
              )}

              <p className="mt-3 text-xs text-text-muted text-center">
                Pago seguro con encriptación SSL
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
