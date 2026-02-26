import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VariantGrid } from '@/components/admin/variant-grid'
import { ArrowLeft } from 'lucide-react'

export default async function VariantesPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title_template, total_scenes')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: variants } = await supabase
    .from('character_variants')
    .select(`
      id,
      gender,
      skin_tone,
      hair_color,
      hair_type,
      has_glasses,
      status,
      variant_pages(id, image_url, scene_id)
    `)
    .eq('book_id', bookId)
    .order('gender')
    .order('skin_tone')
    .order('hair_color')

  const statusCounts = (variants || []).reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

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
          Variantes de personaje
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {variants?.length || 0} variantes —{' '}
          <span className="text-sage">{statusCounts['approved'] || 0} aprobadas</span>
          {' · '}
          <span className="text-terracota">{statusCounts['pending_review'] || 0} por revisar</span>
          {' · '}
          <span className="text-text-muted">{statusCounts['pending'] || 0} pendientes</span>
        </p>
      </div>

      <VariantGrid
        bookId={bookId}
        variants={(variants || []).map(v => ({
          ...v,
          variant_pages: v.variant_pages || [],
        }))}
      />
    </div>
  )
}
