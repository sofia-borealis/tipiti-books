/**
 * Quick test: verifies FAL_KEY works by generating a single watercolor image.
 * Run: npx tsx scripts/test-fal.ts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(import.meta.dirname || __dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const FAL_KEY = process.env.FAL_KEY
if (!FAL_KEY) {
  console.error('❌ FAL_KEY not found in environment')
  process.exit(1)
}

console.log('🎨 Testing fal.ai connection...')
console.log(`   Key: ${FAL_KEY.slice(0, 12)}...`)

async function test() {
  const model = 'fal-ai/flux/schnell' // fast model for testing
  const response = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'A cute watercolor illustration of a small child reading a book under a tree, soft pastel colors, children book style, whimsical',
      image_size: { width: 512, height: 512 },
      num_images: 1,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error(`❌ API error (${response.status}): ${err}`)
    process.exit(1)
  }

  const data = await response.json()
  const imageUrl = data.images?.[0]?.url

  if (imageUrl) {
    console.log('✅ fal.ai funciona correctamente!')
    console.log(`🖼️  Imagen generada: ${imageUrl}`)
  } else {
    console.error('❌ No se recibió imagen:', JSON.stringify(data, null, 2))
  }
}

test().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
