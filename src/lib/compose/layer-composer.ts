/**
 * Layer Composition Engine
 *
 * Composes book pages by layering a character PNG (with transparency)
 * over a background image. Uses Sharp for server-side image processing.
 *
 * Output dimensions depend on page format:
 *   Simple (22x18cm): 2598x2126 px at 300 DPI
 *   Spread (44x18cm): 5197x2126 px at 300 DPI
 */

import sharp from 'sharp'

interface LayerCompositionParams {
  backgroundBuffer: Buffer
  characterBuffer: Buffer
  characterX: number       // 0-100 (% of page width)
  characterY: number       // 0-100 (% of page height)
  characterScale: number   // relative to page height
  characterFlip: boolean
  pageWidth: number        // px
  pageHeight: number       // px
}

interface CompositionResult {
  composedBuffer: Buffer
  metadata: {
    characterPixelWidth: number
    characterPixelHeight: number
  }
}

export async function composeLayers({
  backgroundBuffer,
  characterBuffer,
  characterX,
  characterY,
  characterScale,
  characterFlip,
  pageWidth,
  pageHeight,
}: LayerCompositionParams): Promise<CompositionResult> {
  // 1. Resize background to page dimensions
  const background = await sharp(backgroundBuffer)
    .resize(pageWidth, pageHeight, { fit: 'cover' })
    .png()
    .toBuffer()

  // 2. Process character: get dimensions, calculate target size
  const charMeta = await sharp(characterBuffer).metadata()
  const charAspect = (charMeta.width || 1) / (charMeta.height || 1)

  const targetHeight = Math.round(characterScale * pageHeight)
  const targetWidth = Math.round(targetHeight * charAspect)

  // 3. Resize character + optional flip
  let charPipeline = sharp(characterBuffer)
    .resize(targetWidth, targetHeight, { fit: 'inside' })

  if (characterFlip) {
    charPipeline = charPipeline.flop()
  }

  const resizedCharacter = await charPipeline.ensureAlpha().png().toBuffer()

  // 4. Create drop shadow
  // Extract alpha from character, make it a black silhouette at 15% opacity, blur it
  const shadowBuffer = await sharp(resizedCharacter)
    .clone()
    .removeAlpha()
    .composite([{
      input: {
        create: {
          width: targetWidth,
          height: targetHeight,
          channels: 3,
          background: { r: 0, g: 0, b: 0 },
        },
      },
      blend: 'in',
    }])
    .joinChannel(
      // Re-use the alpha from the resized character but reduce to 15% opacity
      await sharp(resizedCharacter)
        .extractChannel(3)
        .linear(0.15, 0)
        .blur(4)
        .toBuffer()
    )
    .png()
    .toBuffer()

  // 5. Calculate pixel positions (center-based)
  const pixelX = Math.round((characterX / 100) * pageWidth - targetWidth / 2)
  const pixelY = Math.round((characterY / 100) * pageHeight - targetHeight / 2)

  // Clamp shadow offset to valid range
  const shadowLeft = Math.max(0, pixelX + 2)
  const shadowTop = Math.max(0, pixelY + 2)
  const charLeft = Math.max(0, pixelX)
  const charTop = Math.max(0, pixelY)

  // 6. Composite all layers
  const composedBuffer = await sharp(background)
    .composite([
      { input: shadowBuffer, left: shadowLeft, top: shadowTop },
      { input: resizedCharacter, left: charLeft, top: charTop },
    ])
    .png()
    .toBuffer()

  return {
    composedBuffer,
    metadata: {
      characterPixelWidth: targetWidth,
      characterPixelHeight: targetHeight,
    },
  }
}
