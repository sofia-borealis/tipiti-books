'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export function ShareButton({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-sm text-text-light hover:text-terracota transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-sage" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Compartir
        </>
      )}
    </button>
  )
}
