/**
 * Experimental fal.ai client with LoRA support.
 *
 * This is a SEPARATE client from the main generation pipeline (client.ts).
 * Used for experimental generation in the admin panel.
 */

import { buildLoraPrompt, getLoraPayload } from './lora-config'

const FAL_API_URL = 'https://queue.fal.run'

interface ExperimentalGenerateParams {
  prompt: string
  stylePrompt: string
  includeStyleLora?: boolean
  includeCharacterLora?: boolean
  width?: number
  height?: number
  model?: string
}

interface ExperimentalGenerateResult {
  imageUrl: string
  seed: number
  lorasUsed: string[]
}

export async function generateWithLora({
  prompt,
  stylePrompt,
  includeStyleLora = true,
  includeCharacterLora = false,
  width = 2048,
  height = 2048,
  model = 'fal-ai/flux-lora',
}: ExperimentalGenerateParams): Promise<ExperimentalGenerateResult> {
  const apiKey = process.env.FAL_KEY
  if (!apiKey) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  // Build prompt: trigger words first, then style context, then scene description
  const loraOptions = { includeStyle: includeStyleLora, includeCharacter: includeCharacterLora }
  const enhancedPrompt = buildLoraPrompt(prompt, loraOptions)
  const fullPrompt = stylePrompt
    ? `${enhancedPrompt}\n\n${stylePrompt}`
    : enhancedPrompt

  // Build LoRA payload
  const loras = getLoraPayload(loraOptions)
  const lorasUsed = loras.map((l) => l.path)

  const payload = {
    prompt: fullPrompt,
    image_size: { width, height },
    num_images: 1,
    enable_safety_checker: false,
    guidance_scale: 3.5,
    loras: loras.length > 0 ? loras : undefined,
  }

  console.log('[fal-lora] Sending to', `${FAL_API_URL}/${model}`)
  console.log('[fal-lora] Payload:', JSON.stringify(payload, null, 2))

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
    const result = await pollForResult(model, data.request_id, apiKey)
    return { ...result, lorasUsed }
  }

  return {
    imageUrl: data.images?.[0]?.url || data.output?.images?.[0]?.url,
    seed: data.seed || 0,
    lorasUsed,
  }
}

async function pollForResult(
  model: string,
  requestId: string,
  apiKey: string,
  maxAttempts = 60
): Promise<{ imageUrl: string; seed: number }> {
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
      throw new Error(`fal.ai generation failed: ${status.error || 'Unknown error'}`)
    }
  }

  throw new Error('fal.ai generation timed out')
}
