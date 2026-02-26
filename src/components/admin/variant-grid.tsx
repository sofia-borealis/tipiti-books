'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { bulkUpdateVariants } from '@/app/admin/libros/[bookId]/variantes/actions'
import { CheckCircle, XCircle, Check, Image as ImageIcon } from 'lucide-react'

interface VariantPage {
  id: string
  image_url: string
  scene_id: string
}

interface Variant {
  id: string
  gender: string
  skin_tone: string
  hair_color: string
  hair_type: string
  has_glasses: boolean
  status: string
  variant_pages: VariantPage[]
}

interface VariantGridProps {
  bookId: string
  variants: Variant[]
}

export function VariantGrid({ bookId, variants }: VariantGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<string>('all')
  const [error, setError] = useState('')

  const filtered = filter === 'all'
    ? variants
    : variants.filter(v => v.status === filter)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(v => v.id)))
    }
  }

  const handleBulkAction = (status: 'approved' | 'rejected') => {
    if (selected.size === 0) return
    setError('')
    startTransition(async () => {
      const result = await bulkUpdateVariants(Array.from(selected), status, bookId)
      if (result?.error) {
        setError(result.error)
      } else {
        setSelected(new Set())
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-border-light p-3">
        {/* Filters */}
        <div className="flex gap-1">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'pending_review', label: 'Por revisar' },
            { key: 'approved', label: 'Aprobadas' },
            { key: 'rejected', label: 'Rechazadas' },
            { key: 'pending', label: 'Pendientes' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === f.key
                  ? 'bg-terracota text-white'
                  : 'bg-cream text-text-muted hover:text-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{selected.size} seleccionadas</span>
            <Button
              size="sm"
              onClick={() => handleBulkAction('approved')}
              disabled={isPending}
              className="bg-sage hover:bg-sage/90"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkAction('rejected')}
              disabled={isPending}
            >
              <XCircle className="w-3.5 h-3.5" />
              Rechazar
            </Button>
          </div>
        )}

        <button
          onClick={selectAll}
          className="text-xs text-text-muted hover:text-terracota transition-colors"
        >
          {selected.size === filtered.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
      </div>

      {error && (
        <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-4 py-3 text-sm text-terracota-dark">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map(variant => {
          const isSelected = selected.has(variant.id)
          const thumbnail = variant.variant_pages[0]?.image_url

          return (
            <div
              key={variant.id}
              className={`relative bg-white rounded-xl border-2 overflow-hidden transition-colors ${
                isSelected
                  ? 'border-terracota shadow-md'
                  : 'border-border-light hover:border-terracota/30'
              }`}
            >
              {/* Select checkbox */}
              <button
                onClick={() => toggleSelect(variant.id)}
                className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-terracota border-terracota text-white'
                    : 'bg-white/80 border-border backdrop-blur-sm'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </button>

              {/* Thumbnail */}
              <Link href={`/admin/libros/${bookId}/variantes/${variant.id}`}>
                <div className="aspect-square bg-cream relative">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={`${variant.gender} ${variant.skin_tone} ${variant.hair_color}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-text-muted/20" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <VariantStatusBadge status={variant.status} />
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="p-2">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs">
                    {variant.gender === 'girl' ? '👧' : '👦'}
                  </span>
                  <span className="text-[10px] px-1 bg-cream rounded text-text-muted">{variant.skin_tone}</span>
                  <span className="text-[10px] px-1 bg-cream rounded text-text-muted">{variant.hair_color}</span>
                  <span className="text-[10px] px-1 bg-cream rounded text-text-muted">{variant.hair_type}</span>
                  {variant.has_glasses && (
                    <span className="text-[10px] px-1 bg-cream rounded text-text-muted">👓</span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  {variant.variant_pages.length} páginas
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-border-light p-8 text-center">
          <p className="text-sm text-text-muted">
            {variants.length === 0
              ? 'No hay variantes generadas. Ve a Generación para comenzar.'
              : 'No hay variantes con este filtro.'}
          </p>
        </div>
      )}
    </div>
  )
}

function VariantStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: '⏳', className: 'bg-cream' },
    generating: { label: '⚡', className: 'bg-blue/10' },
    pending_review: { label: '👁️', className: 'bg-terracota/10' },
    approved: { label: '✓', className: 'bg-sage/20 text-sage' },
    rejected: { label: '✗', className: 'bg-terracota/20 text-terracota-dark' },
    failed: { label: '!', className: 'bg-terracota/20 text-terracota-dark' },
  }

  const c = config[status] || config['pending']

  return (
    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${c.className}`}>
      {c.label}
    </span>
  )
}
