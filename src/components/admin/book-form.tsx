'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { createBook, updateBook, type BookFormData } from '@/app/admin/libros/actions'

interface BookFormProps {
  book?: {
    id: string
    slug: string
    title_template: string
    description: string | null
    style_prompt: string
    target_age: string | null
    price_clp: number
    price_usd: number | null
    total_scenes: number
    generation_engine: string | null
    page_width_mm: number | null
    page_height_mm: number | null
    total_pages: number | null
  }
}

export function BookForm({ book }: BookFormProps) {
  const isEditing = !!book
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [slug, setSlug] = useState(book?.slug || '')
  const [titleTemplate, setTitleTemplate] = useState(book?.title_template || '')
  const [description, setDescription] = useState(book?.description || '')
  const [stylePrompt, setStylePrompt] = useState(book?.style_prompt || '')
  const [targetAge, setTargetAge] = useState(book?.target_age || '0-3')
  const [priceCLP, setPriceCLP] = useState(book?.price_clp?.toString() || '29990')
  const [totalScenes, setTotalScenes] = useState(book?.total_scenes?.toString() || '11')
  const [engine, setEngine] = useState(book?.generation_engine || 'flux-kontext-pro')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const data: BookFormData = {
      slug,
      title_template: titleTemplate,
      description: description || undefined,
      style_prompt: stylePrompt,
      target_age: targetAge || undefined,
      price_clp: parseInt(priceCLP) || 29990,
      total_scenes: parseInt(totalScenes) || 11,
      generation_engine: engine || undefined,
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateBook(book.id, data)
        : await createBook(data)

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Slug *</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="buenas-noches"
            required
            disabled={isEditing}
          />
          <p className="text-xs text-text-muted mt-1">URL: /libro/{slug || '...'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Título (con {'{name}'}) *</label>
          <Input
            value={titleTemplate}
            onChange={(e) => setTitleTemplate(e.target.value)}
            placeholder="Buenas Noches, {name}"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-base text-text resize-none outline-none focus-visible:border-terracota focus-visible:ring-[3px] focus-visible:ring-terracota/15"
          placeholder="Un cuento mágico donde {name} es la protagonista..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Style Prompt *</label>
        <textarea
          value={stylePrompt}
          onChange={(e) => setStylePrompt(e.target.value)}
          rows={4}
          required
          className="w-full rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-sm text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-[3px] focus-visible:ring-terracota/15"
          placeholder="A watercolor illustration..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Edad</label>
          <Input value={targetAge} onChange={(e) => setTargetAge(e.target.value)} placeholder="0-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Precio CLP *</label>
          <Input type="number" value={priceCLP} onChange={(e) => setPriceCLP(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Escenas</label>
          <Input type="number" value={totalScenes} onChange={(e) => setTotalScenes(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Motor IA</label>
          <Input value={engine} onChange={(e) => setEngine(e.target.value)} />
        </div>
      </div>

      {error && <p className="text-sm text-terracota-dark">{error}</p>}

      <Button type="submit" disabled={isPending}>
        <Save className="w-4 h-4" />
        {isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear libro'}
      </Button>
    </form>
  )
}
