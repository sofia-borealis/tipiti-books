'use server'

import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function triggerGeneration(bookId: string) {
  try {
    await inngest.send({
      name: 'book/generate-variants',
      data: { bookId },
    })

    revalidatePath('/admin/generacion')
    return { success: true }
  } catch (error) {
    return { error: `Error al iniciar generación: ${error instanceof Error ? error.message : 'Unknown'}` }
  }
}

export async function triggerSingleVariantGeneration(bookId: string, variantId: string) {
  try {
    const supabase = createAdminClient()

    const { data: book } = await supabase
      .from('books')
      .select('id, style_prompt, generation_engine, customization_prompt')
      .eq('id', bookId)
      .single()

    if (!book) return { error: 'Libro no encontrado' }

    const { data: variant } = await supabase
      .from('character_variants')
      .select('id, gender, skin_tone, hair_color, hair_type, has_glasses, reference_image_url')
      .eq('id', variantId)
      .single()

    if (!variant) return { error: 'Variante no encontrada' }

    const { data: scenes } = await supabase
      .from('scenes')
      .select('id, scene_number, visual_description, base_illustration_url')
      .eq('book_id', bookId)
      .order('scene_number')

    if (!scenes || scenes.length === 0) return { error: 'No hay escenas para este libro' }

    await inngest.send({
      name: 'variant/generate-pages',
      data: {
        bookId,
        variantId: variant.id,
        stylePrompt: book.style_prompt,
        customizationPrompt: book.customization_prompt || '',
        engine: book.generation_engine || 'fal-ai/flux-kontext-pro',
        referenceImageUrl: variant.reference_image_url || null,
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
          baseIllustrationUrl: s.base_illustration_url || null,
        })),
      },
    })

    revalidatePath('/admin/generacion')
    return { success: true }
  } catch (error) {
    return { error: `Error al iniciar generación: ${error instanceof Error ? error.message : 'Unknown'}` }
  }
}
