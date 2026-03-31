import { Star } from 'lucide-react'

const reviews = [
  {
    stars: 5,
    quote: 'Mi hija no podía creer que era ella en el libro. Lo leemos todas las noches.',
    name: 'Carolina M.',
    detail: 'Mamá de Emilia, 4 años',
    initial: 'C',
  },
  {
    stars: 5,
    quote: 'La calidad es increíble. Se nota que es hecho con cariño.',
    name: 'Paula R.',
    detail: 'Mamá de Matías, 3 años',
    initial: 'P',
  },
  {
    stars: 5,
    quote: 'Fue el regalo más comentado. Todos preguntaron dónde lo compré.',
    name: 'Valentina S.',
    detail: 'Tía de Tomás, 5 años',
    initial: 'V',
  },
]

export function ReviewsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div
          key={review.name}
          className="bg-white rounded-lg border border-rule-light p-6"
        >
          {/* Stars */}
          <div className="flex gap-0.5" role="img" aria-label={`${review.stars} de 5 estrellas`}>
            {Array.from({ length: review.stars }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className="w-4 h-4 fill-berry text-berry"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="mt-4 text-base italic text-ink leading-relaxed">
            &ldquo;{review.quote}&rdquo;
          </p>

          {/* Author */}
          <div className="mt-5 flex items-center gap-3">
            <div aria-hidden="true" className="w-9 h-9 rounded-full bg-berry/10 flex items-center justify-center">
              <span className="text-sm font-bold text-berry">{review.initial}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{review.name}</p>
              <p className="text-xs text-ink-muted">{review.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
