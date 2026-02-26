'use client'

import { useState, useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { subscribe } from '@/app/(storefront)/actions/subscribe'

type FormState = 'idle' | 'success' | 'error' | 'duplicate'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    startTransition(async () => {
      const result = await subscribe(email.trim())

      if (result.success) {
        setState('success')
        setEmail('')
      } else if (result.duplicate) {
        setState('duplicate')
      } else {
        setState('error')
        setErrorMessage(result.error || 'Hubo un error. Intenta nuevamente en unos segundos.')
      }
    })
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 animate-in fade-in duration-500">
        <CheckCircle className="w-12 h-12 text-sage" strokeWidth={1.5} />
        <p className="text-lg font-medium text-text font-display">
          ¡Listo! Te avisaremos cuando lancemos.
        </p>
        <p className="text-sm text-text-light">
          Revisa tu email para un regalo especial.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <Input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (state !== 'idle') setState('idle')
        }}
        required
        disabled={isPending}
        className="w-full"
      />
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Enviando...' : 'Quiero mi libro'}
      </Button>

      {state === 'duplicate' && (
        <p className="text-sm text-blue text-center">
          Este email ya está registrado. ¡Te avisaremos pronto!
        </p>
      )}
      {state === 'error' && (
        <p className="text-sm text-terracota-dark text-center">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
