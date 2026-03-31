'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/catalogo', label: 'Nuestros libros' },
  { href: '/#nuestra-historia', label: 'Nuestra historia' },
  { href: '/#preguntas', label: 'Preguntas' },
]

export function StorefrontHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const slideOutRef = useRef<HTMLDivElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setMobileOpen(false)
    openButtonRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileOpen, close])

  // Focus trap
  useEffect(() => {
    if (!mobileOpen || !slideOutRef.current) return
    const panel = slideOutRef.current
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length) focusable[0].focus()

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rule-light">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center px-5 md:px-10 py-4">
        {/* Logo centrado */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-tipiti.svg"
            alt="Tipiti Books"
            width={180}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft hover:text-berry transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={openButtonRef}
          onClick={() => setMobileOpen(true)}
          className="md:hidden absolute right-5 top-4 p-2.5 cursor-pointer"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Menu className="w-6 h-6 text-ink" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile slide-out */}
      <div
        ref={slideOutRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-screen w-[min(280px,85vw)] bg-white border-l border-rule-light p-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={close}
            className="p-2.5 -mr-2 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6 text-ink" strokeWidth={1.5} />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="text-lg font-medium text-ink hover:text-berry transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
