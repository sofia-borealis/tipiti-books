'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        {/* Watercolor-style illustration placeholder */}
        <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-blue/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl font-display font-bold text-blue/50">Oops</p>
            <p className="text-xs text-blue/30 mt-1">~acuarela~</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
          Algo salió mal
        </h1>
        <p className="mt-3 text-base text-text-light max-w-sm mx-auto">
          Hubo un error inesperado. Estamos trabajando para solucionarlo.
          Puedes intentar nuevamente o volver al inicio.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
