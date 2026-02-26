'use client'

import Link from 'next/link'

const steps = [
  { num: 1, label: 'Nombre', href: '/wizard/paso-1' },
  { num: 2, label: 'Apariencia', href: '/wizard/paso-2' },
  { num: 3, label: 'Dedicatoria', href: '/wizard/paso-3' },
  { num: 4, label: 'Resumen', href: '/wizard/paso-4' },
]

export function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {steps.map((step, i) => {
        const isActive = step.num === currentStep
        const isCompleted = step.num < currentStep
        const isClickable = step.num <= currentStep

        return (
          <div key={step.num} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              {isClickable ? (
                <Link
                  href={step.href}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-terracota text-cream shadow-[0_2px_8px_rgba(196,125,90,0.3)]'
                      : isCompleted
                        ? 'bg-sage text-cream'
                        : 'bg-border-light text-text-muted'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </Link>
              ) : (
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold bg-border-light text-text-muted"
                >
                  {step.num}
                </div>
              )}
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-terracota' : isCompleted ? 'text-sage-dark' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 rounded-full ${
                  step.num < currentStep ? 'bg-sage' : 'bg-border-light'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
