import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VariantDetail } from '@/components/admin/variant-detail'
import { ArrowLeft } from 'lucide-react'

export default async function VariantDetailPage({
  params,
}: {
  params: Promise<{ bookId: string; variantId: string }>
}) {
  const { bookId, variantId } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title_template')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: variant } = await supabase
    .from('character_variants')
    .select(`
      id,
      gender,
      skin_tone,
      hair_color,
      hair_type,
      has_glasses,
      status,
      variant_pages(
        id,
        image_url,
        scene_id,
        scenes(scene_number, text_narrative)
      )
    `)
    .eq('id', variantId)
    .single()

  if (!variant) notFound()

  // Sort pages by scene number (scenes is an array from Supabase join)
  const rawPages = variant.variant_pages || []
  const pages = [...rawPages]
    .sort((a, b) => {
      const aNum = Array.isArray(a.scenes) ? a.scenes[0]?.scene_number || 0 : 0
      const bNum = Array.isArray(b.scenes) ? b.scenes[0]?.scene_number || 0 : 0
      return aNum - bNum
    })

  return (
    <div>
      <Link
        href={`/admin/libros/${bookId}/variantes`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a variantes
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text font-display">
          Detalle de variante
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {variant.gender === 'girl' ? '👧 Niña' : '👦 Niño'} — {variant.skin_tone}, {variant.hair_color}, {variant.hair_type}
          {variant.has_glasses ? ', con lentes' : ''}
        </p>
      </div>

      <VariantDetail
        bookId={bookId}
        variantId={variantId}
        status={variant.status}
        pages={pages.map((p) => {
          const scene = Array.isArray(p.scenes) ? p.scenes[0] : null
          return {
            id: p.id,
            imageUrl: p.image_url,
            sceneNumber: scene?.scene_number || 0,
            narrativeText: scene?.text_narrative || null,
          }
        })}
      />
    </div>
  )
}
