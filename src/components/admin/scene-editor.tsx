'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createScene,
  updateScene,
  deleteScene,
  reorderScenes,
} from '@/app/admin/libros/[bookId]/editor/actions'
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react'

interface Scene {
  id: string
  scene_number: number
  text_narrative: Record<string, string> | string | null
  visual_description: string | null
  text_position: string | null
  camera_angle: string | null
  lighting: string | null
  emotion: string | null
  character_position: string | null
}

/** Extract text from text_narrative which can be a JSON object {es: "..."} or a plain string */
function getNarrative(tn: Record<string, string> | string | null): string {
  if (!tn) return ''
  if (typeof tn === 'string') return tn
  return tn.es || Object.values(tn)[0] || ''
}

interface SceneEditorProps {
  bookId: string
  scenes: Scene[]
  stylePrompt: string
}

export function SceneEditor({ bookId, scenes: initialScenes, stylePrompt }: SceneEditorProps) {
  const [scenes, setScenes] = useState(initialScenes)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')

  // New scene form state
  const [newNarrative, setNewNarrative] = useState('')
  const [newPrompt, setNewPrompt] = useState('')
  const [newPosition, setNewPosition] = useState<'top' | 'bottom' | 'overlay'>('bottom')

  // Edit scene form state
  const [editNarrative, setEditNarrative] = useState('')
  const [editPrompt, setEditPrompt] = useState('')
  const [editPosition, setEditPosition] = useState<'top' | 'bottom' | 'overlay'>('bottom')

  const handleAddScene = () => {
    setError('')
    const sceneNumber = scenes.length + 1

    startTransition(async () => {
      const result = await createScene(bookId, {
        scene_number: sceneNumber,
        text_narrative: newNarrative || undefined,
        visual_description: newPrompt || undefined,
        text_position: newPosition,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        setNewNarrative('')
        setNewPrompt('')
        setShowNew(false)
        // Refresh will be handled by revalidation
        window.location.reload()
      }
    })
  }

  const handleUpdateScene = (sceneId: string) => {
    setError('')
    startTransition(async () => {
      const result = await updateScene(sceneId, bookId, {
        text_narrative: editNarrative || undefined,
        visual_description: editPrompt || undefined,
        text_position: editPosition,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        setEditingId(null)
        window.location.reload()
      }
    })
  }

  const handleDeleteScene = (sceneId: string) => {
    if (!confirm('¿Eliminar esta escena?')) return
    setError('')
    startTransition(async () => {
      const result = await deleteScene(sceneId, bookId)
      if (result?.error) {
        setError(result.error)
      } else {
        window.location.reload()
      }
    })
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newScenes = [...scenes]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newScenes.length) return

    ;[newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]]
    setScenes(newScenes)

    startTransition(async () => {
      await reorderScenes(bookId, newScenes.map(s => s.id))
    })
  }

  const startEditing = (scene: Scene) => {
    setEditingId(scene.id)
    setEditNarrative(getNarrative(scene.text_narrative))
    setEditPrompt(scene.visual_description || '')
    setEditPosition((scene.text_position as 'top' | 'bottom' | 'overlay') || 'bottom')
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-terracota/10 border border-terracota/20 rounded-lg px-4 py-3 text-sm text-terracota-dark">
          {error}
        </div>
      )}

      {/* Style prompt reference */}
      <div className="bg-cream rounded-xl border border-border-light p-4">
        <p className="text-xs font-medium text-text-muted mb-1">Style prompt del libro</p>
        <p className="text-xs text-text font-mono leading-relaxed">{stylePrompt}</p>
      </div>

      {/* Scene list */}
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light bg-cream/30">
            <GripVertical className="w-4 h-4 text-text-muted/50" />
            <span className="text-sm font-bold text-terracota w-8">
              #{scene.scene_number}
            </span>
            <span className="text-sm text-text flex-1 truncate">
              {getNarrative(scene.text_narrative) || '(sin texto)'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0 || isPending}
                className="p-1 rounded hover:bg-cream disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4 text-text-muted" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === scenes.length - 1 || isPending}
                className="p-1 rounded hover:bg-cream disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>
              <button
                onClick={() => editingId === scene.id ? setEditingId(null) : startEditing(scene)}
                className="px-2 py-1 text-xs text-text-muted hover:text-terracota transition-colors"
              >
                {editingId === scene.id ? 'Cerrar' : 'Editar'}
              </button>
              <button
                onClick={() => handleDeleteScene(scene.id)}
                disabled={isPending}
                className="p-1 rounded hover:bg-terracota/10 text-text-muted hover:text-terracota-dark transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded edit view */}
          {editingId === scene.id && (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Texto narrativo</label>
                <textarea
                  value={editNarrative}
                  onChange={(e) => setEditNarrative(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
                  placeholder="Texto que aparece en la página..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  <ImageIcon className="w-3 h-3 inline mr-1" />
                  Image prompt
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
                  placeholder="Prompt de imagen para esta escena..."
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-text mb-1">Posición texto</label>
                  <select
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value as 'top' | 'bottom' | 'overlay')}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus-visible:border-terracota"
                  >
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="overlay">Overlay</option>
                  </select>
                </div>
                <div className="flex-1" />
                <Button
                  size="sm"
                  onClick={() => handleUpdateScene(scene.id)}
                  disabled={isPending}
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new scene */}
      {showNew ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-terracota/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text">
            Nueva escena #{scenes.length + 1}
          </h3>
          <div>
            <label className="block text-xs font-medium text-text mb-1">Texto narrativo</label>
            <textarea
              value={newNarrative}
              onChange={(e) => setNewNarrative(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
              placeholder="Texto que aparece en la página..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text mb-1">Image prompt</label>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text font-mono resize-none outline-none focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/15"
              placeholder="Prompt de imagen para esta escena..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1">Posición texto</label>
              <select
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value as 'top' | 'bottom' | 'overlay')}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus-visible:border-terracota"
              >
                <option value="top">Arriba</option>
                <option value="bottom">Abajo</option>
                <option value="overlay">Overlay</option>
              </select>
            </div>
            <div className="flex-1" />
            <Button variant="secondary" size="sm" onClick={() => setShowNew(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAddScene} disabled={isPending}>
              <Plus className="w-3.5 h-3.5" />
              Agregar
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-terracota/30 text-text-muted hover:text-terracota transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar escena
        </button>
      )}
    </div>
  )
}
