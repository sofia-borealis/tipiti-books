'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  generateExperimental,
  useAsBackground,
} from '@/app/admin/generacion/experimental/actions'
import { Sparkles, Image as ImageIcon, Download } from 'lucide-react'

interface Book {
  id: string
  title_template: string
  slug: string
  style_prompt: string
}

interface Scene {
  id: string
  book_id: string
  scene_number: number
  visual_description: string | null
  text_narrative: unknown
}

interface ExperimentalGeneratorProps {
  books: Book[]
  scenes: Scene[]
}

function getNarrative(tn: unknown): string {
  if (!tn) return ''
  if (typeof tn === 'string') return tn
  if (typeof tn === 'object' && tn !== null) {
    const obj = tn as Record<string, string>
    return obj.es || Object.values(obj)[0] || ''
  }
  return ''
}

export function ExperimentalGenerator({
  books,
  scenes,
}: ExperimentalGeneratorProps) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '')
  const [selectedSceneId, setSelectedSceneId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [includeStyleLora, setIncludeStyleLora] = useState(true)
  const [includeCharacterLora, setIncludeCharacterLora] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const selectedBook = books.find((b) => b.id === selectedBookId)
  const bookScenes = scenes.filter((s) => s.book_id === selectedBookId)
  const selectedScene = bookScenes.find((s) => s.id === selectedSceneId)

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId)
    setSelectedSceneId('')
    setPrompt('')
    setResultUrl(null)
  }

  const handleSceneChange = (sceneId: string) => {
    setSelectedSceneId(sceneId)
    const scene = bookScenes.find((s) => s.id === sceneId)
    if (scene?.visual_description) {
      setPrompt(scene.visual_description)
    }
    setResultUrl(null)
  }

  const handleGenerate = async () => {
    if (!selectedBook || !prompt.trim()) return
    setError('')
    setSuccess('')
    setIsGenerating(true)
    setResultUrl(null)

    try {
      const result = await generateExperimental({
        bookId: selectedBookId,
        sceneId: selectedSceneId,
        sceneNumber: selectedScene?.scene_number || 0,
        prompt: prompt.trim(),
        stylePrompt: selectedBook.style_prompt || '',
        includeStyleLora,
        includeCharacterLora,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.imageUrl) {
        setResultUrl(result.imageUrl)
        setSuccess(
          `Imagen generada (seed: ${result.seed}). LoRAs: ${result.lorasUsed?.length || 0}`
        )
      }
    } catch {
      setError('Error al generar imagen')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseAsBackground = () => {
    if (!resultUrl || !selectedSceneId || !selectedScene) return
    setError('')

    startTransition(async () => {
      const result = await useAsBackground({
        sceneId: selectedSceneId,
        bookId: selectedBookId,
        sceneNumber: selectedScene.scene_number,
        imageUrl: resultUrl,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Imagen guardada como fondo de la escena')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* Left: Result preview */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <div className="aspect-[11/9] bg-cream flex items-center justify-center">
          {resultUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resultUrl}
              alt="Resultado experimental"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-text-muted/40">
              <ImageIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">
                {isGenerating
                  ? 'Generando imagen con LoRAs...'
                  : 'Configura y genera una imagen'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="space-y-4">
        {/* Messages */}
        {error && (
          <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-3 py-2 text-xs text-terracota-dark">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-sage/10 border border-sage/20 rounded-lg px-3 py-2 text-xs text-sage-dark">
            {success}
          </div>
        )}

        {/* Book selector */}
        <div className="bg-white rounded-xl border border-border-light p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-text mb-1">
              Libro
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => handleBookChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title_template}
                </option>
              ))}
            </select>
          </div>

          {/* Scene selector */}
          <div>
            <label className="block text-xs font-medium text-text mb-1">
              Escena (opcional)
            </label>
            <select
              value={selectedSceneId}
              onChange={(e) => handleSceneChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text"
            >
              <option value="">— Sin escena —</option>
              {bookScenes.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.scene_number} — {getNarrative(s.text_narrative) || '(sin texto)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-white rounded-xl border border-border-light p-4">
          <label className="block text-xs font-medium text-text mb-1">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
            placeholder="Describe la imagen que quieres generar..."
          />
          {selectedBook?.style_prompt && (
            <p className="text-[10px] text-text-muted mt-1 truncate">
              Style: {selectedBook.style_prompt.slice(0, 80)}...
            </p>
          )}
        </div>

        {/* LoRA toggles */}
        <div className="bg-white rounded-xl border border-border-light p-4 space-y-2">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wide">
            LoRAs
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeStyleLora}
              onChange={(e) => setIncludeStyleLora(e.target.checked)}
              className="rounded border-border accent-terracota"
            />
            <span className="text-xs text-text">
              Estilo Tipiti{' '}
              <span className="text-text-muted">(tptbk illustration, scale 3)</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharacterLora}
              onChange={(e) => setIncludeCharacterLora(e.target.checked)}
              className="rounded border-border accent-terracota"
            />
            <span className="text-xs text-text">
              Personaje{' '}
              <span className="text-text-muted">(tptbk boy1, scale 1)</span>
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            size="sm"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? 'Generando...' : 'Generar imagen'}
          </Button>

          {resultUrl && selectedSceneId && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleUseAsBackground}
              disabled={isPending}
            >
              <Download className="w-3.5 h-3.5" />
              Usar como fondo de escena #{selectedScene?.scene_number}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
