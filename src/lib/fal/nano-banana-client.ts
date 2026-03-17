/**
 * fal.ai Nano Banana Pro/edit client.
 *
 * Takes a base illustration + reference image and swaps the child's appearance
 * using image-to-image editing.
 *
 * Note: The queue submit endpoint is /nano-banana-pro/edit but the
 * status/result URLs returned use /nano-banana-pro/requests/... (without /edit).
 * We use the URLs from the queue response directly to avoid 404s.
 */

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

  const payload = {
    prompt,
    image_urls: [baseIllustrationUrl, referenceImageUrl],
    num_images: 1,
    aspect_ratio: 'auto',
    output_format: 'png',
  }

  console.log('[nano-banana] Submitting to queue...')

  const response = await fetch('https://queue.fal.run/fal-ai/nano-banana-pro/edit', {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`fal.ai submit error (${response.status}): ${errorText}`)
  }

  const queueData = await response.json()

  if (!queueData.request_id) {
    // Direct result (unlikely for this model)
    return {
      imageUrl: queueData.images?.[0]?.url,
      seed: queueData.seed || 0,
    }
  }

  // Use the URLs returned by the queue (they have the correct path)
  const statusUrl = queueData.status_url as string
  const responseUrl = queueData.response_url as string

  console.log('[nano-banana] Queued, polling:', statusUrl)

  return pollForResult(statusUrl, responseUrl, apiKey)
}

async function pollForResult(
  statusUrl: string,
  responseUrl: string,
  apiKey: string,
  maxAttempts = 120
): Promise<NanoBananaResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
    })
    const status = await statusRes.json()

    if (status.status === 'COMPLETED') {
      const resultRes = await fetch(responseUrl, {
        headers: { Authorization: `Key ${apiKey}` },
      })
      const result = await resultRes.json()
      return {
        imageUrl: result.images?.[0]?.url,
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
