import Link from 'next/link'

export function StorefrontFooter() {
  return (
    <footer className="border-t border-border-light py-10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 text-center">
        <Link href="/" className="text-lg font-bold text-text font-display">
          Tipiti Books
        </Link>
        <p className="mt-2 text-sm text-text-light">
          Libros infantiles personalizados con ilustraciones acuarela.
        </p>
        <p className="mt-4 text-xs text-text-muted">
          © {new Date().getFullYear()} Tipiti Books — Hecho en Chile con amor.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          <a href="mailto:hola@tipitibooks.com" className="hover:text-terracota transition-colors">
            hola@tipitibooks.com
          </a>
        </p>
      </div>
    </footer>
  )
}
