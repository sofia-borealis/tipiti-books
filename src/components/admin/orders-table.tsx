'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { exportOrdersCSV } from '@/app/admin/pedidos/actions'
import { Search, Download, Package, Eye } from 'lucide-react'

interface Order {
  id: string
  status: string
  buyer_name: string
  buyer_email: string
  child_name: string | null
  total_amount: number | null
  shipping_city: string | null
  shipping_region: string | null
  tracking_number: string | null
  created_at: string
}

interface OrdersTableProps {
  orders: Order[]
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'text-text-muted bg-cream' },
  paid: { label: 'Pagado', className: 'text-blue bg-blue/10' },
  processing: { label: 'En proceso', className: 'text-terracota bg-terracota/10' },
  shipped: { label: 'Enviado', className: 'text-sage bg-sage/10' },
  delivered: { label: 'Entregado', className: 'text-sage bg-sage/20' },
  cancelled: { label: 'Cancelado', className: 'text-terracota-dark bg-terracota/10' },
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isPending, startTransition] = useTransition()

  const filtered = orders.filter(o => {
    const matchesSearch = search === '' ||
      o.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.child_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    startTransition(async () => {
      const result = await exportOrdersCSV()
      if (result.csv) {
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `pedidos-tipiti-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const formatCLP = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o ID..."
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border-[1.5px] border-border bg-white px-3 py-2.5 text-sm text-text outline-none focus-visible:border-terracota"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <Button variant="secondary" onClick={handleExport} disabled={isPending}>
          <Download className="w-4 h-4" />
          CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light bg-cream/50">
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3">Pedido</th>
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3 hidden md:table-cell">Comprador</th>
              <th className="text-left text-xs font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Niño/a</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3">Estado</th>
              <th className="text-right text-xs font-medium text-text-muted px-4 py-3">Total</th>
              <th className="text-center text-xs font-medium text-text-muted px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const s = STATUS_LABELS[order.status] || STATUS_LABELS['pending']
              return (
                <tr key={order.id} className="border-b border-border-light last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-terracota shrink-0" />
                      <div>
                        <p className="text-xs font-mono text-text-muted">
                          {order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(order.created_at).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-text">{order.buyer_name}</p>
                    <p className="text-xs text-text-muted">{order.buyer_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text">{order.child_name || '-'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${s.className}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-text">
                      {formatCLP(order.total_amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="p-1.5 rounded-lg hover:bg-cream transition-colors inline-block"
                    >
                      <Eye className="w-4 h-4 text-text-muted hover:text-terracota" />
                    </Link>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Package className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-text-muted">
                    {orders.length === 0 ? 'No hay pedidos aún' : 'No hay resultados para esta búsqueda'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
