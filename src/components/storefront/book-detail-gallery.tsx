'use client'

import { useState } from 'react'

interface Scene {
  id: string
  scene_number: number
  visual_description: string
  text_narrative: Record<string, string>
}

const sceneBgColors = [
  'bg-rose/15', 'bg-sage/15', 'bg-blue/15', 'bg-rose/10',
  'bg-sage/10', 'bg-blue/10', 'bg-rose/15', 'bg-sage/15',
  'bg-blue/15', 'bg-rose/10', 'bg-sage/10', 'bg-blue/10',
]

export function BookDetailGallery({
  scenes,
  bookTitle,
}: {
  scenes: Scene[]
  bookTitle: string
}) {
  const [active, setActive] = useState(0)

  if (scenes.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-cream-dark flex items-center justify-center">
        <p className="text-text-muted">Sin escenas</p>
      </div>
    )
  }

  const currentScene = scenes[active]
  const narrative = currentScene?.text_narrative?.es || ''

  return (
    <div>
      {/* Main image */}
      <div
        className={`aspect-[4/3] rounded-2xl ${sceneBgColors[active % sceneBgColors.length]} flex items-center justify-center border border-border-light`}
      >
        <div className="text-center px-8 max-w-sm">
          <span className="text-4xl mb-3 block">
            {active === 0 ? '📖' : '🎨'}
          </span>
          <p className="text-sm text-text-light leading-relaxed">
            {narrative.replace(/{name}/g, '...')}
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            onClick={() => setActive(i)}
            className={`shrink-0 w-16 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
              i === active
                ? 'ring-2 ring-terracota bg-terracota/10 text-terracota'
                : `${sceneBgColors[i % sceneBgColors.length]} text-text-muted hover:ring-1 hover:ring-border`
            }`}
          >
            {i === 0 ? 'Tapa' : i}
          </button>
        ))}
      </div>
    </div>
  )
}
