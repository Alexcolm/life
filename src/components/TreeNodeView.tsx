import { Paperclip } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ResourceForm } from '../features/resources/ResourceForm'
import { ResourceList } from '../features/resources/ResourceList'
import { goalProgress, type GoalNode } from '../types/goal'
import type { Resource } from '../types/resource'

interface TreeNodeViewProps {
  node: GoalNode
  depth: number
  childLabel: string
  onToggle: (node: GoalNode) => void
  onAddChild: (parentId: string, title: string) => void
  onRemove: (id: string) => void
  resourcesByNode: Map<string, Resource[]>
  onAddLink: (nodeId: string, label: string, url: string) => Promise<void>
  onAddImage: (nodeId: string, label: string, file: File) => Promise<void>
  onAddPdf: (nodeId: string, label: string, file: File) => Promise<void>
  onRemoveResource: (id: string) => void
}

export function TreeNodeView({
  node,
  depth,
  childLabel,
  onToggle,
  onAddChild,
  onRemove,
  resourcesByNode,
  onAddLink,
  onAddImage,
  onAddPdf,
  onRemoveResource,
}: TreeNodeViewProps) {
  const [expanded, setExpanded] = useState(true)
  const [addingChild, setAddingChild] = useState(false)
  const [childTitle, setChildTitle] = useState('')
  const [showResources, setShowResources] = useState(false)

  const progress = goalProgress(node)
  const hasChildren = node.children.length > 0
  const nodeResources = resourcesByNode.get(node.id) ?? []

  function handleAddChild(e: FormEvent) {
    e.preventDefault()
    if (!childTitle.trim()) return
    onAddChild(node.id, childTitle.trim())
    setChildTitle('')
    setAddingChild(false)
    setExpanded(true)
  }

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 20 }}>
      <div className="flex items-center gap-2 rounded-xl border border-app-border bg-app-surface px-3 py-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          disabled={!hasChildren}
          className="w-4 shrink-0 text-gray-500 disabled:opacity-20"
        >
          {hasChildren ? (expanded ? '▾' : '▸') : '·'}
        </button>

        <input
          type="checkbox"
          checked={node.completed}
          onChange={() => onToggle(node)}
          className="h-4 w-4 shrink-0 accent-blue-500"
        />

        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            node.completed ? 'text-gray-500 line-through' : 'text-gray-100'
          }`}
        >
          {node.title}
        </span>

        {hasChildren && (
          <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-app-surface-2">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        <button
          onClick={() => setShowResources((v) => !v)}
          className={`shrink-0 rounded p-1 text-xs ${
            nodeResources.length > 0 ? 'text-blue-300' : 'text-gray-500 hover:text-blue-300'
          }`}
          aria-label="Adjuntos"
        >
          <span className="flex items-center gap-0.5">
            <Paperclip size={13} />
            {nodeResources.length > 0 && nodeResources.length}
          </span>
        </button>
        <button
          onClick={() => setAddingChild((v) => !v)}
          className="shrink-0 rounded p-1 text-xs text-gray-500 hover:text-blue-300"
          aria-label={`Agregar ${childLabel}`}
        >
          + {childLabel}
        </button>
        <button
          onClick={() => onRemove(node.id)}
          className="shrink-0 rounded p-1 text-gray-500 hover:text-red-400"
          aria-label="Eliminar"
        >
          ✕
        </button>
      </div>

      {addingChild && (
        <form onSubmit={handleAddChild} className="mt-1 flex gap-2" style={{ marginLeft: 20 }}>
          <input
            autoFocus
            value={childTitle}
            onChange={(e) => setChildTitle(e.target.value)}
            placeholder={`Nuevo/a ${childLabel}…`}
            className="flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-1.5 text-sm text-gray-100 outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-400"
          >
            Agregar
          </button>
        </form>
      )}

      {showResources && (
        <div className="mt-1 flex flex-col gap-2" style={{ marginLeft: 20 }}>
          <ResourceList resources={nodeResources} onRemove={onRemoveResource} />
          <ResourceForm
            onAddLink={(label, url) => onAddLink(node.id, label, url)}
            onAddImage={(label, file) => onAddImage(node.id, label, file)}
            onAddPdf={(label, file) => onAddPdf(node.id, label, file)}
          />
        </div>
      )}

      {expanded && hasChildren && (
        <div className="mt-1 flex flex-col gap-1">
          {node.children.map((child) => (
            <TreeNodeView
              key={child.id}
              node={child}
              depth={depth + 1}
              childLabel={childLabel}
              onToggle={onToggle}
              onAddChild={onAddChild}
              onRemove={onRemove}
              resourcesByNode={resourcesByNode}
              onAddLink={onAddLink}
              onAddImage={onAddImage}
              onAddPdf={onAddPdf}
              onRemoveResource={onRemoveResource}
            />
          ))}
        </div>
      )}
    </div>
  )
}
