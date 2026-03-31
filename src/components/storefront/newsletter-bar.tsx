'use client'

import { useState, useTransition } from 'react'
import { subscribe } from '@/app/(storefront)/actions/subscribe'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export function NewsletterBar() {
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

  return (
    <section className="bg-sage-deep text-cream">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-display font-light text-cream">
              Mantengamos el contacto.
            </h3>
            <p className="mt-2 text-sm text-cream/70 max-w-[380px] mx-auto md:mx-0">
              Suscríbete y recibe novedades + acceso anticipado a nuevos libros.
            </p>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto md:min-w-[380px]">
            {state === 'success' ? (
              <div className="flex items-center gap-3 text-cream/90">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm">Te avisaremos cuando haya novedades.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="flex-1 h-12 px-4 rounded-[4px] bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 text-sm focus:outline-none focus:border-cream/50 transition-colors"
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-white text-sage-deep rounded-[4px] uppercase tracking-[0.06em] font-bold text-[13px] hover:bg-white/90 h-12 px-6 shrink-0"
                >
                  {isPending ? '...' : 'Suscribir'}
                </Button>
              </form>
            )}
            {state === 'error' && (
              <p className="mt-2 text-xs text-cream/60">
                Hubo un error. Intenta de nuevo.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
