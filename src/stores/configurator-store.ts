import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Gender = 'girl' | 'boy'
export type SkinTone = 'light' | 'medium' | 'dark'
export type HairColor = 'blonde' | 'brown' | 'red' | 'black'
export type HairType = 'straight' | 'wavy'

export interface ConfiguratorState {
  // Book reference
  bookId: string | null
  bookSlug: string | null
  bookTitle: string | null

  // Step 1: Name
  childName: string

  // Step 2: Appearance
  gender: Gender | null
  skinTone: SkinTone | null
  hairColor: HairColor | null
  hairType: HairType | null
  hasGlasses: boolean

  // Step 3: Dedication
  dedication: string

  // Navigation
  currentStep: number

  // Actions
  setBook: (id: string, slug: string, title: string) => void
  setChildName: (name: string) => void
  setGender: (gender: Gender) => void
  setSkinTone: (tone: SkinTone) => void
  setHairColor: (color: HairColor) => void
  setHairType: (type: HairType) => void
  setHasGlasses: (has: boolean) => void
  setDedication: (text: string) => void
  setStep: (step: number) => void
  reset: () => void
}

const initialState = {
  bookId: null,
  bookSlug: null,
  bookTitle: null,
  childName: '',
  gender: null,
  skinTone: null,
  hairColor: null,
  hairType: null,
  hasGlasses: false,
  dedication: '',
  currentStep: 1,
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set) => ({
      ...initialState,

      setBook: (id, slug, title) => set({ bookId: id, bookSlug: slug, bookTitle: title }),
      setChildName: (name) => set({ childName: name }),
      setGender: (gender) => set({ gender }),
      setSkinTone: (tone) => set({ skinTone: tone }),
      setHairColor: (color) => set({ hairColor: color }),
      setHairType: (type) => set({ hairType: type }),
      setHasGlasses: (has) => set({ hasGlasses: has }),
      setDedication: (text) => set({ dedication: text }),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set(initialState),
    }),
    {
      name: 'tipiti-configurator',
    }
  )
)
