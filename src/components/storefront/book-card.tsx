import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookCardProps {
  slug: string
  title: string
  description: string | null
  targetAge: string | null
  priceCLP: number
  coverUrl: string | null
  isPublished: boolean
  badge?: string | null
}

export function BookCard({
  slug,
  title,
  description,
  targetAge,
  priceCLP,
  coverUrl,
  isPublished,
  badge,
}: BookCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(priceCLP)

  return (
    <div className="group bg-white rounded-2xl border border-border-light overflow-hidden shadow-[0_4px_20px_rgba(196,125,90,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(196,125,90,0.15)] transition-all duration-300">
      {/* Cover */}
      <div className="relative aspect-[4/3] bg-cream-dark overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose/20 via-cream-dark to-terracota/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-terracota/40" />
            </div>
          </div>
        )}

        {!isPublished && (
          <div className="absolute inset-0 bg-text/40 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white/90 text-sm font-medium text-text">
              Próximamente
            </span>
          </div>
        )}

        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-terracota text-cream">
            {badge}
          </span>
        )}

        {targetAge && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs bg-sage/15 text-sage-dark backdrop-blur-sm">
            {targetAge} años
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-display font-bold text-text leading-tight">
          {title.replace('{name}', '...')}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-text-light line-clamp-2 leading-relaxed">
            {description.replace(/{name}/g, '...')}
          </p>
        )}

        {isPublished && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-terracota">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalizable</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-terracota">
            {formattedPrice}
          </span>

          {isPublished ? (
            <Button asChild size="sm">
              <Link href={`/libro/${slug}`}>
                Personalizar
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Avísame
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
