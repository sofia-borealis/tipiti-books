import Link from 'next/link'
import { Palette, Wand2, Package, Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GalleryCarousel } from '@/components/storefront/gallery-carousel'
import { WaitlistForm } from '@/components/storefront/waitlist-form'

const steps = [
  {
    num: 1,
    icon: Palette,
    title: 'Elige el libro y personaliza',
    description: 'Selecciona nombre, apariencia y dedicatoria.',
  },
  {
    num: 2,
    icon: Wand2,
    title: 'Nosotros creamos tu libro',
    description: 'Con IA + ilustraciones de artista.',
  },
  {
    num: 3,
    icon: Package,
    title: 'Recíbelo en casa',
    description: 'Impresión premium, listo para regalar.',
  },
]

export default function Home() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-10 md:py-16">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
            {/* Text — 45% */}
            <div className="flex-1 md:max-w-[45%] text-center md:text-left">
              <h1 className="text-[32px] md:text-[48px] leading-[1.15] font-display font-extrabold text-text">
                Un libro donde tu hijo es{' '}
                <span className="text-terracota">la estrella</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-text-light leading-relaxed max-w-md mx-auto md:mx-0">
                Ilustraciones a mano, personalizadas con amor. Cada página cuenta su historia.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 md:justify-start justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/catalogo">
                    <Sparkles className="w-5 h-5" />
                    Crea tu libro
                  </Link>
                </Button>
                <a
                  href="#galeria"
                  className="inline-flex items-center gap-1.5 text-base text-blue hover:underline underline-offset-4 transition-colors"
                >
                  Ver ejemplos
                  <ChevronDown className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Illustration placeholder — 55% */}
            <div className="flex-1 md:max-w-[55%] w-full">
              <div className="aspect-[4/3] rounded-2xl bg-rose/20 border border-border-light flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-white/50 flex items-center justify-center">
                    <span className="text-6xl">📖</span>
                  </div>
                  <p className="text-sm text-text-muted font-display">
                    Ilustración acuarela
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NUESTRA HISTORIA ═══════ */}
      <section id="nuestra-historia" className="border-t border-border-light">
        <div className="max-w-[960px] mx-auto px-5 md:px-10 py-16 md:py-20">
          {/* Decorative separator */}
          <div className="flex items-center justify-center mb-12 md:mb-16">
            <span className="text-2xl opacity-40">✦</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Photo placeholder — 40% */}
            <div className="w-full md:w-[40%] shrink-0">
              <div className="aspect-square max-w-[300px] mx-auto rounded-xl bg-rose/15 border border-border-light flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/50 flex items-center justify-center">
                    <span className="text-3xl">👩‍👧</span>
                  </div>
                  <p className="text-xs text-text-muted">Foto de Sofi</p>
                </div>
              </div>
            </div>

            {/* Text — 60% */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-6">
                Nuestra Historia
              </h2>
              <p className="text-base text-text leading-[1.8] max-w-[500px] mx-auto md:mx-0">
                Soy Sofi, mamá de una niña que amaba los cuentos antes de dormir.
                Quise un libro donde ella fuera la protagonista, donde viera su
                nombre en cada página. Así nació Tipiti Books — libros personalizados
                ilustrados a mano, con la calidad premium que los niños merecen.
              </p>
              <p className="mt-5 text-sm font-display font-semibold text-text-light tracking-wide">
                Artesanía · Calidad · Amor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CÓMO FUNCIONA ═══════ */}
      <section id="como-funciona" className="border-t border-border-light">
        <div className="max-w-[960px] mx-auto px-5 md:px-10 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-12 md:mb-16">
            Cómo Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-cream-dark rounded-2xl border border-border-light p-8 text-center hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(196,125,90,0.12)] transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-terracota flex items-center justify-center">
                  <span className="text-cream font-display font-extrabold text-xl">
                    {step.num}
                  </span>
                </div>
                <step.icon className="w-10 h-10 mx-auto mb-4 text-terracota" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-text mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-text-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GALERÍA ═══════ */}
      <section id="galeria" className="border-t border-border-light">
        <div className="max-w-[960px] mx-auto px-5 md:px-10 py-16 md:py-20">
          <h2 className="text-[28px] md:text-[32px] font-display font-bold text-text text-center mb-8 md:mb-10">
            Busca al osito en cada página
          </h2>
          <GalleryCarousel />
        </div>
      </section>

      {/* ═══════ WAITLIST ═══════ */}
      <section id="waitlist" className="border-t border-border-light">
        <div className="max-w-[960px] mx-auto px-5 md:px-10 py-16 md:py-20">
          <div className="bg-cream-dark rounded-[20px] border border-border-light px-6 py-12 md:px-16 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-3">
              Sé de los primeros
            </h2>
            <p className="text-base text-text-light mb-8 max-w-md mx-auto">
              Primeros 50 compradores reciben <strong className="text-terracota">TIPITI20</strong>: 20% de descuento.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </>
  )
}
