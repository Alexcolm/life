import { Salad } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { toISODate } from '../../lib/date'
import { LogEntryForm } from './LogEntryForm'
import { LogEntryItem } from './LogEntryItem'
import { useNutritionLogs } from './useNutritionLogs'

export function NutritionPage() {
  const { logs, loading, addLog, removeLog } = useNutritionLogs()
  const [date, setDate] = useState(() => toISODate(new Date()))

  const dayLogs = logs.filter((l) => l.date === date)
  const totalCalories = dayLogs.reduce((sum, l) => sum + (l.calories ?? 0), 0)
  const hasAnyCalories = dayLogs.some((l) => l.calories !== null)

  return (
    <div>
      <PageHeader icon={Salad} title="Nutrición" />

      <div className="mb-4 flex items-center gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-1.5 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <button
          onClick={() => setDate(toISODate(new Date()))}
          className="rounded-lg bg-app-surface-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200"
        >
          Hoy
        </button>
        {hasAnyCalories && (
          <span className="ml-auto text-sm text-gray-400">
            Total estimado: <span className="font-medium text-blue-300">{totalCalories} kcal</span>
          </span>
        )}
      </div>

      <LogEntryForm date={date} onSubmit={addLog} />

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && dayLogs.length === 0 && (
        <p className="text-gray-500">No registraste nada para este día.</p>
      )}

      <ul className="flex flex-col gap-2">
        {dayLogs.map((log) => (
          <LogEntryItem key={log.id} log={log} onRemove={() => removeLog(log.id)} />
        ))}
      </ul>
    </div>
  )
}
