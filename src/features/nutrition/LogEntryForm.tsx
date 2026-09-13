import { useState, type FormEvent } from 'react'
import { PORTION_PRESETS } from '../../types/nutrition'

interface LogEntryFormProps {
  date: string
  onSubmit: (input: {
    name: string
    portion: string
    calories: number | null
    date: string
    time: string | null
  }) => Promise<void>
}

export function LogEntryForm({ date, onSubmit }: LogEntryFormProps) {
  const [name, setName] = useState('')
  const [portion, setPortion] = useState('')
  const [calories, setCalories] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        portion: portion.trim() || 'sin especificar',
        calories: calories ? Number(calories) : null,
        date,
        time: null,
      })
      setName('')
      setPortion('')
      setCalories('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-xl border border-app-border bg-app-surface p-3"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="¿Qué comiste? (ej: milanesa con puré)"
        className="w-full min-w-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
      />

      <div className="flex flex-wrap gap-1.5">
        {PORTION_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setPortion(preset)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              portion === preset
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={portion}
          onChange={(e) => setPortion(e.target.value)}
          placeholder="Porción (podés editarla, ej: 2 platos chicos)"
          className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <input
          type="number"
          inputMode="numeric"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Kcal (estimado)"
          className="w-32 min-w-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="self-start rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
      >
        Agregar
      </button>
    </form>
  )
}
