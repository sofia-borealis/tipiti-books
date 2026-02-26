'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { togglePublish, deleteBook } from '@/app/admin/libros/actions'
import { Eye, EyeOff, Trash2 } from 'lucide-react'

interface BookActionsProps {
  bookId: string
  isPublished: boolean
}

export function BookActions({ bookId, isPublished }: BookActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  const handleTogglePublish = () => {
    startTransition(async () => {
      await togglePublish(bookId, isPublished)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteBook(bookId)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleTogglePublish}
        disabled={isPending}
      >
        {isPublished ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            Despublicar
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            Publicar
          </>
        )}
      </Button>

      {!showDelete ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDelete(true)}
          disabled={isPending}
          className="text-terracota-dark hover:bg-terracota/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-white bg-terracota-dark hover:bg-terracota-dark/90"
          >
            Confirmar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDelete(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}
