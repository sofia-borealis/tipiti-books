'use client'

import Link from 'next/link'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { BookPreview } from '@/components/storefront/book-preview'
import { ShareButton } from '@/components/storefront/share-button'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ChevronLeft } from 'lucide-react'

// Placeholder scenes — in production these come from variant_pages + scenes query
const placeholderPages = [
  { sceneNumber: 0, narrative: 'Buenas Noches, {name}' },
  { sceneNumber: 1, narrative: 'Es hora de dormir, {name}. El cielo oscuro nos invita a descansar...' },
  { sceneNumber: 2, narrative: 'Nos ponemos nuestro pijama más suavito. ¡Shhhh! Mira, un ratoncito nos observa...' },
  { sceneNumber: 3, narrative: '¡Zzzzz zzzzz! Cepillamos nuestros dientes para que brillen. ¿Ves la mariposa en la ventana?' },
  { sceneNumber: 4, narrative: 'Un vaso de leche tibia nos espera. ¡Muu! Hasta la vaca nos dice que es hora de descansar...' },
  { sceneNumber: 5, narrative: 'Mamá nos lee un cuento mágico. Nuestros amigos de peluche también escuchan...' },
  { sceneNumber: 6, narrative: 'Nos arropamos bajo nuestras sábanas suavitas. Nuestro amigo teddy nos acompaña...' },
  { sceneNumber: 7, narrative: 'Buenas noches, juguetes. Buenas noches, ventana. ¡Que duerman bien todos!' },
  { sceneNumber: 8, narrative: 'Y así comienzan nuestros sueños mágicos... Volamos entre nubes de algodón...' },
  { sceneNumber: 9, narrative: '¡Splash! Saltamos en charcos de estrellas. Nuestros amigos del bosque nos acompañan...' },
  { sceneNumber: 10, narrative: 'Rodeados de amor y magia, dormimos profundamente. Seguros. Felices.' },
]

export default function PreviewPage() {
  const { childName, bookTitle, dedication } = useConfiguratorStore()

  const displayTitle = bookTitle
    ? bookTitle.replace('{name}', childName || '...')
    : `Buenas Noches, ${childName || '...'}`

  // Add dedication page if there's one
  const pages = dedication.trim()
    ? [...placeholderPages, { sceneNumber: 11, narrative: dedication }]
    : placeholderPages

  return (
    <div className="max-w-[960px] mx-auto px-5 md:px-10 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/wizard/paso-4">
            <ChevronLeft className="w-4 h-4" />
            Volver al resumen
          </Link>
        </Button>
        <ShareButton title={displayTitle} />
      </div>

      <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center mb-2">
        {displayTitle}
      </h1>
      <p className="text-base text-text-light text-center mb-8">
        Así se verá el libro de {childName || '...'}.
      </p>

      {/* Book preview */}
      <BookPreview pages={pages} childName={childName} />

      {/* Bottom CTA */}
      <div className="mt-10 sticky bottom-4 z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-border-light shadow-[0_-4px_20px_rgba(196,125,90,0.1)] p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-terracota font-display">$29.990</p>
            <p className="text-xs text-text-muted">Envío gratis a todo Chile</p>
          </div>
          <Button asChild size="lg">
            <Link href="/checkout">
              <ShoppingCart className="w-5 h-5" />
              Comprar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
