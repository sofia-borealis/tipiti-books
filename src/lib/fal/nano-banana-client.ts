/**
 * fal.ai Nano Banana Pro/edit client.
 *
 * Takes a base illustration + reference image and swaps the child's appearance
 * using image-to-image editing via the official @fal-ai/client SDK.
 */

import { fal } from '@fal-ai/client'

interface NanoBananaParams {
  prompt: string
  baseIllustrationUrl: string
  referenceImageUrl: string
}

interface NanoBananaResult {
  imageUrl: string
  seed: number
}

export async function generateWithNanoBanana({
  prompt,
  baseIllustrationUrl,
  referenceImageUrl,
}: NanoBananaParams): Promise<NanoBananaResult> {
  const apiKey = process.env.FAL_KEY
  if (!apiKey) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  fal.config({ credentials: apiKey })

  console.log('[nano-banana] Generating with:', {
    prompt,
    images: [baseIllustrationUrl, referenceImageUrl],
  })

  const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
    input: {
      prompt,
      image_urls: [baseIllustrationUrl, referenceImageUrl],
      num_images: 1,
      aspect_ratio: 'auto',
      output_format: 'png',
    },
  })

  const imageUrl = result.data?.images?.[0]?.url
  if (!imageUrl) {
    throw new Error('No image returned from fal.ai nano-banana-pro/edit')
  }

  return {
    imageUrl,
    seed: (result.data as Record<string, unknown>)?.seed as number || 0,
  }
}
