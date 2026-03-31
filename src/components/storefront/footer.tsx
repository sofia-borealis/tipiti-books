'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, CheckCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { subscribe } from '@/app/(storefront)/actions/subscribe'
import { Button } from '@/components/ui/button'

/* ── Badge data ── */

const badges = [
  {
    image: '/badges/pintado-a-mano.png',
    title: 'Pintado a mano',
    description:
      'Cada ilustración es una acuarela original pintada por una artista profesional.',
  },
  {
    image: '/badges/hecho-con-carino.png',
    title: 'Hecho con cariño',
    description:
      'Calidad premium en cada detalle — del papel al acabado de la tapa.',
  },
  {
    image: '/badges/creado-por-mamas.png',
    title: 'Creado por mamás',
    description:
      'Diseñado por una mamá, para familias como la tuya.',
  },
]

/* ── Newsletter form (client) ── */

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    startTransition(async () => {
      try {
        await subscribe(email)
        setState('success')
        setEmail('')
      } catch {
        setState('error')
      }
    })
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 text-ink-soft">
        <CheckCircle className="w-5 h-5 text-berry" />
        <p className="text-sm">Te avisaremos cuando haya novedades.</p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="flex-1 h-12 px-4 bg-transparent border-b border-ink-faint text-ink placeholder:text-ink-muted text-sm focus:outline-none focus:border-ink-soft transition-colors"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-berry text-cream rounded-none uppercase tracking-[0.06em] font-light text-sm hover:bg-berry-deep h-12 px-6 shrink-0"
        >
          {isPending ? '...' : 'Suscribirme'}
        </Button>
      </form>
      {state === 'error' && (
        <p className="mt-2 text-xs text-berry">Hubo un error. Intenta de nuevo.</p>
      )}
    </>
  )
}

/* ── Footer ── */

export function StorefrontFooter() {
  return (
    <footer className="bg-[#FAF5EB]">
      {/* ── Brand Values (top) ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-14 pb-10 md:pt-16 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {badges.map((b) => (
            <div key={b.title} className="flex items-center gap-5">
              <div className="w-[64px] h-[64px] shrink-0 flex items-center justify-center">
                <Image
                  src={b.image}
                  alt={b.title}
                  width={64}
                  height={64}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-display font-light text-ink">
                  {b.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="border-t border-[#DDD6CA]" />
      </div>

      {/* ── Newsletter ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-display font-light text-ink">
              Mantengamos el contacto.
            </h3>
            <p className="mt-2 text-sm text-ink-soft max-w-[380px] mx-auto md:mx-0">
              Suscríbete y recibe novedades + acceso anticipado a nuevos libros.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[380px]">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="border-t border-[#DDD6CA]" />
      </div>

      {/* ── Navigation columns ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo-tipiti.svg"
                alt="Tipiti Books"
                width={160}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[260px]">
              Libros infantiles personalizados con ilustraciones acuarela, hechos con amor.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/tipitibooks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center text-ink-soft hover:bg-ink/10 hover:text-ink transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:hola@tipitibooks.com"
                className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center text-ink-soft hover:bg-ink/10 hover:text-ink transition-colors cursor-pointer"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-sm font-light text-ink-soft uppercase tracking-wider">
              Tienda
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/catalogo"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Personaliza tu libro
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Nuestros libros
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-sm font-light text-ink-soft uppercase tracking-wider">
              Ayuda
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/#como-funciona"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  ¿Cómo funciona?
                </Link>
              </li>
              <li>
                <Link
                  href="/#preguntas"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hola@tipitibooks.com"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@tipitibooks.com"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Envíos
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-light text-ink-soft uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacidad"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/devoluciones"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-xs font-light text-ink-muted uppercase tracking-wider hover:text-ink transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#DDD6CA]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Tipiti Books — Hecho con amor
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span>Webpay</span>
            <span>·</span>
            <span>MercadoPago</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
