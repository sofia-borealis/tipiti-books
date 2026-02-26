import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        {/* Watercolor-style illustration placeholder */}
        <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-terracota/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl font-display font-bold text-terracota/60">404</p>
            <p className="text-xs text-terracota/40 mt-1">~acuarela~</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
          Página no encontrada
        </h1>
        <p className="mt-3 text-base text-text-light max-w-sm mx-auto">
          Esta página se perdió entre las páginas de un cuento.
          Pero no te preocupes, hay muchas historias por descubrir.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/catalogo">
              <BookOpen className="w-4 h-4" />
              Ver catálogo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
