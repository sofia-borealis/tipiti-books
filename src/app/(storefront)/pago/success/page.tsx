'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const { childName, reset } = useConfiguratorStore()

  return (
    <div className="max-w-[640px] mx-auto px-5 py-16 md:py-24 text-center">
      {/* Checkmark */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage/15 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-sage" strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
        ¡Pedido confirmado!
      </h1>
      <p className="mt-3 text-base text-text-light max-w-md mx-auto">
        El libro de {childName || 'tu hijo/a'} está en camino. Gracias por confiar en Tipiti Books.
      </p>

      {/* Order ticket */}
      <div className="mt-8 bg-white rounded-2xl border border-border-light shadow-[0_4px_20px_rgba(196,125,90,0.08)] p-6 text-left">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-light">
          <Package className="w-5 h-5 text-terracota" />
          <span className="text-sm font-medium text-text">Detalles del pedido</span>
        </div>

        <div className="space-y-3 text-sm">
          {orderId && (
            <div className="flex justify-between">
              <span className="text-text-muted">N° Pedido</span>
              <span className="text-text font-mono text-xs">{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-muted">Libro</span>
            <span className="text-text">Buenas Noches, {childName || '...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Entrega estimada</span>
            <span className="text-text">8-12 días hábiles</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 flex items-start gap-3 text-left bg-blue/10 rounded-xl p-4">
        <Mail className="w-5 h-5 text-blue shrink-0 mt-0.5" />
        <p className="text-sm text-text-light">
          Recibirás un email de confirmación con los detalles de tu pedido y un enlace para seguir el envío.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild onClick={() => reset()}>
          <Link href="/catalogo">
            Seguir comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-text-muted">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
