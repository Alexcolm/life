import { useState, type FormEvent } from 'react'
import type { NoteType } from '../../types/note'
import type { Task } from '../../types/task'

interface NoteFormProps {
  pendingTasks: Task[]
  onSubmit: (input: {
    type: NoteType
    title: string
    description: string
    store: string | null
    taskId: string | null
  }) => Promise<void>
}

export function NoteForm({ pendingTasks, onSubmit }: NoteFormProps) {
  const [type, setType] = useState<NoteType>('texto')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [store, setStore] = useState('')
  const [taskId, setTaskId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        type,
        title: title.trim(),
        description: description.trim(),
        store: type === 'compra' ? store.trim() || null : null,
        taskId: taskId || null,
      })
      setTitle('')
      setDescription('')
      setStore('')
      setTaskId('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface p-3"
    >
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setType('texto')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            type === 'texto' ? 'bg-blue-500/20 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Nota
        </button>
        <button
          type="button"
          onClick={() => setType('compra')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            type === 'compra' ? 'bg-blue-500/20 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Lista de compra
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la nota…"
        className="w-full min-w-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      />

      {type === 'compra' ? (
        <input
          value={store}
          onChange={(e) => setStore(e.target.value)}
          placeholder="¿Dónde vas a comprar? (opcional)"
          className="w-full min-w-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
      ) : (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribí lo que quieras…"
          rows={3}
          className="w-full min-w-0 resize-y rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        >
          <option value="">Sin asociar a ninguna tarea</option>
          {pendingTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
        >
          Agregar
        </button>
      </div>
      {type === 'compra' && (
        <p className="text-xs text-gray-500">Después podés ir cargando los productos y sus precios uno por uno.</p>
      )}
      {taskId && (
        <p className="text-xs text-gray-500">
          Esta nota se va a borrar automáticamente cuando completes esa tarea.
        </p>
      )}
    </form>
  )
}
