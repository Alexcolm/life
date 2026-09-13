import { useState, type FormEvent } from 'react'
import { WEEKDAY_SHORT, type RoutineType } from '../../types/routine'

interface RoutineFormProps {
  onSubmit: (input: {
    title: string
    type: RoutineType
    daysOfWeek: number[]
    dayOfMonth: number | null
    time: string | null
  }) => Promise<void>
}

export function RoutineForm({ onSubmit }: RoutineFormProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<RoutineType>('semanal')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [dayOfMonth, setDayOfMonth] = useState(1)
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function toggleDay(day: number) {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (type === 'semanal' && daysOfWeek.length === 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        type,
        daysOfWeek: type === 'semanal' ? daysOfWeek : [],
        dayOfMonth: type === 'mensual' ? dayOfMonth : null,
        time: time || null,
      })
      setTitle('')
      setDaysOfWeek([])
      setDayOfMonth(1)
      setTime('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-xl border border-app-border bg-app-surface p-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva rutina… (ej: Entrenar piernas)"
          className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as RoutineType)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        >
          <option value="diaria">Diaria</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
        </select>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
      </div>

      {type === 'semanal' && (
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAY_SHORT.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleDay(index)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                daysOfWeek.includes(index)
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {type === 'mensual' && (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>Día del mes:</span>
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
            className="w-20 rounded-lg border border-app-border bg-app-surface-2 px-2 py-1 text-gray-100 outline-none focus:border-blue-400"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !title.trim() || (type === 'semanal' && daysOfWeek.length === 0)}
        className="self-start rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
      >
        Crear rutina
      </button>
    </form>
  )
}
