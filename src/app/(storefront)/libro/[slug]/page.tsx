import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookFAQ } from '@/components/storefront/book-faq'
import { ShareButton } from '@/components/storefront/share-button'
import { BookDetailGallery } from '@/components/storefront/book-detail-gallery'
import { BookDetailCTA } from '@/components/storefront/book-detail-cta'
import { ProductSchema } from '@/components/seo/structured-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: book } = await supabase
    .from('books')
    .select('title_template, description')
    .eq('slug', slug)
    .single()

  if (!book) return { title: 'Libro no encontrado' }

  return {
    title: book.title_template.replace('{name}', '...'),
    description: book.description?.replace(/{name}/g, '...'),
  }
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!book) notFound()

  const { data: scenes } = await supabase
    .from('scenes')
    .select('id, scene_number, visual_description, text_narrative')
    .eq('book_id', book.id)
    .order('scene_number', { ascending: true })

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(book.price_clp)

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12">
      <ProductSchema
        name={book.title_template.replace('{name}', '...')}
        description={book.description || 'Libro infantil personalizado con ilustraciones acuarela'}
        price={book.price_clp}
        slug={book.slug}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-text-muted mb-8">
        <Link href="/catalogo" className="hover:text-terracota transition-colors">
          Catálogo
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text">{book.title_template.replace('{name}', '...')}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Gallery */}
        <BookDetailGallery
          scenes={scenes || []}
          bookTitle={book.title_template}
        />

        {/* Right: Info */}
        <div>
          {book.target_age && (
            <span className="inline-block px-3 py-1 rounded-full text-xs bg-sage/15 text-sage-dark mb-4">
              {book.target_age} años
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-display font-bold text-text leading-tight">
            {book.title_template.replace('{name}', '...')}
          </h1>

          {book.description && (
            <p className="mt-4 text-base text-text-light leading-relaxed">
              {book.description.replace(/{name}/g, '...')}
            </p>
          )}

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-cream-dark rounded-xl p-3">
              <p className="text-xs text-text-muted">Páginas</p>
              <p className="text-sm font-medium text-text">{book.total_pages}</p>
            </div>
            <div className="bg-cream-dark rounded-xl p-3">
              <p className="text-xs text-text-muted">Tamaño</p>
              <p className="text-sm font-medium text-text">{book.page_width_mm}×{book.page_height_mm}mm</p>
            </div>
            <div className="bg-cream-dark rounded-xl p-3">
              <p className="text-xs text-text-muted">Idioma</p>
              <p className="text-sm font-medium text-text">Español</p>
            </div>
            <div className="bg-cream-dark rounded-xl p-3">
              <p className="text-xs text-text-muted">Estilo</p>
              <p className="text-sm font-medium text-text">Acuarela</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-border-light shadow-[0_4px_20px_rgba(196,125,90,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-terracota font-display">
                {formattedPrice}
              </span>
              <ShareButton title={book.title_template.replace('{name}', '...')} />
            </div>
            <BookDetailCTA bookId={book.id} bookSlug={book.slug} bookTitle={book.title_template} />
            <p className="mt-3 text-xs text-text-muted text-center">
              Envío gratis a todo Chile
            </p>
          </div>

          {/* FAQs */}
          <div className="mt-10">
            <h2 className="text-xl font-display font-bold text-text mb-4">
              Preguntas Frecuentes
            </h2>
            <BookFAQ />
          </div>
        </div>
      </div>
    </div>
  )
}
