/**
 * PDF Builder — assembles the final print-ready PDF
 *
 * 1. Downloads 11 pre-generated page images
 * 2. Overlays child name text on each page (Sharp)
 * 3. Assembles into a single PDF (pdf-lib)
 * 4. Uploads to Supabase Storage (print-files bucket)
 */

import { PDFDocument } from 'pdf-lib'
import { overlayText } from './text-overlay'

interface BuildPDFParams {
  orderId: string
  childName: string
  dedication?: string
  pageImages: { sceneNumber: number; imageUrl: string; textPosition: { x: number; y: number } }[]
  pageWidthMM: number
  pageHeightMM: number
}

// Convert mm to PDF points (1mm = 2.835pt)
const mmToPt = (mm: number) => mm * 2.835

export async function buildPrintPDF(params: BuildPDFParams): Promise<Buffer> {
  const { childName, dedication, pageImages, pageWidthMM, pageHeightMM } = params

  const pdfDoc = await PDFDocument.create()
  const pageWidth = mmToPt(pageWidthMM)
  const pageHeight = mmToPt(pageHeightMM)

  for (const pageImage of pageImages) {
    // Download image
    const response = await fetch(pageImage.imageUrl)
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Overlay text with child name
    const processedImage = await overlayText({
      imageBuffer,
      text: childName,
      position: pageImage.textPosition,
      fontSize: 28,
      color: '#4A3F35',
    })

    // Embed image in PDF
    const image = await pdfDoc.embedJpg(processedImage).catch(async () => {
      // Fallback to PNG if JPG fails
      return await pdfDoc.embedPng(processedImage)
    })

    const page = pdfDoc.addPage([pageWidth, pageHeight])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    })
  }

  // Add dedication page if exists
  if (dedication) {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    // Dedication is text-only, centered
    page.drawText(dedication, {
      x: pageWidth * 0.15,
      y: pageHeight * 0.5,
      size: 18,
      maxWidth: pageWidth * 0.7,
    })
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
