import { ChevronRight, FolderOpen, GraduationCap, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/PageHeader'
import type { GoalNode } from '../../types/goal'
import { useResources } from '../resources/useResources'
import { SubjectCard } from './SubjectCard'
import { moveOrImportCurriculum } from './moveOrImportCurriculum'
import { useCareer } from './useCareer'

function findPath(roots: GoalNode[], targetId: string): GoalNode[] | null {
  for (const root of roots) {
    if (root.id === targetId) return [root]
    const stack: { node: GoalNode; path: GoalNode[] }[] = [{ node: root, path: [root] }]
    while (stack.length > 0) {
      const { node, path } = stack.pop()!
      for (const child of node.children) {
        if (child.id === targetId) return [...path, child]
        stack.push({ node: child, path: [...path, child] })
      }
    }
  }
  return null
}

// Nivel 0 = curso (título grande), nivel 1 = semestre (subtítulo), nivel 2+ = otros
const FOLDER_TEXT_BY_DEPTH = [
  'font-display text-base font-semibold text-gray-100',
  'text-sm font-medium text-gray-200',
  'text-sm text-gray-300',
]

export function CareerPage() {
  const { tree, loading, addNode, removeNode } = useCareer()
  const { resources, addLink, addImage, addPdf, removeResource } = useResources()
  const [importing, setImporting] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [addingTitle, setAddingTitle] = useState('')
  const [adding, setAdding] = useState(false)

  // Si hay una única raíz (el caso normal: la carrera importada), nos saltamos ese
  // primer clic redundante y arrancamos mostrando directamente sus cursos.
  const singleRoot = tree.length === 1 ? tree[0] : null
  const path = currentId ? findPath(tree, currentId) : singleRoot ? [singleRoot] : []
  const currentNode = path && path.length > 0 ? path[path.length - 1] : null
  const children = currentNode ? currentNode.children : tree
  const isLeafLevel = children.length > 0 && children.every((c) => c.children.length === 0)
  const folderDepth = currentId === null ? 0 : (path?.length ?? 1) - 1

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

  function handleAddChild(e: FormEvent) {
    e.preventDefault()
    if (!addingTitle.trim()) return
    addNode(currentNode?.id ?? null, addingTitle.trim())
    setAddingTitle('')
    setAdding(false)
  }

  return (
    <div>
      <PageHeader icon={GraduationCap} title="Carrera" />

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

      {tree.length > 0 && (
        <>
          {/* Migas de pan */}
          <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-gray-500">
            <button
              onClick={() => setCurrentId(null)}
              className={currentId === null ? 'text-blue-300' : 'hover:text-gray-300'}
            >
              Carrera
            </button>
            {path?.map((node) => (
              <span key={node.id} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <button
                  onClick={() => setCurrentId(node.id)}
                  className={node.id === currentId ? 'text-blue-300' : 'hover:text-gray-300'}
                >
                  {node.title}
                </button>
              </span>
            ))}
          </div>

          {isLeafLevel ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {children.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  title={subject.title}
                  resources={resourcesByNode.get(subject.id) ?? []}
                  onAddLink={(label, url) => addLink(subject.id, label, url)}
                  onAddImage={(label, file) => addImage(subject.id, label, file)}
                  onAddPdf={(label, file) => addPdf(subject.id, label, file)}
                  onRemoveResource={removeResource}
                  onRemove={() => removeNode(subject.id)}
                />
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {children.map((folder) => (
                <li key={folder.id}>
                  <button
                    onClick={() => setCurrentId(folder.id)}
                    className="flex w-full items-center gap-2 rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-left hover:border-blue-400/40"
                  >
                    <FolderOpen size={16} className="shrink-0 text-blue-400" />
                    <span className={`min-w-0 flex-1 truncate ${FOLDER_TEXT_BY_DEPTH[Math.min(folderDepth, 2)]}`}>
                      {folder.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNode(folder.id)
                      }}
                      className="shrink-0 rounded p-1 text-gray-500 hover:text-red-400"
                      aria-label="Eliminar"
                    >
                      ✕
                    </button>
                    <ChevronRight size={16} className="shrink-0 text-gray-600" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {children.length === 0 && <p className="text-gray-500">Vacío por ahora.</p>}

          {adding ? (
            <form onSubmit={handleAddChild} className="mt-3 flex gap-2">
              <input
                autoFocus
                value={addingTitle}
                onChange={(e) => setAddingTitle(e.target.value)}
                placeholder="Nombre…"
                className="flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Agregar
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-blue-300"
            >
              <Plus size={14} /> Agregar acá
            </button>
          )}
        </>
      )}
    </div>
  )
}
