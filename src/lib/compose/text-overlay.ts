/**
 * Text overlay on images using Sharp
 *
 * Overlays the child's name and dedication text onto pre-generated
 * watercolor illustrations. Text is rendered as SVG and composited.
 */

import sharp from 'sharp'

interface TextOverlayParams {
  imageBuffer: Buffer
  text: string
  position: { x: number; y: number }
  fontSize?: number
  fontFamily?: string
  color?: string
  maxWidth?: number
}

export async function overlayText(params: TextOverlayParams): Promise<Buffer> {
  const {
    imageBuffer,
    text,
    position,
    fontSize = 32,
    fontFamily = 'sans-serif',
    color = '#4A3F35',
    maxWidth = 400,
  } = params

  // Get image dimensions
  const metadata = await sharp(imageBuffer).metadata()
  const width = metadata.width || 1000
  const height = metadata.height || 800

  // Create SVG text overlay
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const svgText = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="${position.x}"
        y="${position.y}"
        font-family="${fontFamily}"
        font-size="${fontSize}"
        fill="${color}"
        text-anchor="start"
      >
        ${escapedText}
      </text>
    </svg>
  `

  const result = await sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
      },
    ])
    .toBuffer()

  return result
}
