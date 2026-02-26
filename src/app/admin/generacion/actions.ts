'use server'

import { inngest } from '@/lib/inngest/client'
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
