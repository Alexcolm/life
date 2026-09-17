import { FileText, Link2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLocalFile } from '../../lib/localFiles'
import type { Resource } from '../../types/resource'

interface ResourceListProps {
  resources: Resource[]
  onRemove: (resource: Resource) => void
}

function PdfPreview({ resource }: { resource: Resource }) {
  const [objectUrl, setObjectUrl] = useState<string | null | 'missing'>(null)

  useEffect(() => {
    let currentUrl: string | null = null
    getLocalFile(resource.id).then((blob) => {
      if (!blob) {
        setObjectUrl('missing')
        return
      }
      currentUrl = URL.createObjectURL(blob)
      setObjectUrl(currentUrl)
    })
    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [resource.id])

  if (objectUrl === 'missing') {
    return (
      <p className="p-6 text-center text-sm text-gray-500">
        Este PDF se guardó localmente en otro dispositivo — no está disponible en este.
      </p>
    )
  }
  if (!objectUrl) {
    return <p className="p-6 text-center text-sm text-gray-500">Cargando…</p>
  }
  return <iframe src={objectUrl} className="h-[75vh] w-full" title={resource.label} />
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

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-app-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-app-border px-3 py-2">
              <span className="truncate text-sm text-gray-200">{preview.label}</span>
              <button onClick={() => setPreview(null)} className="shrink-0 text-gray-400 hover:text-gray-200">
                ✕
              </button>
            </div>
            {preview.type === 'image' && preview.dataUrl && (
              <img src={preview.dataUrl} alt="" className="max-h-[75vh] w-full object-contain" />
            )}
            {preview.type === 'pdf' && <PdfPreview resource={preview} />}
          </div>
        </div>
      )}
    </>
  )
}
