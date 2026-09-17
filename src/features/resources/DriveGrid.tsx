import { FileText, Link2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLocalFile } from '../../lib/localFiles'
import { renderPdfThumbnail } from '../../lib/pdfThumbnail'
import type { Resource } from '../../types/resource'
import { ResourcePreviewModal } from './ResourcePreviewModal'

function PdfThumb({ resource }: { resource: Resource }) {
  const [thumb, setThumb] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getLocalFile(resource.id).then(async (blob) => {
      if (!blob) return
      try {
        const dataUrl = await renderPdfThumbnail(blob)
        if (!cancelled) setThumb(dataUrl)
      } catch {
        // si falla el render, se queda con el ícono genérico
      }
    })
    return () => {
      cancelled = true
    }
  }, [resource.id])

  if (thumb) return <img src={thumb} alt="" className="h-full w-full object-cover" />
  return <FileText size={40} className="text-gray-400" />
}

interface DriveGridProps {
  resources: Resource[]
  onRemove: (resource: Resource) => void
}

export function DriveGrid({ resources, onRemove }: DriveGridProps) {
  const [preview, setPreview] = useState<Resource | null>(null)

  if (resources.length === 0) {
    return <p className="text-sm text-gray-600">No hay archivos acá todavía.</p>
  }

  function handleOpen(r: Resource) {
    if (r.type === 'link' && r.url) {
      window.open(r.url, '_blank', 'noopener,noreferrer')
    } else {
      setPreview(r)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {resources.map((r) => (
          <div
            key={r.id}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface"
          >
            <button
              onClick={() => handleOpen(r)}
              className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-app-surface-2"
            >
              {r.type === 'image' && r.dataUrl ? (
                <img src={r.dataUrl} alt="" className="h-full w-full object-cover" />
              ) : r.type === 'pdf' ? (
                <PdfThumb resource={r} />
              ) : (
                <Link2 size={40} className="text-gray-400" />
              )}
            </button>
            <span className="truncate p-2 text-center text-xs text-gray-300" title={r.label}>
              {r.label}
            </span>
            <button
              onClick={() => onRemove(r)}
              className="absolute top-1.5 right-1.5 rounded-full bg-app-bg/80 p-1 text-gray-400 opacity-0 hover:text-red-400 group-hover:opacity-100"
              aria-label="Eliminar archivo"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <ResourcePreviewModal resource={preview} onClose={() => setPreview(null)} />
    </>
  )
}
