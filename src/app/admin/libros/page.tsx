import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Eye, EyeOff } from 'lucide-react'

export default async function AdminLibrosPage() {
  const supabase = await createClient()

  const { data: books } = await supabase
    .from('books')
    .select(`
      id,
      slug,
      title_template,
      target_age,
      price_clp,
      is_published,
      total_scenes,
      generation_engine,
      created_at,
      character_variants(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text font-display">Libros</h1>
          <p className="text-sm text-text-muted mt-1">
            {books?.length || 0} libro{books?.length !== 1 ? 's' : ''} en catálogo
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/libros/nuevo">
            <Plus className="w-4 h-4" />
            Nuevo libro
          </Link>
        </Button>
      </div>

      {/* Books table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light bg-cream/50">
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3">Libro</th>
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3 hidden md:table-cell">Slug</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Escenas</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Variantes</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3">Estado</th>
              <th className="text-right text-xs font-medium text-text-muted px-4 py-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => {
              const variantCount = (book.character_variants as unknown as { count: number }[])?.[0]?.count ?? 0
              return (
                <tr key={book.id} className="border-b border-border-light last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/libros/${book.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-terracota/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-terracota" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text group-hover:text-terracota transition-colors">
                          {book.title_template}
                        </p>
                        {book.target_age && (
                          <p className="text-xs text-text-muted">{book.target_age} años</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <code className="text-xs text-text-muted bg-cream px-2 py-0.5 rounded">
                      {book.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-sm text-text">{book.total_scenes || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-sm text-text">{variantCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {book.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sage bg-sage/10 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" />
                        Público
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted bg-cream px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-text">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(book.price_clp)}
                    </span>
                  </td>
                </tr>
              )
            })}

            {(!books || books.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <BookOpen className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-text-muted">No hay libros aún</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href="/admin/libros/nuevo">
                      <Plus className="w-3.5 h-3.5" />
                      Crear primer libro
                    </Link>
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
