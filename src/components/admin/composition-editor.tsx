'use client'

import { useState, useRef, useCallback, useTransition } from 'react'
import { CompositionCanvas } from './composition-canvas'
import {
  updateCharacterPosition,
  generateBackground,
} from '@/app/admin/libros/[bookId]/compositor/actions'
import { Button } from '@/components/ui/button'
import {
  FlipHorizontal,
  Upload,
  Layers,
  CheckCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'

interface Scene {
  id: string
  scene_number: number
  visual_description: string | null
  text_narrative: unknown
  background_url: string | null
  character_x: number | null
  character_y: number | null
  character_scale: number | null
  character_flip: boolean | null
  character_z_index: number | null
}

interface Variant {
  id: string
  gender: string
  skin_tone: string
  hair_color: string
  hair_type: string
  has_glasses: boolean
  character_layer_url: string | null
  status: string
}

interface CompositionEditorProps {
  bookId: string
  stylePrompt: string
  scenes: Scene[]
  variants: Variant[]
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

function variantLabel(v: Variant): string {
  const gender = v.gender === 'girl' ? 'Nina' : 'Nino'
  const glasses = v.has_glasses ? ', lentes' : ''
  return `${gender} — ${v.skin_tone}, ${v.hair_color}, ${v.hair_type}${glasses}`
}

export function CompositionEditor({
  bookId,
  stylePrompt,
  scenes,
  variants,
}: CompositionEditorProps) {
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ''
  )
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showComposed, setShowComposed] = useState(false)
  const [composedUrl, setComposedUrl] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [alphaWarning, setAlphaWarning] = useState('')
  const [isGeneratingBg, setIsGeneratingBg] = useState(false)
  const [bgPrompt, setBgPrompt] = useState('')
  const [showBgGenerator, setShowBgGenerator] = useState(false)
  const [localBgUrl, setLocalBgUrl] = useState<string | null>(null)
  const [localCharUrl, setLocalCharUrl] = useState<string | null>(null)

  // Local position state (for real-time drag updates)
  const [charX, setCharX] = useState(scenes[0]?.character_x ?? 50)
  const [charY, setCharY] = useState(scenes[0]?.character_y ?? 50)
  const [charScale, setCharScale] = useState(scenes[0]?.character_scale ?? 0.6)
  const [charFlip, setCharFlip] = useState(scenes[0]?.character_flip ?? false)

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scene = scenes[selectedSceneIdx]
  const selectedVariant = variants.find((v) => v.id === selectedVariantId)

  // Debounced save to server
  const savePosition = useCallback(
    (x: number, y: number, scale: number, flip: boolean) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        if (!scene) return
        startTransition(async () => {
          await updateCharacterPosition(scene.id, bookId, {
            character_x: Math.round(x * 100) / 100,
            character_y: Math.round(y * 100) / 100,
            character_scale: Math.round(scale * 1000) / 1000,
            character_flip: flip,
          })
        })
      }, 500)
    },
    [scene, bookId, startTransition]
  )

  const handlePositionChange = useCallback(
    (x: number, y: number) => {
      setCharX(x)
      setCharY(y)
      setShowComposed(false)
      savePosition(x, y, charScale, charFlip)
    },
    [charScale, charFlip, savePosition]
  )

  const handleScaleChange = (newScale: number) => {
    setCharScale(newScale)
    setShowComposed(false)
    savePosition(charX, charY, newScale, charFlip)
  }

  const handleFlipToggle = () => {
    const newFlip = !charFlip
    setCharFlip(newFlip)
    setShowComposed(false)
    savePosition(charX, charY, charScale, newFlip)
  }

  const handleSceneSelect = (idx: number) => {
    setSelectedSceneIdx(idx)
    const s = scenes[idx]
    setCharX(s?.character_x ?? 50)
    setCharY(s?.character_y ?? 50)
    setCharScale(s?.character_scale ?? 0.6)
    setCharFlip(s?.character_flip ?? false)
    setComposedUrl(null)
    setShowComposed(false)
    setShowBgGenerator(false)
    setLocalBgUrl(null)
    setBgPrompt(s?.visual_description || '')
    setError('')
    setSuccess('')
  }

  const handleGenerateBackground = async () => {
    if (!scene || !bgPrompt.trim()) return
    setError('')
    setSuccess('')
    setIsGeneratingBg(true)

    startTransition(async () => {
      const result = await generateBackground({
        sceneId: scene.id,
        bookId,
        sceneNumber: scene.scene_number,
        prompt: bgPrompt.trim(),
        stylePrompt,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(`Fondo generado (seed: ${result.seed})`)
        setLocalBgUrl(result.backgroundUrl ?? null)
        setShowBgGenerator(false)
      }
      setIsGeneratingBg(false)
    })
  }

  const handleUploadBackground = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file || !scene) return
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('sceneId', scene.id)
    formData.append('bookId', bookId)
    formData.append('sceneNumber', String(scene.scene_number))

    try {
      const res = await fetch('/api/admin/upload-background', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al subir fondo')
        return
      }
      setSuccess('Fondo subido correctamente')
      setLocalBgUrl(data.backgroundUrl)
    } catch {
      setError('Error de conexión al subir fondo')
    }
  }

  const handleUploadCharacter = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file || !selectedVariantId) return
    setError('')
    setAlphaWarning('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('variantId', selectedVariantId)
    formData.append('bookId', bookId)

    try {
      const res = await fetch('/api/admin/upload-character', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al subir personaje')
        return
      }
      if (data.warning) {
        setAlphaWarning(data.warning)
      }
      setSuccess('Personaje subido correctamente')
      setLocalCharUrl(data.characterUrl)
    } catch {
      setError('Error de conexión al subir personaje')
    }
  }

  const handleCompose = async () => {
    if (!scene || !selectedVariantId) return
    setError('')
    setSuccess('')
    setIsComposing(true)

    try {
      const res = await fetch('/api/admin/compose-layers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId: scene.id,
          variantId: selectedVariantId,
          bookId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al componer')
        return
      }
      setComposedUrl(data.composedUrl)
      setShowComposed(true)
      setSuccess('Pagina compuesta exitosamente')
    } catch {
      setError('Error de conexión al componer')
    } finally {
      setIsComposing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-4">
      {/* Left: Scene list */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Escenas
        </h3>
        <div className="space-y-1">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSceneSelect(idx)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                idx === selectedSceneIdx
                  ? 'bg-terracota/10 text-terracota border border-terracota/20'
                  : 'hover:bg-cream text-text-light border border-transparent'
              }`}
            >
              <span className="font-bold">#{s.scene_number}</span>
              <span className="ml-2 text-xs truncate">
                {getNarrative(s.text_narrative) || '(sin texto)'}
              </span>
              {s.background_url && (
                <span className="ml-1 text-[10px] text-sage">BG</span>
              )}
            </button>
          ))}
        </div>

        {/* Variant selector */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
            Variante
          </h3>
          {variants.length === 0 ? (
            <p className="text-xs text-text-muted">
              No hay variantes. Crea una primero.
            </p>
          ) : (
            <select
              value={selectedVariantId}
              onChange={(e) => {
                setSelectedVariantId(e.target.value)
                setComposedUrl(null)
                setShowComposed(false)
                setLocalCharUrl(null)
              }}
              className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-xs text-text"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {variantLabel(v)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Center: Canvas */}
      <div>
        <CompositionCanvas
          backgroundUrl={localBgUrl || scene?.background_url || null}
          characterUrl={localCharUrl || selectedVariant?.character_layer_url || null}
          characterX={charX}
          characterY={charY}
          characterScale={charScale}
          characterFlip={charFlip}
          composedUrl={composedUrl}
          showComposed={showComposed}
          onPositionChange={handlePositionChange}
        />
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
        {alphaWarning && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg px-3 py-2 text-xs text-warning-dark flex gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {alphaWarning}
          </div>
        )}

        {/* Position controls */}
        <div className="bg-white rounded-xl border border-border-light p-4 space-y-3">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wide">
            Posicion
          </h3>

          {/* Scale slider */}
          <div>
            <label className="flex justify-between text-xs text-text-muted mb-1">
              <span>Escala</span>
              <span className="font-mono">{Math.round(charScale * 100)}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="200"
              value={Math.round(charScale * 100)}
              onChange={(e) =>
                handleScaleChange(Number(e.target.value) / 100)
              }
              className="w-full accent-terracota"
            />
          </div>

          {/* X / Y inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-text-muted">X</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={Math.round(charX * 10) / 10}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setCharX(v)
                  savePosition(v, charY, charScale, charFlip)
                }}
                className="w-full rounded border border-border px-2 py-1 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Y</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={Math.round(charY * 10) / 10}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setCharY(v)
                  savePosition(charX, v, charScale, charFlip)
                }}
                className="w-full rounded border border-border px-2 py-1 text-xs font-mono"
              />
            </div>
          </div>

          {/* Flip button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFlipToggle}
            className="w-full"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            {charFlip ? 'Quitar espejo' : 'Espejo horizontal'}
          </Button>
        </div>

        {/* Background section */}
        <div className="bg-white rounded-xl border border-border-light p-4 space-y-3">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wide">
            Fondo
          </h3>

          {/* Generate background with LoRA */}
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              setShowBgGenerator(!showBgGenerator)
              if (!bgPrompt && scene?.visual_description) {
                setBgPrompt(scene.visual_description)
              }
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showBgGenerator ? 'Cerrar generador' : 'Generar con LoRA'}
          </Button>

          {showBgGenerator && (
            <div className="space-y-2">
              <textarea
                value={bgPrompt}
                onChange={(e) => setBgPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
                placeholder="Describe el fondo (sin personaje)..."
              />
              <p className="text-[10px] text-text-muted">
                Usa el LoRA de estilo Tipiti (tptbk illustration). No incluye personaje.
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={handleGenerateBackground}
                disabled={isGeneratingBg || !bgPrompt.trim()}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isGeneratingBg ? 'Generando fondo...' : 'Generar fondo'}
              </Button>
            </div>
          )}

          {/* Or upload manually */}
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-terracota/30 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-light">O subir fondo manualmente</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUploadBackground}
              className="hidden"
            />
          </label>
        </div>

        {/* Character upload section */}
        <div className="bg-white rounded-xl border border-border-light p-4 space-y-3">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wide">
            Personaje
          </h3>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-terracota/30 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-light">Subir personaje (PNG transparente)</span>
            <input
              type="file"
              accept="image/png"
              onChange={handleUploadCharacter}
              className="hidden"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Toggle composed/edit view */}
          {composedUrl && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setShowComposed(!showComposed)}
            >
              {showComposed ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Volver a editar
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Ver resultado
                </>
              )}
            </Button>
          )}

          {/* Compose button */}
          <Button
            size="sm"
            className="w-full"
            onClick={handleCompose}
            disabled={
              isComposing ||
              !scene?.background_url ||
              !selectedVariant?.character_layer_url
            }
          >
            <Layers className="w-3.5 h-3.5" />
            {isComposing ? 'Componiendo...' : 'Componer pagina'}
          </Button>

          {/* Approve button */}
          {composedUrl && (
            <Button
              size="sm"
              className="w-full bg-sage hover:bg-sage/90"
              disabled={isPending}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Aprobar para impresion
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
