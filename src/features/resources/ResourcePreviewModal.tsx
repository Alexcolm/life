import { useEffect, useState } from 'react'
import { getLocalFile } from '../../lib/localFiles'
import type { Resource } from '../../types/resource'

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
  return <iframe src={objectUrl} className="h-full w-full" title={resource.label} />
}

interface ResourcePreviewModalProps {
  resource: Resource | null
  onClose: () => void
}

export function ResourcePreviewModal({ resource, onClose }: ResourcePreviewModalProps) {
  if (!resource) return null

  return (
    <div className="safe-top safe-bottom fixed inset-0 z-50 flex flex-col bg-app-bg">
      <div className="flex items-center justify-between border-b border-app-border px-4 py-3">
        <span className="truncate text-sm font-medium text-gray-200">{resource.label}</span>
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg bg-app-surface-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white"
        >
          Cerrar ✕
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto">
        {resource.type === 'image' && resource.dataUrl && (
          <img src={resource.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
        )}
        {resource.type === 'pdf' && <PdfPreview resource={resource} />}
      </div>
    </div>
  )
}
