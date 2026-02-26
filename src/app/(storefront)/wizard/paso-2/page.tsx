'use client'

import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configurator-store'
import { validHairColors } from '@/lib/utils/character-options'
import { WizardStepper } from '@/components/storefront/wizard-stepper'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Gender, SkinTone, HairColor, HairType } from '@/stores/configurator-store'

const genderOptions: { value: Gender; label: string; emoji: string }[] = [
  { value: 'girl', label: 'Niña', emoji: '👧' },
  { value: 'boy', label: 'Niño', emoji: '👦' },
]

const skinToneOptions: { value: SkinTone; label: string; color: string }[] = [
  { value: 'light', label: 'Claro', color: 'bg-[#FDEBD0]' },
  { value: 'medium', label: 'Mate', color: 'bg-[#D4A574]' },
  { value: 'dark', label: 'Oscuro', color: 'bg-[#8B6914]' },
]

const hairColorOptions: { value: HairColor; label: string; color: string }[] = [
  { value: 'blonde', label: 'Rubio', color: 'bg-[#F0D58C]' },
  { value: 'brown', label: 'Castaño', color: 'bg-[#8B6914]' },
  { value: 'red', label: 'Pelirrojo', color: 'bg-[#C45A3C]' },
  { value: 'black', label: 'Negro', color: 'bg-[#2C2C2C]' },
]

const hairTypeOptions: { value: HairType; label: string }[] = [
  { value: 'straight', label: 'Liso' },
  { value: 'wavy', label: 'Ondulado' },
]

export default function WizardStep2() {
  const router = useRouter()
  const {
    gender, setGender,
    skinTone, setSkinTone,
    hairColor, setHairColor,
    hairType, setHairType,
    hasGlasses, setHasGlasses,
    childName, setStep,
  } = useConfiguratorStore()

  // Filter hair colors based on skin tone
  const availableHairColors = skinTone
    ? hairColorOptions.filter((h) => validHairColors[skinTone].includes(h.value))
    : hairColorOptions

  // Reset hair color if not valid for selected skin tone
  const handleSkinChange = (tone: SkinTone) => {
    setSkinTone(tone)
    if (hairColor && !validHairColors[tone].includes(hairColor)) {
      setHairColor(validHairColors[tone][0])
    }
  }

  const isComplete = gender && skinTone && hairColor && hairType !== null

  const handleNext = () => {
    if (!isComplete) return
    setStep(3)
    router.push('/wizard/paso-3')
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 md:py-16">
      <WizardStepper currentStep={2} />

      <div className="mt-10">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text text-center">
          ¿Cómo se ve {childName || 'tu hijo/a'}?
        </h1>
        <p className="mt-2 text-base text-text-light text-center">
          Elige la apariencia del personaje.
        </p>

        {/* Character preview */}
        <div className="mt-8 bg-cream-dark rounded-2xl border border-border-light p-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-white border-2 border-border-light flex items-center justify-center text-5xl">
            {gender === 'girl' ? '👧' : gender === 'boy' ? '👦' : '🧒'}
          </div>
          <p className="mt-3 text-sm text-text-light">
            {[
              gender === 'girl' ? 'Niña' : gender === 'boy' ? 'Niño' : null,
              skinTone ? skinToneOptions.find((s) => s.value === skinTone)?.label : null,
              hairColor ? hairColorOptions.find((h) => h.value === hairColor)?.label : null,
              hairType === 'straight' ? 'Liso' : hairType === 'wavy' ? 'Ondulado' : null,
              hasGlasses ? 'Con lentes' : null,
            ]
              .filter(Boolean)
              .join(' · ') || 'Selecciona las opciones'}
          </p>
        </div>

        {/* Gender */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-text mb-3">Género</label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  gender === opt.value
                    ? 'border-terracota bg-terracota/5 shadow-[0_2px_8px_rgba(196,125,90,0.15)]'
                    : 'border-border-light hover:border-border bg-white'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <p className="mt-1 text-sm font-medium text-text">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Skin tone */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text mb-3">Tono de piel</label>
          <div className="flex gap-4 justify-center">
            {skinToneOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSkinChange(opt.value)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  skinTone === opt.value ? 'scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${opt.color} border-2 ${
                    skinTone === opt.value ? 'border-terracota shadow-[0_0_0_3px_rgba(196,125,90,0.2)]' : 'border-border-light'
                  }`}
                />
                <span className="text-xs text-text-light">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hair color */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text mb-3">Color de pelo</label>
          <div className="flex gap-4 justify-center">
            {availableHairColors.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHairColor(opt.value)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  hairColor === opt.value ? 'scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${opt.color} border-2 ${
                    hairColor === opt.value ? 'border-terracota shadow-[0_0_0_3px_rgba(196,125,90,0.2)]' : 'border-border-light'
                  }`}
                />
                <span className="text-xs text-text-light">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hair type */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text mb-3">Tipo de pelo</label>
          <div className="grid grid-cols-2 gap-3">
            {hairTypeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHairType(opt.value)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  hairType === opt.value
                    ? 'border-terracota bg-terracota/5'
                    : 'border-border-light hover:border-border bg-white'
                }`}
              >
                <p className="text-sm font-medium text-text">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Glasses */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text mb-3">¿Usa lentes?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setHasGlasses(false)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                !hasGlasses
                  ? 'border-terracota bg-terracota/5'
                  : 'border-border-light hover:border-border bg-white'
              }`}
            >
              <p className="text-sm font-medium text-text">No</p>
            </button>
            <button
              onClick={() => setHasGlasses(true)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                hasGlasses
                  ? 'border-terracota bg-terracota/5'
                  : 'border-border-light hover:border-border bg-white'
              }`}
            >
              <p className="text-sm font-medium text-text">Sí 👓</p>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => { setStep(1); router.push('/wizard/paso-1') }}
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </Button>
          <Button onClick={handleNext} size="lg" disabled={!isComplete}>
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
