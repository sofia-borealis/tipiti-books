/**
 * fal.ai Nano Banana Pro/edit client.
 *
 * Takes a base illustration + reference image and swaps the child's appearance
 * using image-to-image editing.
 */

const FAL_API_URL = 'https://queue.fal.run'

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

  const model = 'fal-ai/nano-banana-pro/edit'

  const payload = {
    prompt,
    image_urls: [baseIllustrationUrl, referenceImageUrl],
    num_images: 1,
    aspect_ratio: 'auto',
    output_format: 'png',
  }

  console.log('[nano-banana] Sending to', `${FAL_API_URL}/${model}`)
  console.log('[nano-banana] Payload:', JSON.stringify(payload, null, 2))

  const response = await fetch(`${FAL_API_URL}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`fal.ai API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  // Handle queued requests
  if (data.request_id) {
    return pollForResult(model, data.request_id, apiKey)
  }

  return {
    imageUrl: data.images?.[0]?.url || data.output?.images?.[0]?.url,
    seed: data.seed || 0,
  }
}

async function pollForResult(
  model: string,
  requestId: string,
  apiKey: string,
  maxAttempts = 60
): Promise<NanoBananaResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const statusRes = await fetch(
      `${FAL_API_URL}/${model}/requests/${requestId}/status`,
      { headers: { Authorization: `Key ${apiKey}` } }
    )
    const status = await statusRes.json()

    if (status.status === 'COMPLETED') {
      const resultRes = await fetch(
        `${FAL_API_URL}/${model}/requests/${requestId}`,
        { headers: { Authorization: `Key ${apiKey}` } }
      )
      const result = await resultRes.json()
      return {
        imageUrl: result.images?.[0]?.url || result.output?.images?.[0]?.url,
        seed: result.seed || 0,
      }
    }

    if (status.status === 'FAILED') {
      throw new Error(
        `fal.ai generation failed: ${status.error || 'Unknown error'}`
      )
    }
  }

  throw new Error('fal.ai generation timed out')
}
