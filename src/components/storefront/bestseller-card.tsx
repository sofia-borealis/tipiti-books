import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function BestsellerCard() {
  return (
    <div className="bg-white rounded-lg border border-rule-light overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col md:flex-row">
        {/* Book mockup */}
        <div className="md:w-[45%] relative bg-linen flex items-center justify-center p-8 md:p-12">
          <div role="img" aria-label="Portada del libro Un día con mi mamá" className="relative aspect-[3/4] w-full max-w-[280px] mx-auto">
            <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-ink/10 to-transparent w-[6px]" />
            <div className="w-full h-full rounded-sm bg-cream-warm border border-rule shadow-[4px_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center p-6">
              <div className="text-center">
                <p className="font-handwritten text-2xl text-terracota">Un día con</p>
                <p className="font-display text-3xl font-bold text-ink mt-1">mi mamá</p>
                <div className="mt-4 w-12 h-[1px] bg-rule mx-auto" />
                <p className="mt-3 text-xs text-ink-muted uppercase tracking-wider">Tipiti Books</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-berry">
            Libro personalizado
          </span>
          <h3 className="mt-3 text-2xl md:text-3xl font-display font-bold text-ink">
            Un día con mi mamá
          </h3>
          <p className="mt-2 text-sm italic text-terracota">
            Ilustrado en acuarela por artista profesional
          </p>
          <p className="mt-4 text-base text-ink-soft leading-relaxed">
            Un libro donde tu hijo vive una aventura especial junto a mamá.
            Cada página está ilustrada a mano y personalizada con su nombre y apariencia.
          </p>

          {/* Spec tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['Tapa dura', '28 páginas', 'Papel 200g', 'Dedicatoria', 'Acuarela original'].map(
              (spec) => (
                <span
                  key={spec}
                  className="px-3 py-1.5 rounded-[4px] bg-linen text-xs text-ink-soft border border-rule-light"
                >
                  {spec}
                </span>
              )
            )}
          </div>

          {/* TODO: actualizar href cuando exista el libro en DB */}
          <div className="mt-8">
            <Button variant="forest" size="lg" asChild>
              <Link href="/catalogo">
                Personalizar este libro
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
