'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const bookSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  title_template: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  style_prompt: z.string().min(10),
  target_age: z.string().max(20).optional(),
  price_clp: z.number().int().min(1000),
  price_usd: z.number().min(0).optional(),
  total_scenes: z.number().int().min(1).max(50).optional(),
  generation_engine: z.string().optional(),
  page_width_mm: z.number().int().optional(),
  page_height_mm: z.number().int().optional(),
  total_pages: z.number().int().optional(),
})

export type BookFormData = z.infer<typeof bookSchema>

export async function createBook(data: BookFormData) {
  const parsed = bookSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Datos inválidos: ' + parsed.error.issues.map(i => i.message).join(', ') }
  }

  const supabase = createAdminClient()
  const { data: book, error } = await supabase
    .from('books')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un libro con ese slug.' }
    return { error: 'Error al crear el libro.' }
  }

  revalidatePath('/admin/libros')
  redirect(`/admin/libros/${book.id}`)
}

export async function updateBook(bookId: string, data: Partial<BookFormData>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('books')
    .update(data)
    .eq('id', bookId)

  if (error) {
    return { error: 'Error al actualizar el libro.' }
  }

  revalidatePath('/admin/libros')
  revalidatePath(`/admin/libros/${bookId}`)
  return { success: true }
}

export async function deleteBook(bookId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)

  if (error) {
    return { error: 'Error al eliminar el libro.' }
  }

  revalidatePath('/admin/libros')
  redirect('/admin/libros')
}

export async function togglePublish(bookId: string, isPublished: boolean) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('books')
    .update({ is_published: !isPublished })
    .eq('id', bookId)

  if (error) {
    return { error: 'Error al cambiar el estado de publicación.' }
  }

  revalidatePath('/admin/libros')
  revalidatePath(`/admin/libros/${bookId}`)
  return { success: true }
}
