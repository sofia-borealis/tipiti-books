'use client'

import { useState, useTransition } from 'react'
import { Download, UserCheck, UserX, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toggleSubscriber, exportSubscribersCSV } from '@/app/admin/suscriptores/actions'

interface Subscriber {
  id: string
  email: string
  source: string
  is_active: boolean
  subscribed_at: string
}

export function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isPending, startTransition] = useTransition()

  const filtered = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && s.is_active) ||
      (filter === 'inactive' && !s.is_active)
    return matchesSearch && matchesFilter
  })

  const handleToggle = (id: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleSubscriber(id, isActive)
    })
  }

  const handleExport = () => {
    startTransition(async () => {
      const result = await exportSubscribersCSV()
      if (result.csv) {
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const date = new Date().toISOString().split('T')[0]
        a.href = url
        a.download = `suscriptores-${date}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Buscar por email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="h-10 rounded-xl border-[1.5px] border-border bg-white px-3 text-sm text-text"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        <Button variant="secondary" size="sm" onClick={handleExport} disabled={isPending}>
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Count */}
      <p className="text-sm text-text-muted">
        {filtered.length} suscriptor{filtered.length !== 1 ? 'es' : ''}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left py-3 px-4 font-medium text-text-light">Email</th>
                <th className="text-left py-3 px-4 font-medium text-text-light">Fuente</th>
                <th className="text-left py-3 px-4 font-medium text-text-light">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-text-light">Estado</th>
                <th className="text-right py-3 px-4 font-medium text-text-light">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    No se encontraron suscriptores.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border-light last:border-0 hover:bg-cream/50 transition-colors">
                    <td className="py-3 px-4 text-text font-medium">{s.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-blue/15 text-blue-dark">
                        {s.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-light">
                      {new Date(s.subscribed_at).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {s.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-sage/15 text-sage-dark">
                          <UserCheck className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-rose/15 text-rose-dark">
                          <UserX className="w-3 h-3" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggle(s.id, s.is_active)}
                        disabled={isPending}
                        className="text-xs text-text-muted hover:text-terracota transition-colors disabled:opacity-50"
                      >
                        {s.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
