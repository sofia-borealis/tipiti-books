import Link from 'next/link'
import { BookForm } from '@/components/admin/book-form'
import { ArrowLeft } from 'lucide-react'

export default function NuevoLibroPage() {
  return (
    <div>
      <Link
        href="/admin/libros"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-terracota transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a libros
      </Link>

      <h1 className="text-2xl font-bold text-text font-display mb-6">
        Nuevo libro
      </h1>

      <div className="bg-white rounded-xl border border-border-light shadow-sm p-6">
        <BookForm />
      </div>
    </div>
  )
}
