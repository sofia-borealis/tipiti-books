'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle, RotateCcw, Mail } from 'lucide-react'

export default function FailurePage() {
  return (
    <div className="max-w-[640px] mx-auto px-5 py-16 md:py-24 text-center">
      {/* Error icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-terracota/15 flex items-center justify-center">
        <XCircle className="w-10 h-10 text-terracota" strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
        Pago no completado
      </h1>
      <p className="mt-3 text-base text-text-light max-w-md mx-auto">
        Hubo un problema con tu pago. No se realizó ningún cobro. Puedes intentar nuevamente.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/checkout">
            <RotateCcw className="w-4 h-4" />
            Intentar nuevamente
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>

      {/* Support */}
      <div className="mt-8 flex items-start gap-3 text-left bg-blue/10 rounded-xl p-4 max-w-sm mx-auto">
        <Mail className="w-5 h-5 text-blue shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-text">¿Necesitas ayuda?</p>
          <a
            href="mailto:hola@tipitibooks.com"
            className="text-sm text-blue hover:text-terracota transition-colors"
          >
            hola@tipitibooks.com
          </a>
        </div>
      </div>
    </div>
  )
}
