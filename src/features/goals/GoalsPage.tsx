import { GraduationCap, Target } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { CURRICULUM_ROOT_TITLE } from './curriculumData'
import { GoalNodeView } from './GoalNodeView'
import { importCurriculum } from './importCurriculum'
import { useGoals } from './useGoals'

export function GoalsPage() {
  const { goals, tree, loading, addGoal, toggleCompleted, removeGoal } = useGoals()
  const [title, setTitle] = useState('')
  const [importing, setImporting] = useState(false)

  const alreadyImported = goals.some((g) => g.title === CURRICULUM_ROOT_TITLE)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addGoal(null, title.trim())
    setTitle('')
  }

  async function handleImportCurriculum() {
    setImporting(true)
    try {
      await importCurriculum()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <PageHeader icon={Target} title="Metas" />
      <p className="mb-4 text-sm text-gray-500">
        Creá una meta grande y desglosala en desafíos más chicos. Cada desafío puede tener a su
        vez sus propios sub-desafíos.
      </p>

      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
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

      {!alreadyImported && (
        <button
          onClick={handleImportCurriculum}
          disabled={importing}
          className="mb-6 flex items-center gap-2 rounded-lg border border-dashed border-app-border px-3 py-2 text-sm text-gray-400 transition hover:border-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          <GraduationCap size={16} />
          {importing
            ? 'Cargando malla curricular…'
            : 'Importar malla de Ingeniería en Informática (Universidad Columbia)'}
        </button>
      )}

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && tree.length === 0 && (
        <p className="text-gray-500">Todavía no tenés metas creadas.</p>
      )}

      <div className="flex flex-col gap-2">
        {tree.map((node) => (
          <GoalNodeView
            key={node.id}
            node={node}
            depth={0}
            onToggle={toggleCompleted}
            onAddChild={addGoal}
            onRemove={removeGoal}
          />
        ))}
      </div>
    </div>
  )
}
