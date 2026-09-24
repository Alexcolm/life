import { useState, type FormEvent } from 'react'

interface ScheduleFormProps {
  date: string
  onSubmit: (input: {
    time: string
    activity: string
    description: string
    recurring: boolean
    date: string | null
  }) => Promise<void>
}

export function ScheduleForm({ date, onSubmit }: ScheduleFormProps) {
  const [time, setTime] = useState('')
  const [activity, setActivity] = useState('')
  const [recurring, setRecurring] = useState(true)
  const [customDate, setCustomDate] = useState(date)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!time || !activity.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        time,
        activity: activity.trim(),
        description: '',
        recurring,
        date: recurring ? null : customDate,
      })
      setTime('')
      setActivity('')
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
          onClick={() => setRecurring(true)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            recurring ? 'bg-blue-500/20 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Todos los días de semana (Lun-Vie)
        </button>
        <button
          type="button"
          onClick={() => setRecurring(false)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !recurring ? 'bg-blue-500/20 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Fecha puntual
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        {!recurring && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
          />
        )}
        <input
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Actividad… (ej: Salir de casa)"
          className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={submitting || !time || !activity.trim()}
          className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
        >
          Agregar
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Después podés agregarle mini actividades tildables desde la columna Descripción.
      </p>
    </form>
  )
}
