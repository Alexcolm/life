import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { ResourceForm } from '../resources/ResourceForm'
import { ResourceList } from '../resources/ResourceList'
import type { Resource } from '../../types/resource'

interface SubjectCardProps {
  title: string
  resources: Resource[]
  onAddLink: (label: string, url: string) => Promise<void>
  onAddImage: (label: string, file: File) => Promise<void>
  onAddPdf: (label: string, file: File) => Promise<void>
  onRemoveResource: (resource: Resource) => void
  onRemove: () => void
}

export function SubjectCard({
  title,
  resources,
  onAddLink,
  onAddImage,
  onAddPdf,
  onRemoveResource,
  onRemove,
}: SubjectCardProps) {
  const [showAttachments, setShowAttachments] = useState(false)
  const cover = resources.find((r) => r.type === 'image')

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface">
      <button
        onClick={() => setShowAttachments((v) => !v)}
        className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-app-surface-2 text-gray-600"
      >
        {cover?.dataUrl ? (
          <img src={cover.dataUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <GraduationCap size={36} />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="truncate text-sm font-medium text-gray-100">{title}</p>

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={() => setShowAttachments((v) => !v)}
            className="text-xs text-gray-500 hover:text-blue-300"
          >
            {resources.length > 0 ? `${resources.length} adjunto(s)` : 'Adjuntar'}
          </button>
          <button onClick={onRemove} className="rounded p-1 text-gray-500 hover:text-red-400" aria-label="Eliminar materia">
            ✕
          </button>
        </div>

        {showAttachments && (
          <div className="flex flex-col gap-2 border-t border-app-border pt-2">
            <ResourceList resources={resources} onRemove={onRemoveResource} />
            <ResourceForm onAddLink={onAddLink} onAddImage={onAddImage} onAddPdf={onAddPdf} />
          </div>
        )}
      </div>
    </li>
  )
}
