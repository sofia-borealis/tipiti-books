'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/admin/actions'
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Tag,
  Sparkles,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  userName: string
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/libros', label: 'Libros', icon: BookOpen },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/descuentos', label: 'Descuentos', icon: Tag },
  { href: '/admin/generacion', label: 'Generación', icon: Sparkles },
  { href: '/admin/suscriptores', label: 'Suscriptores', icon: Users },
]

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white border border-border shadow-sm"
      >
        <Menu className="w-5 h-5 text-text" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-border flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border-light flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-terracota font-display">
              Tipiti Books
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Admin</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded hover:bg-cream"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-terracota/10 text-terracota border-l-4 border-terracota -ml-1 pl-3'
                    : 'text-text-light hover:bg-cream hover:text-text'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-light">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-light">{userName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-terracota transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Salir
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
