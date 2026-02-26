'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { triggerGeneration } from '@/app/admin/generacion/actions'
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react'

interface Book {
  id: string
  title: string
  slug: string
  totalScenes: number
  sceneCount: number
  engine: string
}

interface Variant {
  id: string
  gender: string
  skin_tone: string
  hair_color: string
  hair_type: string
  has_glasses: boolean
  status: string
  variant_pages: { count: number }[]
}

interface GenerationDashboardProps {
  books: Book[]
  variants: Variant[]
  selectedBookId: string | null
}

export function GenerationDashboard({
  books,
  variants,
  selectedBookId,
}: GenerationDashboardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const selectedBook = books.find(b => b.id === selectedBookId)

  // Status counts
  const statusCounts = variants.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleGenerate = () => {
    if (!selectedBookId) return
    setError('')
    startTransition(async () => {
      const result = await triggerGeneration(selectedBookId)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowConfirm(false)
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
          {/* Progress overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatusCard
              label="Total"
              count={variants.length}
              icon={<Sparkles className="w-4 h-4" />}
              color="text-text"
            />
            <StatusCard
              label="Pendientes"
              count={statusCounts['pending'] || 0}
              icon={<Clock className="w-4 h-4" />}
              color="text-text-muted"
            />
            <StatusCard
              label="Generando"
              count={statusCounts['generating'] || 0}
              icon={<Loader2 className="w-4 h-4 animate-spin" />}
              color="text-blue"
            />
            <StatusCard
              label="Por revisar"
              count={statusCounts['pending_review'] || 0}
              icon={<AlertCircle className="w-4 h-4" />}
              color="text-terracota"
            />
            <StatusCard
              label="Aprobadas"
              count={statusCounts['approved'] || 0}
              icon={<CheckCircle className="w-4 h-4" />}
              color="text-sage"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!showConfirm ? (
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={isPending || selectedBook.sceneCount === 0}
              >
                <Sparkles className="w-4 h-4" />
                Generar todas las variantes
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-terracota/5 border border-terracota/20 rounded-lg px-4 py-3">
                <p className="text-sm text-text">
                  ¿Generar ~{estimateVariantCount()} variantes × {selectedBook.sceneCount} escenas?
                  Esto puede tomar varias horas.
                </p>
                <Button size="sm" onClick={handleGenerate} disabled={isPending}>
                  {isPending ? 'Iniciando...' : 'Confirmar'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              </div>
            )}
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

          {/* Variants table */}
          {variants.length > 0 && (
            <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light bg-cream/50">
                    <th className="text-left text-xs font-medium text-text-muted px-4 py-3">Variante</th>
                    <th className="text-center text-xs font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Páginas</th>
                    <th className="text-center text-xs font-medium text-text-muted px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(variant => {
                    const pageCount = (variant.variant_pages as unknown as { count: number }[])?.[0]?.count ?? 0
                    return (
                      <tr key={variant.id} className="border-b border-border-light last:border-0 hover:bg-cream/30">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-text">
                              {variant.gender === 'girl' ? '👧' : '👦'}
                            </span>
                            <Badge>{variant.skin_tone}</Badge>
                            <Badge>{variant.hair_color}</Badge>
                            <Badge>{variant.hair_type}</Badge>
                            {variant.has_glasses && <Badge>lentes</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-center hidden sm:table-cell">
                          <span className="text-sm text-text">
                            {pageCount}/{selectedBook.sceneCount}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <VariantStatus status={variant.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {variants.length === 0 && (
            <div className="bg-white rounded-xl border border-border-light p-8 text-center">
              <Sparkles className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-text-muted">
                No hay variantes generadas aún. Haz clic en &quot;Generar todas las variantes&quot; para comenzar.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatusCard({
  label,
  count,
  icon,
  color,
}: {
  label: string
  count: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-border-light p-4">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text mt-1">{count}</p>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-cream text-text-muted rounded">
      {children}
    </span>
  )
}

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
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${c.className}`}>
      {c.label}
    </span>
  )
}

function estimateVariantCount(): number {
  // 2 genders × (4+4+1 hair colors) × 2 hair types × 2 glasses = 2 × 9 × 2 × 2 = 72
  // But with 3 skin tones: light(4) + medium(4) + dark(1) = 9 combos per gender/hairtype/glasses
  return 2 * 9 * 2 * 2
}
