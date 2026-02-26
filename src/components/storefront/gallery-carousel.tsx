'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const spreads = [
  { id: 1, alt: 'Portada del libro', bg: 'bg-rose/20' },
  { id: 2, alt: 'Escena 1 — La habitación', bg: 'bg-sage/20' },
  { id: 3, alt: 'Escena 2 — El baño', bg: 'bg-blue/20' },
  { id: 4, alt: 'Escena 3 — La cocina', bg: 'bg-rose/20' },
  { id: 5, alt: 'Escena 4 — El jardín', bg: 'bg-sage/20' },
  { id: 6, alt: 'Escena 5 — Buenas noches', bg: 'bg-blue/20' },
]

export function GalleryCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? spreads.length - 1 : c - 1))
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c === spreads.length - 1 ? 0 : c + 1))
  }, [])

  return (
    <div className="relative">
      {/* Main slide */}
      <div className="overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(196,125,90,0.08)]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {spreads.map((spread) => (
            <div
              key={spread.id}
              className={`w-full shrink-0 aspect-[3/2] ${spread.bg} flex items-center justify-center`}
            >
              <div className="text-center px-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-white/50 flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-terracota/40">
                    {spread.id}
                  </span>
                </div>
                <p className="text-sm text-text-light">{spread.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(196,125,90,0.15)] flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-text" strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(196,125,90,0.15)] flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 text-text" strokeWidth={1.5} />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {spreads.map((spread, i) => (
          <button
            key={spread.id}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === current ? 'bg-terracota' : 'bg-border'
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
