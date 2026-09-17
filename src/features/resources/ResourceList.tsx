import { FileText, Link2 } from 'lucide-react'
import { useState } from 'react'
import type { Resource } from '../../types/resource'
import { ResourcePreviewModal } from './ResourcePreviewModal'

interface ResourceListProps {
  resources: Resource[]
  onRemove: (resource: Resource) => void
}

export function ResourceList({ resources, onRemove }: ResourceListProps) {
  const [preview, setPreview] = useState<Resource | null>(null)

  if (resources.length === 0) return null

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {resources.map((r) => (
          <div
            key={r.id}
            className="group flex items-center gap-1 rounded-full bg-app-surface-2 py-1 pr-2 pl-1.5 text-[11px] text-gray-300"
          >
            {r.type === 'image' && r.dataUrl && (
              <button onClick={() => setPreview(r)} className="flex items-center gap-1 hover:text-blue-300">
                <img src={r.dataUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                {r.label}
              </button>
            )}
            {r.type === 'pdf' && (
              <button onClick={() => setPreview(r)} className="flex items-center gap-1 hover:text-blue-300">
                <FileText size={12} />
                {r.label}
                <span className="text-gray-500">(local)</span>
              </button>
            )}
            {r.type === 'link' && r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-300"
              >
                <Link2 size={12} />
                {r.label}
              </a>
            )}
            <button
              onClick={() => onRemove(r)}
              className="text-gray-500 opacity-0 hover:text-red-400 group-hover:opacity-100"
              aria-label="Quitar recurso"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <ResourcePreviewModal resource={preview} onClose={() => setPreview(null)} />
    </>
  )
}
