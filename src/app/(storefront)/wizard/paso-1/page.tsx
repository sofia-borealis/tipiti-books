'use client'

import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { WizardStepper } from '@/components/storefront/wizard-stepper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function WizardStep1() {
  const router = useRouter()
  const { childName, setChildName, setStep, bookTitle } = useConfiguratorStore()
  const [error, setError] = useState('')

  const displayTitle = bookTitle
    ? bookTitle.replace('{name}', childName || '...')
    : `Buenas Noches, ${childName || '...'}`

  const handleNext = () => {
    const trimmed = childName.trim()
    if (trimmed.length < 2) {
      setError('El nombre debe tener al menos 2 letras.')
      return
    }
    if (trimmed.length > 30) {
      setError('El nombre no puede tener más de 30 letras.')
      return
    }
    if (/\d/.test(trimmed)) {
      setError('El nombre no puede contener números.')
      return
    }
    setStep(2)
    router.push('/wizard/paso-2')
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 md:py-16">
      <WizardStepper currentStep={1} />

      <div className="mt-10">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center">
          ¿Cómo se llama el protagonista?
        </h1>
        <p className="mt-2 text-base text-text-light text-center">
          El nombre aparecerá en cada página del libro.
        </p>

        {/* Live preview */}
        <div className="mt-8 bg-cream-dark rounded-2xl border border-border-light p-8 text-center">
          <p className="text-sm text-text-muted mb-2 font-display">Vista previa</p>
          <p className="text-2xl md:text-3xl font-handwritten text-terracota leading-relaxed">
            {displayTitle}
          </p>
        </div>

        {/* Input */}
        <div className="mt-8">
          <Input
            type="text"
            placeholder="Escribe el nombre aquí..."
            value={childName}
            onChange={(e) => {
              setChildName(e.target.value)
              if (error) setError('')
            }}
            className="text-center text-lg"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-terracota-dark text-center">{error}</p>
          )}
        </div>

        {/* Next button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleNext} size="lg" disabled={!childName.trim()}>
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
