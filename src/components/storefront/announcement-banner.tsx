'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const STORAGE_KEY = 'tipiti-banner-dismissed'

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-golden text-ink overflow-hidden"
        >
          <div className="relative flex items-center justify-center px-10 py-2.5 font-display text-sm font-medium">
            <p>
              Lanzamiento — Primeros 50 compradores:{' '}
              <strong>20% OFF</strong> con código{' '}
              <code className="bg-golden-deep/40 px-1.5 py-0.5 rounded font-mono text-xs">
                TIPITI20
              </code>
            </p>
            <button
              onClick={dismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 hover:bg-golden-deep/30 rounded transition-colors cursor-pointer"
              aria-label="Cerrar banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
