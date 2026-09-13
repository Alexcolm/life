import { useState, type FormEvent } from 'react'
import { FREQUENCY_LABEL, PRIORITY_LABEL, type TaskFrequency, type TaskPriority } from '../../types/task'

interface TaskFormProps {
  onSubmit: (input: {
    title: string
    priority: TaskPriority
    frequency: TaskFrequency
    dueDate: string | null
  }) => Promise<void>
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('media')
  const [frequency, setFrequency] = useState<TaskFrequency>('ninguna')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        priority,
        frequency,
        dueDate: dueDate || null,
      })
      setTitle('')
      setPriority('media')
      setFrequency('ninguna')
      setDueDate('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface p-3 sm:flex-row sm:items-center"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea…"
        className="flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      >
        {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
        className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      >
        {Object.entries(FREQUENCY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      />

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
      >
        Agregar
      </button>
    </form>
  )
}
