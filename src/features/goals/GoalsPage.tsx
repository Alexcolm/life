import { Target } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { TreeNodeView } from '../../components/TreeNodeView'
import { useResources } from '../resources/useResources'
import { useGoals } from './useGoals'

export function GoalsPage() {
  const { tree, loading, addGoal, toggleCompleted, removeGoal } = useGoals()
  const { resources, addLink, addImage, addPdf, removeResource } = useResources()
  const [title, setTitle] = useState('')

  const resourcesByNode = new Map<string, ReturnType<typeof useResources>['resources']>()
  for (const r of resources) {
    const list = resourcesByNode.get(r.nodeId) ?? []
    list.push(r)
    resourcesByNode.set(r.nodeId, list)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addGoal(null, title.trim())
    setTitle('')
  }

  return (
    <div>
      <PageHeader icon={Target} title="Metas" />
      <p className="mb-4 text-sm text-gray-500">
        Creá una meta grande y desglosala en desafíos más chicos. Cada desafío puede tener a su
        vez sus propios sub-desafíos, y adjuntarle links, imágenes o PDFs (ícono de clip).
      </p>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva meta grande…"
          className="flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && tree.length === 0 && (
        <p className="text-gray-500">Todavía no tenés metas creadas.</p>
      )}

      <div className="flex flex-col gap-2">
        {tree.map((node) => (
          <TreeNodeView
            key={node.id}
            node={node}
            depth={0}
            childLabel="desafío"
            onToggle={toggleCompleted}
            onAddChild={addGoal}
            onRemove={removeGoal}
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
