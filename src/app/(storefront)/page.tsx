import Link from 'next/link'
import Image from 'next/image'
import { Book, Pencil, MessageSquare, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrustStrip } from '@/components/storefront/trust-strip'
import { AnimateOnScroll } from '@/components/storefront/animate-on-scroll'
import { CategoriesGrid } from '@/components/storefront/categories-grid'
import { BestsellerCard } from '@/components/storefront/bestseller-card'
import { LifestyleBreak } from '@/components/storefront/lifestyle-break'
import { ReviewsGrid } from '@/components/storefront/reviews-grid'
import { WaitlistForm } from '@/components/storefront/waitlist-form'
import { BookFAQ } from '@/components/storefront/book-faq'

const steps = [
  {
    icon: Book,
    title: 'Elige un libro',
    description: 'Encuentra la historia perfecta para alguien especial.',
  },
  {
    icon: Pencil,
    title: 'Personalízalo',
    description: 'Nombre, apariencia y detalles que lo hacen único.',
  },
  {
    icon: MessageSquare,
    title: 'Agrega un mensaje',
    description: 'Una dedicatoria personal en la primera página.',
  },
  {
    icon: Heart,
    title: 'Regala para recordar',
    description: 'Impreso y enviado gratis, listo para regalar.',
  },
]

export default function Home() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[500px] max-h-[640px] h-[70vh] flex items-center justify-center">
        <Image
          src="/hero-wonderbly-v3.png"
          alt="Madre e hijo leyendo un libro personalizado, vista desde arriba"
          fill
          sizes="100vw"
          className="object-cover object-[center_70%]"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 text-center px-6 max-w-[640px]">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
            Regalos que se leen, se abrazan y se guardan para siempre
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/90 leading-relaxed max-w-md mx-auto">
            Libros infantiles personalizados con ilustraciones acuarela pintadas a mano.
          </p>
          <div className="mt-8">
            <Button variant="forest" size="lg" asChild>
              <Link href="/catalogo">
                Personaliza tu libro
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST STRIP ═══════ */}
      <TrustStrip />

      {/* ═══════ CATEGORÍAS ═══════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink">
              Para tus personas favoritas
            </h2>
          </div>
          <AnimateOnScroll>
            <CategoriesGrid />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ BESTSELLER ═══════ */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-berry">
              Nuestro libro
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-ink">
              Personaliza un bestseller
            </h2>
          </div>
          <AnimateOnScroll>
            <BestsellerCard />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ LIFESTYLE BREAK ═══════ */}
      <LifestyleBreak
        imageSrc="/lifestyle-reading-bed.png"
        alt="Madre abrazando a su hijo mientras leen un libro en la cama"
        heading="Regalos que se guardan para siempre"
        subtitle="Cada libro es tan único como la persona que lo recibe"
      />

      {/* ═══════ CÓMO FUNCIONA ═══════ */}
      <section id="como-funciona" className="py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink">
              Cómo funciona
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <AnimateOnScroll key={step.title} delay={i * 0.12}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-berry flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-cream" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-display font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      <section className="bg-[#F9F9F7] py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink">
              Lo que dicen las familias
            </h2>
          </div>
          <AnimateOnScroll>
            <ReviewsGrid />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ NUESTRA HISTORIA ═══════ */}
      <AnimateOnScroll>
        <section id="nuestra-historia" className="py-16 md:py-20">
          <div className="max-w-[1100px] mx-auto px-5 md:px-10">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              {/* Photo */}
              <div className="w-full md:w-[32%] shrink-0">
                  <div className="aspect-square max-w-[260px] mx-auto rounded-full overflow-hidden shadow-[0_8px_32px_rgba(45,74,62,0.12)]">
                  <Image
                    src="/sofi-founder.jpg"
                    alt="Sofi, fundadora de Tipiti Books"
                    width={560}
                    height={560}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-berry">
                  Detrás de Tipiti
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-ink mb-6">
                  Nuestra Historia
                </h2>
                <p className="text-base text-ink-soft leading-[1.8]">
                  Soy Sofi, mamá de dos pequeños en una familia bilingüe.
                  La hora de la lectura es nuestro momento favorito del día.
                </p>
                <p className="mt-4 text-base text-ink-soft leading-[1.8]">
                  Todo empezó cuando nació mi hija menor. Le regalamos a mi hijo
                  un libro para explicarle la llegada de su hermanita, y el niño
                  del cuento se parecía mucho a él: el pelo, la piel, sus lentes.
                  Nunca voy a olvidar cómo le brillaban los ojos al verse en esas páginas.
                </p>
                <p className="mt-4 text-base text-ink-soft leading-[1.8]">
                  Ahí nació Tipiti Books. Para que más niños se vean reflejados
                  en un cuento, y más papás, hermanos y abuelos puedan regalar
                  eso: un libro que es sobre ellos de verdad.
                </p>
                <p className="mt-5 font-handwritten text-lg text-ink-muted">
                  — Sofi, fundadora de Tipiti Books
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ═══════ FAQ ═══════ */}
      <AnimateOnScroll>
        <section id="preguntas" className="border-t border-rule-light py-16 md:py-20">
          <div className="max-w-[720px] mx-auto px-5 md:px-10">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ink">
                Preguntas frecuentes
              </h2>
            </div>
            <BookFAQ />
          </div>
        </section>
      </AnimateOnScroll>

      {/* ═══════ CTA / WAITLIST ═══════ */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[720px] mx-auto px-5 md:px-10">
          <AnimateOnScroll>
            <div className="bg-[#F9F9F7] rounded-xl border border-rule-light px-6 py-12 md:px-16 md:py-16 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-berry">
                Edición de lanzamiento
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold text-ink">
                Crea un recuerdo que dure para siempre
              </h2>
              <p className="mt-3 text-base text-ink-soft mb-8 max-w-md mx-auto">
                Únete a la lista y sé de los primeros en tener un libro Tipiti.
              </p>
              <WaitlistForm />
              <p className="mt-4 text-xs text-ink-muted">
                Código <strong className="text-berry">TIPITI20</strong> → 20% off para los primeros 50
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Brand Values + Newsletter are now integrated into the footer */}
    </>
  )
}
