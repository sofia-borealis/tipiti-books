'use client'

import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { WizardStepper } from '@/components/storefront/wizard-stepper'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MAX_CHARS = 200

export default function WizardStep3() {
  const router = useRouter()
  const { dedication, setDedication, childName, setStep } = useConfiguratorStore()

  const handleNext = () => {
    setStep(4)
    router.push('/wizard/paso-4')
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 md:py-16">
      <WizardStepper currentStep={3} />

      <div className="mt-10">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center">
          Escribe una dedicatoria
        </h1>
        <p className="mt-2 text-base text-text-light text-center">
          Un mensaje especial que aparecerá en la última página.
        </p>

        {/* Live preview */}
        <div className="mt-8 bg-cream-dark rounded-2xl border border-border-light p-8 text-center min-h-[120px] flex items-center justify-center">
          {dedication.trim() ? (
            <p className="text-xl md:text-2xl font-handwritten text-terracota leading-relaxed max-w-md">
              {dedication}
            </p>
          ) : (
            <p className="text-lg font-handwritten text-text-muted italic">
              Para {childName || '...'}, con todo nuestro amor...
            </p>
          )}
        </div>

        {/* Textarea */}
        <div className="mt-8">
          <textarea
            value={dedication}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setDedication(e.target.value)
              }
            }}
            placeholder={`Para ${childName || '...'}, con todo nuestro amor...`}
            rows={4}
            className="w-full rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-base text-text placeholder:text-text-muted resize-none outline-none focus-visible:border-terracota focus-visible:ring-[3px] focus-visible:ring-terracota/15 transition-all"
          />
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${
                dedication.length > MAX_CHARS * 0.9 ? 'text-terracota-dark' : 'text-text-muted'
              }`}
            >
              {dedication.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center mt-2">
          La dedicatoria es opcional. Si la dejas vacía, la última página quedará sin texto personalizado.
        </p>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => { setStep(2); router.push('/wizard/paso-2') }}
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </Button>
          <Button onClick={handleNext} size="lg">
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
