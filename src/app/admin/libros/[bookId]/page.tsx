import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookForm } from '@/components/admin/book-form'
import { BookActions } from '@/components/admin/book-actions'
import { ArrowLeft, Layers, Sparkles, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: scenes } = await supabase
    .from('scenes')
    .select('id')
    .eq('book_id', bookId)

  const { count: variantCount } = await supabase
    .from('character_variants')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId)

  const { count: approvedCount } = await supabase
    .from('character_variants')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId)
    .eq('status', 'approved')

  return (
    <div>
      <Link
        href="/admin/libros"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a libros
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text font-display">
            {book.title_template}
          </h1>
          <p className="text-sm text-text-muted mt-1">/{book.slug}</p>
        </div>
        <BookActions bookId={book.id} isPublished={book.is_published} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border-light p-4">
          <p className="text-xs text-text-muted">Escenas</p>
          <p className="text-xl font-bold text-text mt-1">{scenes?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-4">
          <p className="text-xs text-text-muted">Variantes</p>
          <p className="text-xl font-bold text-text mt-1">{variantCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-4">
          <p className="text-xs text-text-muted">Aprobadas</p>
          <p className="text-xl font-bold text-sage mt-1">{approvedCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-4">
          <p className="text-xs text-text-muted">Estado</p>
          <p className={`text-xl font-bold mt-1 ${book.is_published ? 'text-sage' : 'text-text-muted'}`}>
            {book.is_published ? 'Publicado' : 'Borrador'}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="secondary" asChild>
          <Link href={`/admin/libros/${bookId}/editor`}>
            <Layers className="w-4 h-4" />
            Editor de escenas
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/admin/libros/${bookId}/variantes`}>
            <Grid3X3 className="w-4 h-4" />
            Curar variantes
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/admin/generacion?book=${bookId}`}>
            <Sparkles className="w-4 h-4" />
            Generar variantes
          </Link>
        </Button>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Editar libro</h2>
        <BookForm book={book} />
      </div>
    </div>
  )
}
