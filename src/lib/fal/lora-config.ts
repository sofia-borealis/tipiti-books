/**
 * LoRA configuration for Tipiti Books style and character generation.
 *
 * These LoRAs are used for EXPERIMENTAL generation in the admin panel.
 * The main production pipeline uses layer composition (not LoRA generation).
 */

export interface LoraConfig {
  url: string
  triggerWord: string
  scale: number
}

export const TIPITI_LORAS = {
  style: {
    url: 'https://v3b.fal.media/files/b/0a919e46/o1eq5GrfH3_b0eVpMRWnt_pytorch_lora_weights.safetensors',
    triggerWord: 'tptbk illustration',
    scale: 3,
  } satisfies LoraConfig,
  character: {
    url: 'https://v3b.fal.media/files/b/0a91a5ab/3czqKoLUQo1DK6IFCsM6a_pytorch_lora_weights.safetensors',
    triggerWord: 'tptbk boy1',
    scale: 1,
  } satisfies LoraConfig,
}

/**
 * Build a prompt that includes LoRA trigger words.
 */
export function buildLoraPrompt(
  basePrompt: string,
  options: { includeStyle?: boolean; includeCharacter?: boolean } = {}
): string {
  const { includeStyle = true, includeCharacter = false } = options
  const parts = [basePrompt]
  if (includeStyle) parts.push(TIPITI_LORAS.style.triggerWord)
  if (includeCharacter) parts.push(TIPITI_LORAS.character.triggerWord)
  return parts.join(', ')
}

/**
 * Get the LoRA payload array for fal.ai API requests.
 */
export function getLoraPayload(
  options: { includeStyle?: boolean; includeCharacter?: boolean } = {}
): Array<{ path: string; scale: number }> {
  const { includeStyle = true, includeCharacter = false } = options
  const loras: Array<{ path: string; scale: number }> = []
  if (includeStyle) {
    loras.push({ path: TIPITI_LORAS.style.url, scale: TIPITI_LORAS.style.scale })
  }
  if (includeCharacter) {
    loras.push({ path: TIPITI_LORAS.character.url, scale: TIPITI_LORAS.character.scale })
  }
  return loras
}
