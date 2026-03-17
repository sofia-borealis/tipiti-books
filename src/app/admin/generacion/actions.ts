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

export async function createVariant(bookId: string, data: {
  label: string
  gender: 'girl' | 'boy'
  skin_tone?: string
  hair_color?: string
  hair_type?: string
  has_glasses?: boolean
}) {
  try {
    const supabase = createAdminClient()

    const { data: variant, error } = await supabase
      .from('character_variants')
      .insert({
        book_id: bookId,
        label: data.label,
        gender: data.gender,
        skin_tone: data.skin_tone || 'medium',
        hair_color: data.hair_color || 'brown',
        hair_type: data.hair_type || 'straight',
        has_glasses: data.has_glasses ?? false,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        return { error: 'Ya existe una variante con estas mismas características para este libro.' }
      }
      return { error: `Error al crear variante: ${error.message}` }
    }

    revalidatePath('/admin/generacion')
    return { success: true, variantId: variant.id }
  } catch (error) {
    return { error: `Error al crear variante: ${error instanceof Error ? error.message : 'Unknown'}` }
  }
}
