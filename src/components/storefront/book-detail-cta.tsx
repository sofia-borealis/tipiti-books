'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfiguratorStore } from '@/stores/configurator-store'

interface BookDetailCTAProps {
  bookId: string
  bookSlug: string
  bookTitle: string
}

export function BookDetailCTA({ bookId, bookSlug, bookTitle }: BookDetailCTAProps) {
  const setBook = useConfiguratorStore((s) => s.setBook)
  const reset = useConfiguratorStore((s) => s.reset)

  const handleClick = () => {
    reset()
    setBook(bookId, bookSlug, bookTitle)
  }

  return (
    <Button asChild size="lg" className="w-full" onClick={handleClick}>
      <Link href="/wizard/paso-1">
        <Sparkles className="w-5 h-5" />
        Personalizar este libro
      </Link>
    </Button>
  )
}
