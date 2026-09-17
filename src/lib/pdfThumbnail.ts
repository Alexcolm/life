/** Renderiza la primera página de un PDF como imagen. Carga pdf.js recién cuando se necesita. */
export async function renderPdfThumbnail(blob: Blob, maxWidth = 240): Promise<string> {
  const [pdfjsLib, workerUrl] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((m) => m.default),
  ])
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

  const arrayBuffer = await blob.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)

  const baseViewport = page.getViewport({ scale: 1 })
  const scale = maxWidth / baseViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo generar la miniatura')

  await page.render({ canvasContext: ctx, viewport, canvas }).promise
  return canvas.toDataURL('image/jpeg', 0.75)
}
