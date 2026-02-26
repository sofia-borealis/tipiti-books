'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { WizardStepper } from '@/components/storefront/wizard-stepper'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Pencil, Eye } from 'lucide-react'

const labels = {
  gender: { girl: 'Niña', boy: 'Niño' },
  skinTone: { light: 'Claro', medium: 'Mate', dark: 'Oscuro' },
  hairColor: { blonde: 'Rubio', brown: 'Castaño', red: 'Pelirrojo', black: 'Negro' },
  hairType: { straight: 'Liso', wavy: 'Ondulado' },
} as const

export default function WizardStep4() {
  const router = useRouter()
  const {
    bookTitle, childName, gender, skinTone,
    hairColor, hairType, hasGlasses, dedication, setStep,
  } = useConfiguratorStore()

  const displayTitle = bookTitle
    ? bookTitle.replace('{name}', childName || '...')
    : `Buenas Noches, ${childName || '...'}`

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 md:py-16">
      <WizardStepper currentStep={4} />

      <div className="mt-10">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center">
          Todo listo para {childName}
        </h1>
        <p className="mt-2 text-base text-text-light text-center">
          Revisa los detalles de tu libro personalizado.
        </p>

        {/* Summary card */}
        <div className="mt-8 bg-white rounded-2xl border border-border-light shadow-[0_4px_20px_rgba(196,125,90,0.08)] overflow-hidden">
          {/* Book title */}
          <div className="p-6 bg-cream-dark border-b border-border-light text-center">
            <p className="text-2xl font-handwritten text-terracota">{displayTitle}</p>
          </div>

          {/* Character preview */}
          <div className="p-6 border-b border-border-light text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-cream-dark border-2 border-border-light flex items-center justify-center text-3xl">
              {gender === 'girl' ? '👧' : gender === 'boy' ? '👦' : '🧒'}
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-border-light">
            {/* Name */}
            <div className="flex items-center justify-between p-4 px-6">
              <div>
                <p className="text-xs text-text-muted">Nombre</p>
                <p className="text-base font-medium text-text">{childName}</p>
              </div>
              <Link
                href="/wizard/paso-1"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-blue hover:text-terracota transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </Link>
            </div>

            {/* Appearance */}
            <div className="flex items-center justify-between p-4 px-6">
              <div>
                <p className="text-xs text-text-muted">Apariencia</p>
                <p className="text-base font-medium text-text">
                  {[
                    gender ? labels.gender[gender] : null,
                    skinTone ? labels.skinTone[skinTone] : null,
                    hairColor ? labels.hairColor[hairColor] : null,
                    hairType ? labels.hairType[hairType] : null,
                    hasGlasses ? 'Con lentes' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <Link
                href="/wizard/paso-2"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-xs text-blue hover:text-terracota transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </Link>
            </div>

            {/* Dedication */}
            <div className="flex items-center justify-between p-4 px-6">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted">Dedicatoria</p>
                <p className="text-base text-text truncate">
                  {dedication.trim() || 'Sin dedicatoria'}
                </p>
              </div>
              <Link
                href="/wizard/paso-3"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 text-xs text-blue hover:text-terracota transition-colors shrink-0 ml-4"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => { setStep(3); router.push('/wizard/paso-3') }}
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </Button>
          <Button asChild size="lg">
            <Link href="/preview">
              <Eye className="w-5 h-5" />
              Ver mi libro
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
