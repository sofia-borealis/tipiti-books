import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    title: 'Para tu hijo/a',
    description: 'Un día con mi mamá — su primera aventura personalizada',
    image: '/cat-child-new.webp',
    href: '/catalogo',
    available: true,
  },
  {
    title: 'Para mamá',
    description: 'Un día con mi mamá — el regalo que atesorará para siempre',
    image: '/cat-mother-new.webp',
    href: '/catalogo',
    available: true,
  },
  {
    title: 'Para hermanos',
    description: 'Historias de aventuras entre hermanos — próximamente',
    image: '/cat-siblings-new.webp',
    href: '#',
    available: false,
  },
  {
    title: 'Para papá',
    description: 'Aventuras con papá — próximamente',
    image: '/cat-father-new.webp',
    href: '#',
    available: false,
  },
]

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map((cat) => {
        const content = (
          <div
            title={cat.available ? undefined : 'Próximamente'}
            className={`group relative aspect-[3/4] rounded-lg overflow-hidden ${
              cat.available
                ? 'cursor-pointer'
                : 'opacity-60 cursor-default'
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover ${
                cat.available
                  ? 'group-hover:scale-105 transition-transform duration-300'
                  : ''
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Badge */}
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider ${
                cat.available
                  ? 'bg-berry text-cream'
                  : 'bg-ink-muted/80 text-cream'
              }`}
            >
              {cat.available ? 'Disponible' : 'Próximamente'}
            </span>

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-base md:text-lg font-display font-bold text-white">
                {cat.title}
              </h3>
              <p className="mt-1 text-xs text-white/80 leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>
          </div>
        )

        if (cat.available) {
          return (
            <Link key={cat.title} href={cat.href}>
              {content}
            </Link>
          )
        }

        return <div key={cat.title}>{content}</div>
      })}
    </div>
  )
}
