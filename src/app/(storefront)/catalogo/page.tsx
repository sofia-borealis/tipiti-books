import { createClient } from '@/lib/supabase/server'
import { BookCard } from '@/components/storefront/book-card'

export const metadata = {
  title: 'Catálogo',
  description: 'Explora nuestros libros infantiles personalizados con ilustraciones acuarela.',
}

export default async function CatalogoPage() {
  const supabase = await createClient()

  const { data: books } = await supabase
    .from('books')
    .select('id, slug, title_template, description, target_age, price_clp, cover_template_url, is_published')
    .order('created_at', { ascending: false })

  const publishedBooks = books?.filter((b) => b.is_published) || []
  const upcomingBooks = books?.filter((b) => !b.is_published) || []

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
          Nuestros Libros
        </h1>
        <p className="mt-3 text-base text-text-light max-w-md mx-auto">
          Cada libro es una aventura única, ilustrada a mano con acuarelas.
        </p>
      </div>

      {publishedBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {publishedBooks.map((book) => (
            <BookCard
              key={book.id}
              slug={book.slug}
              title={book.title_template}
              description={book.description}
              targetAge={book.target_age}
              priceCLP={book.price_clp}
              coverUrl={book.cover_template_url}
              isPublished={true}
            />
          ))}
        </div>
      )}

      {publishedBooks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-text-light">
            Nuestro primer libro está casi listo. ¡Pronto podrás personalizarlo!
          </p>
        </div>
      )}

      {upcomingBooks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold text-text mb-8 text-center">
            Próximamente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {upcomingBooks.map((book) => (
              <BookCard
                key={book.id}
                slug={book.slug}
                title={book.title_template}
                description={book.description}
                targetAge={book.target_age}
                priceCLP={book.price_clp}
                coverUrl={book.cover_template_url}
                isPublished={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
