'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createDiscountCode,
  deleteDiscountCode,
  toggleDiscountActive,
  type DiscountFormData,
} from '@/app/admin/descuentos/actions'
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface DiscountCode {
  id: string
  code: string
  discount_type: string
  discount_value: number
  max_uses: number | null
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

interface DiscountManagerProps {
  codes: DiscountCode[]
}

export function DiscountManager({ codes }: DiscountManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // Form state
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('20')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleCreate = () => {
    setError('')
    const data: DiscountFormData = {
      code: code.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      discount_type: discountType,
      discount_value: parseFloat(discountValue) || 0,
      max_uses: maxUses ? parseInt(maxUses) : undefined,
      expires_at: expiresAt || undefined,
      is_active: true,
    }

    startTransition(async () => {
      const result = await createDiscountCode(data)
      if (result?.error) {
        setError(result.error)
      } else {
        setCode('')
        setDiscountValue('20')
        setMaxUses('')
        setExpiresAt('')
        setShowForm(false)
        window.location.reload()
      }
    })
  }

  const handleDelete = (codeId: string, codeName: string) => {
    if (!confirm(`¿Eliminar el código ${codeName}?`)) return
    startTransition(async () => {
      await deleteDiscountCode(codeId)
      window.location.reload()
    })
  }

  const handleToggle = (codeId: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleDiscountActive(codeId, isActive)
      window.location.reload()
    })
  }

  return (
    <div className="space-y-4">
      {/* Create button / form */}
      {showForm ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-terracota/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text">Nuevo código de descuento</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1">Código *</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="TIPITI20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">Tipo *</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full rounded-xl border-[1.5px] border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus-visible:border-terracota"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">
                Valor {discountType === 'percentage' ? '(%)' : '(CLP)'} *
              </label>
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">Usos máximos</label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Ilimitado"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">Expira</label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-terracota-dark">{error}</p>}

          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isPending || !code}>
              <Plus className="w-4 h-4" />
              {isPending ? 'Creando...' : 'Crear código'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Nuevo código
        </Button>
      )}

      {/* Codes table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light bg-cream/50">
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3">Código</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3">Descuento</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Usos</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3 hidden md:table-cell">Expira</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3">Estado</th>
              <th className="text-right text-xs font-medium text-text-muted px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.id} className="border-b border-border-light last:border-0 hover:bg-cream/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-terracota shrink-0" />
                    <code className="text-sm font-bold text-text">{c.code}</code>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-text">
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}%`
                      : `$${c.discount_value.toLocaleString('es-CL')}`}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className="text-sm text-text">
                    {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span className="text-xs text-text-muted">
                    {c.expires_at
                      ? new Date(c.expires_at).toLocaleDateString('es-CL')
                      : 'Sin expiración'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(c.id, c.is_active)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1"
                  >
                    {c.is_active ? (
                      <ToggleRight className="w-5 h-5 text-sage" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-text-muted" />
                    )}
                    <span className={`text-xs font-medium ${c.is_active ? 'text-sage' : 'text-text-muted'}`}>
                      {c.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg hover:bg-terracota/10 text-text-muted hover:text-terracota-dark transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {codes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Tag className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-text-muted">No hay códigos de descuento</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
