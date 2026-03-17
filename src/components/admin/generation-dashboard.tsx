'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  triggerSingleVariantGeneration,
  createVariant,
  updateCustomizationPrompt,
} from '@/app/admin/generacion/actions'
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Plus,
  Image as ImageIcon,
  Upload,
  X,
  Save,
} from 'lucide-react'

interface Book {
  id: string
  title: string
  slug: string
  totalScenes: number
  sceneCount: number
  engine: string
  customizationPrompt: string
}

interface Scene {
  id: string
  scene_number: number
  base_illustration_url: string | null
}

interface Variant {
  id: string
  label: string | null
  gender: string
  skin_tone: string
  hair_color: string
  hair_type: string
  has_glasses: boolean
  status: string
  reference_image_url: string | null
  variant_pages: { count: number }[]
}

interface GenerationDashboardProps {
  books: Book[]
  variants: Variant[]
  scenes: Scene[]
  selectedBookId: string | null
}

export function GenerationDashboard({
  books,
  variants,
  scenes,
  selectedBookId,
}: GenerationDashboardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [generatingVariantId, setGeneratingVariantId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const selectedBook = books.find(b => b.id === selectedBookId)
  const scenesWithoutIllustration = scenes.filter(s => !s.base_illustration_url)
  const [customPrompt, setCustomPrompt] = useState(selectedBook?.customizationPrompt || '')
  const [promptSaved, setPromptSaved] = useState(false)

  const handleGenerateSingle = (variantId: string) => {
    if (!selectedBookId) return
    setError('')
    setGeneratingVariantId(variantId)
    startTransition(async () => {
      const result = await triggerSingleVariantGeneration(selectedBookId, variantId)
      setGeneratingVariantId(null)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Book selector */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
        <label className="block text-sm font-medium text-text mb-2">Seleccionar libro</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => router.push(`/admin/generacion?book=${book.id}`)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                book.id === selectedBookId
                  ? 'border-terracota bg-terracota/5'
                  : 'border-border-light hover:border-terracota/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-terracota shrink-0" />
                <span className="text-sm font-medium text-text truncate">{book.title}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                {book.sceneCount} escenas · {book.engine}
              </p>
            </button>
          ))}
          {books.length === 0 && (
            <p className="text-sm text-text-muted col-span-full">No hay libros creados</p>
          )}
        </div>
      </div>

      {selectedBook && (
        <>
          {/* Scenes gallery */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
            <h2 className="text-sm font-semibold text-text mb-3">
              Escenas base ({scenes.length})
            </h2>
            {scenes.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {scenes.map(scene => (
                  <div
                    key={scene.id}
                    className="shrink-0 w-[120px] rounded-lg border border-border-light overflow-hidden"
                  >
                    <div className="aspect-square bg-cream flex items-center justify-center">
                      {scene.base_illustration_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={scene.base_illustration_url}
                          alt={`Escena ${scene.scene_number}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-text-muted/20" />
                      )}
                    </div>
                    <div className="px-2 py-1.5 text-center">
                      <span className="text-[10px] font-medium text-text-muted">
                        Escena {scene.scene_number}
                      </span>
                      {!scene.base_illustration_url && (
                        <span className="block text-[9px] text-terracota">Sin ilustración</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No hay escenas creadas para este libro.</p>
            )}
            {scenesWithoutIllustration.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {scenesWithoutIllustration.length} escena{scenesWithoutIllustration.length > 1 ? 's' : ''} sin ilustración base.
                Súbelas en el editor de escenas.
              </div>
            )}
          </div>

          {/* Customization prompt */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
            <label className="block text-xs font-medium text-text mb-1">
              Prompt de personalización
            </label>
            <p className="text-[10px] text-text-muted mb-2">
              Instrucción que se envía a fal.ai junto con las imágenes. Define cómo transformar la ilustración base con la foto de referencia.
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => { setCustomPrompt(e.target.value); setPromptSaved(false) }}
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
              placeholder="Change the child in the first image to look like the child in the second image."
            />
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending || promptSaved}
                onClick={() => {
                  startTransition(async () => {
                    const result = await updateCustomizationPrompt(selectedBookId!, customPrompt)
                    if (result.error) {
                      setError(result.error)
                    } else {
                      setPromptSaved(true)
                    }
                  })
                }}
              >
                <Save className="w-3 h-3" />
                {promptSaved ? 'Guardado' : 'Guardar prompt'}
              </Button>
              {promptSaved && (
                <span className="text-[10px] text-sage">
                  <CheckCircle className="w-3 h-3 inline mr-0.5" />
                  Guardado
                </span>
              )}
            </div>
          </div>

          {/* Create variant form */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 text-sm font-medium text-terracota hover:text-terracota-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear nueva variante
              </button>
            ) : (
              <CreateVariantForm
                bookId={selectedBookId!}
                onClose={() => setShowCreateForm(false)}
                onCreated={() => {
                  setShowCreateForm(false)
                  router.refresh()
                }}
              />
            )}
          </div>

          {/* Actions bar */}
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleRefresh} disabled={isPending}>
              <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          {error && (
            <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-4 py-3 text-sm text-terracota-dark">
              {error}
            </div>
          )}

          {/* Variant cards */}
          {variants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {variants.map(variant => {
                const pageCount = (variant.variant_pages as unknown as { count: number }[])?.[0]?.count ?? 0
                const displayLabel = variant.label || buildVariantLabel(variant)
                return (
                  <div
                    key={variant.id}
                    className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden"
                  >
                    {/* Reference image */}
                    <div className="aspect-square bg-cream flex items-center justify-center max-h-48">
                      {variant.reference_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={variant.reference_image_url}
                          alt={displayLabel}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-10 h-10 text-text-muted/20 mx-auto mb-1" />
                          <span className="text-[10px] text-text-muted">Sin imagen de referencia</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-text">{displayLabel}</p>
                        <p className="text-[10px] text-text-muted">
                          {variant.gender === 'girl' ? 'Niña' : 'Niño'} · {variant.skin_tone} · {variant.hair_color} · {variant.hair_type}
                          {variant.has_glasses ? ' · lentes' : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          {pageCount}/{selectedBook.sceneCount} escenas
                        </span>
                        <VariantStatus status={variant.status} />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleGenerateSingle(variant.id)}
                          disabled={isPending || variant.status === 'generating'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-terracota/20 text-terracota hover:bg-terracota/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {generatingVariantId === variant.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          Generar
                        </button>
                        <a
                          href={`/admin/libros/${selectedBookId}/variantes/${variant.id}`}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border-light text-text-muted hover:text-text hover:border-border transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Detalle
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border-light p-8 text-center">
              <Sparkles className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-text-muted">
                No hay variantes aún. Crea una nueva variante subiendo la foto de referencia del niño/a.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── Create Variant Form ─── */

function CreateVariantForm({
  bookId,
  onClose,
  onCreated,
}: {
  bookId: string
  onClose: () => void
  onCreated: () => void
}) {
  const [label, setLabel] = useState('')
  const [gender, setGender] = useState<'girl' | 'boy'>('girl')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [skinTone, setSkinTone] = useState('medium')
  const [hairColor, setHairColor] = useState('brown')
  const [hairType, setHairType] = useState('straight')
  const [hasGlasses, setHasGlasses] = useState(false)
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (file: File) => {
    setReferenceFile(file)
    setReferencePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    if (!referenceFile) {
      setError('Selecciona una imagen de referencia del niño/a')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // Step 1: Create variant record
      const result = await createVariant(bookId, {
        label: label.trim(),
        gender,
        skin_tone: skinTone,
        hair_color: hairColor,
        hair_type: hairType,
        has_glasses: hasGlasses,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      // Step 2: Upload reference image
      const formData = new FormData()
      formData.append('file', referenceFile)
      formData.append('variantId', result.variantId!)
      formData.append('bookId', bookId)

      const uploadRes = await fetch('/api/admin/upload-reference-image', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const data = await uploadRes.json()
        setError(data.error || 'Error al subir la imagen de referencia')
        setIsSubmitting(false)
        return
      }

      onCreated()
    } catch {
      setError('Error de conexión')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Crear nueva variante</h3>
        <button type="button" onClick={onClose} className="text-text-muted hover:text-text">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-text mb-1">Nombre / etiqueta *</label>
          <Input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Ej: Sofía, Mateo..."
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-medium text-text mb-1">Género *</label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setGender('girl')}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                gender === 'girl'
                  ? 'border-terracota bg-terracota/5 text-terracota font-medium'
                  : 'border-border-light text-text-muted hover:border-terracota/30'
              }`}
            >
              Niña
            </button>
            <button
              type="button"
              onClick={() => setGender('boy')}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                gender === 'boy'
                  ? 'border-terracota bg-terracota/5 text-terracota font-medium'
                  : 'border-border-light text-text-muted hover:border-terracota/30'
              }`}
            >
              Niño
            </button>
          </div>
        </div>
      </div>

      {/* Reference image upload */}
      <div>
        <label className="block text-xs font-medium text-text mb-1">Imagen de referencia *</label>
        {referencePreview ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={referencePreview}
              alt="Preview"
              className="w-20 h-20 rounded-lg object-cover border border-border-light"
            />
            <label className="text-xs text-text-muted hover:text-terracota cursor-pointer transition-colors">
              Cambiar imagen
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                }}
              />
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-terracota/30 cursor-pointer transition-colors w-fit">
            <Upload className="w-4 h-4 text-text-muted" />
            <span className="text-xs text-text-light">Subir foto del niño/a</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFileSelect(f)
              }}
            />
          </label>
        )}
      </div>

      {/* Advanced options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-text-muted hover:text-text transition-colors"
        >
          {showAdvanced ? '▾' : '▸'} Opciones avanzadas
        </button>
        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            <div>
              <label className="block text-[10px] font-medium text-text-muted mb-1">Tono de piel</label>
              <select
                value={skinTone}
                onChange={e => setSkinTone(e.target.value)}
                className="w-full rounded-lg border border-border-light px-2 py-1.5 text-xs text-text bg-white"
              >
                <option value="light">Claro</option>
                <option value="medium">Medio</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-muted mb-1">Color de pelo</label>
              <select
                value={hairColor}
                onChange={e => setHairColor(e.target.value)}
                className="w-full rounded-lg border border-border-light px-2 py-1.5 text-xs text-text bg-white"
              >
                <option value="blonde">Rubio</option>
                <option value="brown">Castaño</option>
                <option value="black">Negro</option>
                <option value="red">Pelirrojo</option>
                <option value="dark-brown">Castaño oscuro</option>
                <option value="auburn">Cobrizo</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-muted mb-1">Tipo de pelo</label>
              <select
                value={hairType}
                onChange={e => setHairType(e.target.value)}
                className="w-full rounded-lg border border-border-light px-2 py-1.5 text-xs text-text bg-white"
              >
                <option value="straight">Liso</option>
                <option value="curly">Rizado</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-muted mb-1">Lentes</label>
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGlasses}
                  onChange={e => setHasGlasses(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-text">Usa lentes</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-terracota-dark">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || !label.trim()}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isSubmitting ? 'Creando...' : 'Crear variante'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

/* ─── Helpers ─── */

function VariantStatus({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pendiente', className: 'text-text-muted bg-cream' },
    generating: { label: 'Generando', className: 'text-blue bg-blue/10' },
    pending_review: { label: 'Por revisar', className: 'text-terracota bg-terracota/10' },
    approved: { label: 'Aprobada', className: 'text-sage bg-sage/10' },
    rejected: { label: 'Rechazada', className: 'text-terracota-dark bg-terracota/10' },
    failed: { label: 'Error', className: 'text-terracota-dark bg-terracota/10' },
  }
  const c = config[status] || config['pending']
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${c.className}`}>
      {c.label}
    </span>
  )
}

function buildVariantLabel(variant: {
  gender: string
  skin_tone: string
  hair_color: string
}): string {
  const genderLabel = variant.gender === 'girl' ? 'Niña' : 'Niño'
  return `${genderLabel} — ${variant.skin_tone}, ${variant.hair_color}`
}
