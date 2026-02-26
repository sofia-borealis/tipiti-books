/**
 * fal.ai Image Generation Client
 *
 * Uses fal.ai's flux-kontext-pro model to generate character variants.
 * Each variant = one combination of (gender, skin_tone, hair_color, hair_type, has_glasses)
 * applied to all scenes of a book.
 *
 * TODO: Set FAL_KEY in environment variables
 */

interface GenerateImageParams {
  prompt: string
  stylePrompt: string
  width?: number
  height?: number
  model?: string
}

interface GenerateImageResult {
  imageUrl: string
  seed: number
}

const FAL_API_URL = 'https://queue.fal.run'

export async function generateImage({
  prompt,
  stylePrompt,
  width = 2048,
  height = 2048,
  model = 'fal-ai/flux-kontext-pro',
}: GenerateImageParams): Promise<GenerateImageResult> {
  const apiKey = process.env.FAL_KEY
  if (!apiKey) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  const fullPrompt = `${stylePrompt}\n\n${prompt}`

  const response = await fetch(`${FAL_API_URL}/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: fullPrompt,
      image_size: { width, height },
      num_images: 1,
      enable_safety_checker: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`fal.ai API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  // fal.ai returns a request_id for queued requests
  if (data.request_id) {
    return pollForResult(model, data.request_id, apiKey)
  }

  // Direct result
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
): Promise<GenerateImageResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const statusRes = await fetch(
      `${FAL_API_URL}/${model}/requests/${requestId}/status`,
      {
        headers: { 'Authorization': `Key ${apiKey}` },
      }
    )

    const status = await statusRes.json()

    if (status.status === 'COMPLETED') {
      const resultRes = await fetch(
        `${FAL_API_URL}/${model}/requests/${requestId}`,
        {
          headers: { 'Authorization': `Key ${apiKey}` },
        }
      )
      const result = await resultRes.json()
      return {
        imageUrl: result.images?.[0]?.url || result.output?.images?.[0]?.url,
        seed: result.seed || 0,
      }
    }

    if (status.status === 'FAILED') {
      throw new Error(`fal.ai generation failed: ${status.error || 'Unknown error'}`)
    }
  }

  throw new Error('fal.ai generation timed out')
}

/**
 * Upload a generated image to Supabase Storage
 */
export async function uploadToStorage(
  imageUrl: string,
  storagePath: string,
  supabaseClient: {
    storage: {
      from: (bucket: string) => {
        upload: (path: string, body: Blob | Buffer, options?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
      }
    }
  }
) {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error('Failed to download generated image')

  const buffer = Buffer.from(await response.arrayBuffer())

  const { error } = await supabaseClient.storage
    .from('variant-pages')
    .upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${JSON.stringify(error)}`)

  return storagePath
}
