import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExperimentalGenerator } from '@/components/admin/experimental-generator'
import { ArrowLeft } from 'lucide-react'

export default async function ExperimentalPage() {
  const supabase = createAdminClient()

  // Fetch all books
  const { data: books } = await supabase
    .from('books')
    .select('id, title_template, slug, style_prompt')
    .order('created_at', { ascending: false })

  // Fetch scenes for all books (we'll filter client-side)
  const bookIds = (books || []).map((b) => b.id)
  const { data: scenes } = bookIds.length > 0
    ? await supabase
        .from('scenes')
        .select('id, book_id, scene_number, visual_description, text_narrative')
        .in('book_id', bookIds)
        .order('scene_number')
    : { data: [] }

  return (
    <div>
      <Link
        href="/admin/generacion"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a generacion
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">
          Generacion experimental
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Genera imagenes con LoRAs de estilo y personaje. Usa los resultados como fondos en el compositor.
        </p>
      </div>

      <ExperimentalGenerator
        books={books || []}
        scenes={scenes || []}
      />
    </div>
  )
}
