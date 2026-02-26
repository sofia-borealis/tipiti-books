import { inngest } from './client'
import { generateImage, uploadToStorage } from '@/lib/fal/client'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client (bypasses RLS) for background jobs.
 */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createAdminClient(url, serviceKey)
}

/**
 * Character attribute combinations for variant generation.
 * Each combo = one character variant to generate across all scenes.
 */
const GENDERS = ['girl', 'boy'] as const
const SKIN_TONES = ['light', 'medium', 'dark'] as const
const HAIR_COLORS: Record<string, string[]> = {
  light: ['blonde', 'brown', 'red', 'black'],
  medium: ['brown', 'black', 'dark-brown', 'auburn'],
  dark: ['black'],
}
const HAIR_TYPES = ['straight', 'curly'] as const
const GLASSES_OPTIONS = [false, true] as const

/**
 * generate-all-variants
 *
 * Fan-out function: Creates all character variant combinations for a book,
 * then dispatches individual generation jobs for each variant + scene.
 */
export const generateAllVariants = inngest.createFunction(
  {
    id: 'generate-all-variants',
    name: 'Generate All Variants for Book',
    concurrency: { limit: 1 },
  },
  { event: 'book/generate-variants' },
  async ({ event, step }) => {
    const { bookId } = event.data
    const supabase = getAdminClient()

    // Fetch book and scenes
    const book = await step.run('fetch-book', async () => {
      const { data } = await supabase
        .from('books')
        .select('id, style_prompt, generation_engine')
        .eq('id', bookId)
        .single()
      if (!data) throw new Error(`Book ${bookId} not found`)
      return data
    })

    const scenes = await step.run('fetch-scenes', async () => {
      const { data } = await supabase
        .from('scenes')
        .select('id, scene_number, visual_description')
        .eq('book_id', bookId)
        .order('scene_number')
      return data || []
    })

    if (scenes.length === 0) throw new Error('No scenes found for book')

    // Build all variant combinations
    const variants: Array<{
      gender: string
      skin_tone: string
      hair_color: string
      hair_type: string
      has_glasses: boolean
    }> = []

    for (const gender of GENDERS) {
      for (const skinTone of SKIN_TONES) {
        const hairColors = HAIR_COLORS[skinTone] || ['black']
        for (const hairColor of hairColors) {
          for (const hairType of HAIR_TYPES) {
            for (const hasGlasses of GLASSES_OPTIONS) {
              variants.push({
                gender,
                skin_tone: skinTone,
                hair_color: hairColor,
                hair_type: hairType,
                has_glasses: hasGlasses,
              })
            }
          }
        }
      }
    }

    // Create variant records in DB
    const createdVariants = await step.run('create-variant-records', async () => {
      const records = variants.map(v => ({
        book_id: bookId,
        gender: v.gender,
        skin_tone: v.skin_tone,
        hair_color: v.hair_color,
        hair_type: v.hair_type,
        has_glasses: v.has_glasses,
        status: 'pending',
      }))

      const { data, error } = await supabase
        .from('character_variants')
        .upsert(records, {
          onConflict: 'book_id,gender,skin_tone,hair_color,hair_type,has_glasses',
        })
        .select('id, gender, skin_tone, hair_color, hair_type, has_glasses')

      if (error) throw new Error(`Failed to create variants: ${error.message}`)
      return data || []
    })

    // Dispatch individual generation events for each variant
    const events = createdVariants.map(variant => ({
      name: 'variant/generate-pages' as const,
      data: {
        bookId,
        variantId: variant.id,
        stylePrompt: book.style_prompt,
        engine: book.generation_engine || 'fal-ai/flux-kontext-pro',
        variant: {
          gender: variant.gender,
          skin_tone: variant.skin_tone,
          hair_color: variant.hair_color,
          hair_type: variant.hair_type,
          has_glasses: variant.has_glasses,
        },
        scenes: scenes.map(s => ({
          id: s.id,
          sceneNumber: s.scene_number,
          visualDescription: s.visual_description,
        })),
      },
    }))

    await step.sendEvent('dispatch-variant-jobs', events)

    return {
      totalVariants: createdVariants.length,
      totalPages: createdVariants.length * scenes.length,
    }
  }
)

/**
 * generate-variant-pages
 *
 * Generates all scene images for a single character variant.
 * Runs concurrently with other variant generation jobs.
 */
export const generateVariantPages = inngest.createFunction(
  {
    id: 'generate-variant-pages',
    name: 'Generate Pages for Variant',
    concurrency: { limit: 5 },
    retries: 2,
  },
  { event: 'variant/generate-pages' },
  async ({ event, step }) => {
    const { bookId, variantId, stylePrompt, engine, variant, scenes } = event.data
    const supabase = getAdminClient()

    // Mark variant as generating
    await step.run('mark-generating', async () => {
      await supabase
        .from('character_variants')
        .update({ status: 'generating' })
        .eq('id', variantId)
    })

    // Generate each scene image sequentially (to avoid rate limits)
    for (const scene of scenes) {
      await step.run(`generate-scene-${scene.sceneNumber}`, async () => {
        const characterDesc = buildCharacterDescription(variant)
        const scenePrompt = scene.visualDescription
          ? `${scene.visualDescription}\n\nCharacter: ${characterDesc}`
          : `A scene featuring a ${characterDesc}`

        try {
          // Generate image via fal.ai
          const result = await generateImage({
            prompt: scenePrompt,
            stylePrompt,
            model: engine,
          })

          // Upload to Supabase Storage
          const storagePath = `books/${bookId}/variants/${variantId}/scene-${scene.sceneNumber}.png`
          await uploadToStorage(result.imageUrl, storagePath, supabase)

          // Create variant_page record
          const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/variant-pages/${storagePath}`

          await supabase.from('variant_pages').upsert(
            {
              variant_id: variantId,
              scene_id: scene.id,
              image_url: publicUrl,
              prompt_used: scenePrompt,
              generation_model: engine,
            },
            { onConflict: 'variant_id,scene_id' }
          )
        } catch (err) {
          // Mark variant as failed and re-throw
          await supabase
            .from('character_variants')
            .update({ status: 'failed' })
            .eq('id', variantId)
          throw err
        }
      })
    }

    // Mark variant as pending review
    await step.run('mark-pending-review', async () => {
      await supabase
        .from('character_variants')
        .update({ status: 'pending_review' })
        .eq('id', variantId)
    })

    return { variantId, pagesGenerated: scenes.length }
  }
)

function buildCharacterDescription(variant: {
  gender: string
  skin_tone: string
  hair_color: string
  hair_type: string
  has_glasses: boolean
}): string {
  const parts = [
    variant.gender === 'girl' ? 'young girl' : 'young boy',
    `with ${variant.skin_tone} skin`,
    `${variant.hair_type} ${variant.hair_color} hair`,
  ]
  if (variant.has_glasses) parts.push('wearing glasses')
  return parts.join(', ')
}

export const functions = [generateAllVariants, generateVariantPages]
