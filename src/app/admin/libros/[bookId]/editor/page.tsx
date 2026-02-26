import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { SceneEditor } from '@/components/admin/scene-editor'
import { ArrowLeft } from 'lucide-react'

export default async function EditorPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = createAdminClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title_template, slug, total_scenes, style_prompt')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: scenes } = await supabase
    .from('scenes')
    .select('*')
    .eq('book_id', bookId)
    .order('scene_number', { ascending: true })

  return (
    <div>
      <Link
        href={`/admin/libros/${bookId}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a {book.title_template}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">
          Editor de escenas
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {book.title_template} — {scenes?.length || 0}/{book.total_scenes || '∞'} escenas
        </p>
      </div>

      <SceneEditor
        bookId={book.id}
        scenes={scenes || []}
        stylePrompt={book.style_prompt}
      />
    </div>
  )
}
