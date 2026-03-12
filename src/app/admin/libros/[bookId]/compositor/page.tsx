import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { CompositionEditor } from '@/components/admin/composition-editor'
import { ArrowLeft } from 'lucide-react'

export default async function CompositorPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title_template, page_width_mm, page_height_mm, style_prompt')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  // Fetch scenes with composition fields
  const { data: scenes } = await supabase
    .from('scenes')
    .select('id, scene_number, visual_description, text_narrative, background_url, character_x, character_y, character_scale, character_flip, character_z_index')
    .eq('book_id', bookId)
    .order('scene_number')

  // Fetch character variants for this book
  const { data: variants } = await supabase
    .from('character_variants')
    .select('id, gender, skin_tone, hair_color, hair_type, has_glasses, character_layer_url, status')
    .eq('book_id', bookId)
    .order('created_at')

  return (
    <div>
      <Link
        href={`/admin/libros/${bookId}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al libro
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">
          Compositor de capas
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {book.title_template} — {scenes?.length || 0} escenas
        </p>
      </div>

      <CompositionEditor
        bookId={book.id}
        stylePrompt={book.style_prompt || ''}
        scenes={scenes || []}
        variants={variants || []}
      />
    </div>
  )
}
