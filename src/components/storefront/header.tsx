'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/#nuestra-historia', label: 'Nuestra historia' },
]

export function StorefrontHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-[80px] bg-cream/90 backdrop-blur-md border-b border-border-light">
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-5 md:px-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-text font-display">
          Tipiti Books
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-text hover:text-terracota transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            className="px-7 py-3 rounded-full bg-terracota text-cream text-base font-medium hover:bg-terracota-dark hover:shadow-[0_4px_16px_rgba(196,125,90,0.3)] hover:-translate-y-0.5 transition-all"
          >
            Crea tu libro
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 -mr-2"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6 text-text" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[280px] bg-cream border-l border-border-light p-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 -mr-2"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6 text-text" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-text hover:text-terracota transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            onClick={() => setMobileOpen(false)}
            className="mt-4 w-full text-center px-7 py-3.5 rounded-full bg-terracota text-cream text-base font-medium hover:bg-terracota-dark transition-colors"
          >
            Crea tu libro
          </Link>
        </nav>
      </div>
    </header>
  )
}
