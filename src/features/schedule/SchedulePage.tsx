import { addMonths, subMonths } from 'date-fns'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { MONTH_LABELS, toISODate } from '../../lib/date'
import { MonthlyReport } from './MonthlyReport'
import { ScheduleForm } from './ScheduleForm'
import { ScheduleTable } from './ScheduleTable'
import { useSchedule } from './useSchedule'

export function SchedulePage() {
  const { items, loading, addItem, toggleCompleted, removeItem } = useSchedule()
  const [view, setView] = useState<'dia' | 'mes'>('dia')
  const [date, setDate] = useState(() => toISODate(new Date()))
  const [monthDate, setMonthDate] = useState(() => new Date())

  const dayItems = items.filter((i) => i.date === date)

  return (
    <div>
      <PageHeader icon={Clock} title="Horario" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setView('dia')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            view === 'dia' ? 'bg-blue-500/15 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Día
        </button>
        <button
          onClick={() => setView('mes')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            view === 'mes' ? 'bg-blue-500/15 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Reporte mensual
        </button>

        {view === 'dia' ? (
          <>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="ml-auto rounded-lg border border-app-border bg-app-surface-2 px-3 py-1.5 text-sm text-gray-100 outline-none focus:border-blue-400"
            />
            <button
              onClick={() => setDate(toISODate(new Date()))}
              className="rounded-lg bg-app-surface-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200"
            >
              Hoy
            </button>
          </>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setMonthDate((d) => subMonths(d, 1))}
              className="rounded-lg bg-app-surface-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white"
            >
              ←
            </button>
            <span className="text-sm text-gray-200">
              {MONTH_LABELS[monthDate.getMonth()]} {monthDate.getFullYear()}
            </span>
            <button
              onClick={() => setMonthDate((d) => addMonths(d, 1))}
              className="rounded-lg bg-app-surface-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white"
            >
              →
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-gray-500">Cargando…</p>}

      {!loading && view === 'dia' && (
        <>
          <ScheduleForm date={date} onSubmit={addItem} />
          <ScheduleTable items={dayItems} onToggle={toggleCompleted} onRemove={removeItem} />
        </>
      )}

      {!loading && view === 'mes' && <MonthlyReport items={items} monthDate={monthDate} />}
    </div>
  )
}
