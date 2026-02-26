import { createClient } from '@/lib/supabase/server'
import type { Gender, SkinTone, HairColor, HairType } from '@/stores/configurator-store'

interface VariantLookupParams {
  bookId: string
  gender: Gender
  skinTone: SkinTone
  hairColor: HairColor
  hairType: HairType
  hasGlasses: boolean
}

// Map store values to DB values
const skinToneMap: Record<SkinTone, string> = {
  light: 'light',
  medium: 'medium',
  dark: 'dark',
}

const hairColorMap: Record<HairColor, string> = {
  blonde: 'blonde',
  brown: 'brown',
  red: 'red',
  black: 'black',
}

const hairTypeMap: Record<HairType, string> = {
  straight: 'straight',
  wavy: 'wavy',
}

const genderMap: Record<Gender, string> = {
  girl: 'girl',
  boy: 'boy',
}

export async function findVariant(params: VariantLookupParams) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('character_variants')
    .select('id, portrait_url, character_sheet_urls, status')
    .eq('book_id', params.bookId)
    .eq('gender', genderMap[params.gender])
    .eq('hair_color', hairColorMap[params.hairColor])
    .eq('hair_type', hairTypeMap[params.hairType])
    .eq('skin_tone', skinToneMap[params.skinTone])
    .eq('has_glasses', params.hasGlasses)
    .eq('status', 'approved')
    .single()

  if (error || !data) {
    return null
  }

  return data
}

