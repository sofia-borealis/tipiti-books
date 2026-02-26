import type { SkinTone, HairColor } from '@/stores/configurator-store'

/**
 * Valid hair color combinations by skin tone (biologically plausible)
 */
export const validHairColors: Record<SkinTone, HairColor[]> = {
  light: ['blonde', 'brown', 'red', 'black'],
  medium: ['blonde', 'brown', 'red', 'black'],
  dark: ['black'],
}
