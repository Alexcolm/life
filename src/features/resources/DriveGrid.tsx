import { FileText, Link2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Resource } from '../../types/resource'
import { ResourcePreviewModal } from './ResourcePreviewModal'

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
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {resources.map((r) => (
          <div
            key={r.id}
            className="group relative flex flex-col items-center gap-1 rounded-lg border border-app-border bg-app-surface p-2"
          >
            <button
              onClick={() => handleOpen(r)}
              className="flex h-16 w-full items-center justify-center overflow-hidden rounded-md bg-app-surface-2"
            >
              {r.type === 'image' && r.dataUrl ? (
                <img src={r.dataUrl} alt="" className="h-full w-full object-cover" />
              ) : r.type === 'pdf' ? (
                <FileText size={26} className="text-gray-400" />
              ) : (
                <Link2 size={26} className="text-gray-400" />
              )}
            </button>
            <span className="w-full truncate text-center text-[11px] text-gray-300" title={r.label}>
              {r.label}
            </span>
            <button
              onClick={() => onRemove(r)}
              className="absolute top-1 right-1 rounded-full bg-app-bg/80 p-0.5 text-gray-400 opacity-0 hover:text-red-400 group-hover:opacity-100"
              aria-label="Eliminar archivo"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <ResourcePreviewModal resource={preview} onClose={() => setPreview(null)} />
    </>
  )
}
