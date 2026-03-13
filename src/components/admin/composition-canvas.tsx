'use client'

import { useRef, useState, useCallback } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface CompositionCanvasProps {
  backgroundUrl: string | null
  characterUrl: string | null
  characterX: number
  characterY: number
  characterScale: number
  characterFlip: boolean
  composedUrl: string | null
  showComposed: boolean
  aspectRatio: string // e.g. "11/9" or "22/9"
  onPositionChange: (x: number, y: number) => void
}

export function CompositionCanvas({
  backgroundUrl,
  characterUrl,
  characterX,
  characterY,
  characterScale,
  characterFlip,
  composedUrl,
  showComposed,
  aspectRatio,
  onPositionChange,
}: CompositionCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, startCharX: 0, startCharY: 0 })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startCharX: characterX,
        startCharY: characterY,
      }
    },
    [characterX, characterY]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const deltaXPercent =
        ((e.clientX - dragStartRef.current.x) / rect.width) * 100
      const deltaYPercent =
        ((e.clientY - dragStartRef.current.y) / rect.height) * 100
      const newX = Math.max(
        0,
        Math.min(100, dragStartRef.current.startCharX + deltaXPercent)
      )
      const newY = Math.max(
        0,
        Math.min(100, dragStartRef.current.startCharY + deltaYPercent)
      )
      onPositionChange(newX, newY)
    },
    [isDragging, onPositionChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const canvasStyle = { aspectRatio }

  // Show composed result
  if (showComposed && composedUrl) {
    return (
      <div className="flex items-center justify-center w-full">
        <div
          className="max-w-full max-h-[78vh] relative overflow-hidden bg-cream rounded-xl border border-border-light"
          style={canvasStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={composedUrl}
            alt="Página compuesta"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    )
  }

  // Show layer editor
  return (
    <div className="flex items-center justify-center w-full">
      <div
        ref={canvasRef}
        className="max-w-full max-h-[78vh] relative overflow-hidden bg-cream rounded-xl border border-border-light select-none"
        style={canvasStyle}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background layer */}
        {backgroundUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundUrl}
            alt="Fondo"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted/40">
            <ImageIcon className="w-16 h-16 mb-2" />
            <p className="text-sm">Sube un fondo para comenzar</p>
          </div>
        )}

        {/* Character layer */}
        {characterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={characterUrl}
            alt="Personaje"
            draggable={false}
            onPointerDown={handlePointerDown}
            className={`absolute origin-center transition-shadow ${
              isDragging
                ? 'cursor-grabbing ring-2 ring-terracota/50'
                : 'cursor-grab hover:ring-2 hover:ring-terracota/30'
            }`}
            style={{
              left: `${characterX}%`,
              top: `${characterY}%`,
              height: `${characterScale * 100}%`,
              width: 'auto',
              transform: `translate(-50%, -50%) ${characterFlip ? 'scaleX(-1)' : ''}`,
            }}
          />
        )}

        {/* Crosshair guides when dragging */}
        {isDragging && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-terracota/30 pointer-events-none"
              style={{ left: `${characterX}%` }}
            />
            <div
              className="absolute left-0 right-0 h-px bg-terracota/30 pointer-events-none"
              style={{ top: `${characterY}%` }}
            />
          </>
        )}

        {/* Position indicator */}
        {characterUrl && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
            {Math.round(characterX)}%, {Math.round(characterY)}% · {Math.round(characterScale * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}
