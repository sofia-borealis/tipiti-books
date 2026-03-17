'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  approveVariant,
  rejectVariant,
  regenerateVariant,
} from '@/app/admin/libros/[bookId]/variantes/actions'
import { resizeImage } from '@/lib/utils/resize-image'
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
} from 'lucide-react'

interface Page {
  id: string
  imageUrl: string
  sceneNumber: number
  narrativeText: string | null
}

interface VariantDetailProps {
  bookId: string
  variantId: string
  status: string
  pages: Page[]
  referenceImageUrl: string | null
}

export function VariantDetail({ bookId, variantId, status, pages, referenceImageUrl }: VariantDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(0)
  const [error, setError] = useState('')
  const [isUploadingRef, setIsUploadingRef] = useState(false)
  const [localRefUrl, setLocalRefUrl] = useState<string | null>(null)

  const page = pages[currentPage]

  const handleApprove = () => {
    setError('')
    startTransition(async () => {
      const result = await approveVariant(variantId, bookId)
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  const handleReject = () => {
    setError('')
    startTransition(async () => {
      const result = await rejectVariant(variantId, bookId)
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  const handleUploadReference = async (file: File) => {
    setError('')
    setIsUploadingRef(true)
    const compressed = await resizeImage(file)
    const formData = new FormData()
    formData.append('file', compressed)
    formData.append('variantId', variantId)
    formData.append('bookId', bookId)
    try {
      const res = await fetch('/api/admin/upload-reference-image', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          setError(data.error || `Error ${res.status}`)
        } catch {
          setError(`Error ${res.status}: ${text.slice(0, 200)}`)
        }
      } else {
        const data = await res.json()
        setLocalRefUrl(`${data.referenceImageUrl}?t=${Date.now()}`)
      }
    } catch (err) {
      setError(`Error al subir referencia: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsUploadingRef(false)
    }
  }

  const handleRegenerate = () => {
    if (!confirm('¿Regenerar esta variante? Las imágenes actuales se perderán.')) return
    setError('')
    startTransition(async () => {
      const result = await regenerateVariant(variantId, bookId)
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Status + Actions */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-border-light p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Estado:</span>
          <StatusLabel status={status} />
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending || status === 'approved'}
            className="bg-sage hover:bg-sage/90"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleReject}
            disabled={isPending || status === 'rejected'}
          >
            <XCircle className="w-3.5 h-3.5" />
            Rechazar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRegenerate}
            disabled={isPending}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-4 py-3 text-sm text-terracota-dark">
          {error}
        </div>
      )}

      {/* Reference image */}
      <div className="bg-white rounded-xl border border-border-light p-4">
        <h3 className="text-xs font-semibold text-text uppercase tracking-wide mb-3">
          Imagen de referencia
        </h3>
        {(localRefUrl || referenceImageUrl) ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={localRefUrl || referenceImageUrl!}
              alt="Imagen de referencia"
              className="max-h-40 rounded-lg border border-border-light object-contain bg-cream"
            />
            <label className="text-xs text-text-muted hover:text-terracota cursor-pointer transition-colors">
              Cambiar
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleUploadReference(f)
                }}
              />
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-terracota/30 cursor-pointer transition-colors w-fit">
            <Upload className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-light">
              {isUploadingRef ? 'Subiendo...' : 'Subir imagen de referencia del personaje'}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={isUploadingRef}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleUploadReference(f)
              }}
            />
          </label>
        )}
      </div>

      {/* Image viewer */}
      {pages.length > 0 ? (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          {/* Main image */}
          <div className="relative aspect-square max-h-[600px] bg-cream flex items-center justify-center">
            {page?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.imageUrl}
                alt={`Escena ${page.sceneNumber}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-text-muted/20" />
            )}

            {/* Navigation arrows */}
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-text" />
              </button>
            )}
            {currentPage < pages.length - 1 && (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-text" />
              </button>
            )}

            {/* Page counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              Escena {page?.sceneNumber || '?'} — {currentPage + 1}/{pages.length}
            </div>
          </div>

          {/* Narrative text */}
          {page?.narrativeText && (
            <div className="px-4 py-3 border-t border-border-light">
              <p className="text-sm text-text italic">&ldquo;{page.narrativeText}&rdquo;</p>
            </div>
          )}

          {/* Thumbnail strip */}
          <div className="flex gap-1 p-2 border-t border-border-light overflow-x-auto">
            {pages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setCurrentPage(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === currentPage ? 'border-terracota' : 'border-transparent hover:border-terracota/30'
                }`}
              >
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={`Escena ${p.sceneNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-cream flex items-center justify-center">
                    <span className="text-[10px] text-text-muted">{p.sceneNumber}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light p-8 text-center">
          <ImageIcon className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted">No hay páginas generadas para esta variante.</p>
        </div>
      )}
    </div>
  )
}

function StatusLabel({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pendiente', className: 'text-text-muted bg-cream' },
    generating: { label: 'Generando...', className: 'text-blue bg-blue/10' },
    pending_review: { label: 'Por revisar', className: 'text-terracota bg-terracota/10' },
    approved: { label: 'Aprobada', className: 'text-sage bg-sage/10' },
    rejected: { label: 'Rechazada', className: 'text-terracota-dark bg-terracota/10' },
    failed: { label: 'Error', className: 'text-terracota-dark bg-terracota/10' },
  }
  const c = config[status] || config['pending']

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${c.className}`}>
      {c.label}
    </span>
  )
}
