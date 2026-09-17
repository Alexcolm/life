import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { TreeNodeView } from '../../components/TreeNodeView'
import { useResources } from '../resources/useResources'
import { useCareer } from './useCareer'
import { moveOrImportCurriculum } from './moveOrImportCurriculum'

export function CareerPage() {
  const { tree, loading, addNode, toggleCompleted, removeNode } = useCareer()
  const { resources, addLink, addImage, addPdf, removeResource } = useResources()
  const [importing, setImporting] = useState(false)

  const resourcesByNode = new Map<string, ReturnType<typeof useResources>['resources']>()
  for (const r of resources) {
    const list = resourcesByNode.get(r.nodeId) ?? []
    list.push(r)
    resourcesByNode.set(r.nodeId, list)
  }

  async function handleImport() {
    setImporting(true)
    try {
      await moveOrImportCurriculum()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <PageHeader icon={GraduationCap} title="Carrera" />
      <p className="mb-4 text-sm text-gray-500">
        Tu malla de estudio como árbol: carrera → curso → semestre → materia. Adjuntá apuntes,
        links o PDFs a cada materia con el ícono de clip.
      </p>

      {tree.length === 0 && !loading && (
        <button
          onClick={handleImport}
          disabled={importing}
          className="mb-6 flex items-center gap-2 rounded-lg border border-dashed border-app-border px-3 py-2 text-sm text-gray-400 transition hover:border-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          <GraduationCap size={16} />
          {importing ? 'Cargando malla…' : 'Importar malla de Ingeniería en Informática'}
        </button>
      )}

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && tree.length === 0 && !importing && (
        <p className="text-gray-500">Todavía no cargaste tu malla.</p>
      )}

      <div className="flex flex-col gap-2">
        {tree.map((node) => (
          <TreeNodeView
            key={node.id}
            node={node}
            depth={0}
            childLabel="materia"
            onToggle={toggleCompleted}
            onAddChild={addNode}
            onRemove={removeNode}
            resourcesByNode={resourcesByNode}
            onAddLink={addLink}
            onAddImage={addImage}
            onAddPdf={addPdf}
            onRemoveResource={removeResource}
          />
        ))}
      </div>
    </div>
  )
}
