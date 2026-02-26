'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

interface BookPreviewProps {
  pages: { sceneNumber: number; narrative: string }[]
  childName: string
}

const pageBgColors = [
  'bg-rose/15', 'bg-sage/15', 'bg-blue/15', 'bg-rose/10',
  'bg-sage/10', 'bg-blue/10', 'bg-rose/15', 'bg-sage/15',
  'bg-blue/15', 'bg-rose/10', 'bg-sage/10', 'bg-blue/10',
]

export function BookPreview({ pages, childName }: BookPreviewProps) {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(pages.length - 1, c + 1))

  const currentPage = pages[current]
  const narrative = currentPage?.narrative.replace(/{name}/g, childName || '...')

  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-cream flex flex-col' : 'relative'}>
      {/* Fullscreen toggle */}
      <div className={`flex justify-end ${fullscreen ? 'p-4' : 'mb-3'}`}>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-terracota transition-colors"
        >
          {fullscreen ? (
            <><Minimize2 className="w-4 h-4" /> Salir</>
          ) : (
            <><Maximize2 className="w-4 h-4" /> Pantalla completa</>
          )}
        </button>
      </div>

      {/* Page display */}
      <div className={`relative overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(196,125,90,0.12)] border border-border-light ${fullscreen ? 'flex-1 mx-4 mb-4' : ''}`}>
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {pages.map((page, i) => (
            <div
              key={i}
              className={`w-full shrink-0 ${fullscreen ? 'h-full' : 'aspect-[4/3]'} ${pageBgColors[i % pageBgColors.length]} flex flex-col items-center justify-center p-8`}
            >
              <div className="text-center max-w-md">
                {/* Page number */}
                <span className="inline-block px-3 py-1 rounded-full bg-white/60 text-xs text-text-muted mb-4">
                  {page.sceneNumber === 0 ? 'Portada' : `Página ${page.sceneNumber}`}
                </span>

                {/* Illustration placeholder */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-xl bg-white/50 flex items-center justify-center">
                  <span className="text-4xl">{page.sceneNumber === 0 ? '📖' : '🎨'}</span>
                </div>

                {/* Narrative text with name overlay */}
                <p className="text-base md:text-lg text-text leading-relaxed font-handwritten">
                  {narrative}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(196,125,90,0.15)] flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text" strokeWidth={1.5} />
          </button>
        )}
        {current < pages.length - 1 && (
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(196,125,90,0.15)] flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Dots */}
      <div className={`flex items-center justify-center gap-1.5 ${fullscreen ? 'pb-4' : 'mt-4'}`}>
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? 'bg-terracota' : 'bg-border'
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>

      {/* Page counter */}
      <p className="text-center text-xs text-text-muted mt-2">
        {current + 1} / {pages.length}
      </p>
    </div>
  )
}
