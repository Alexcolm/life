import { addMonths, subMonths } from 'date-fns'
import { Bus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { MONTH_LABELS, toISODate } from '../../lib/date'
import { TransportDayPanel } from './TransportDayPanel'
import { TransportMonthGrid } from './TransportMonthGrid'
import { TransportMonthlyReport } from './TransportMonthlyReport'
import { useTransportExpenses } from './useTransportExpenses'

export function TransportPage() {
  const { expenses, loading, addExpense, removeExpense } = useTransportExpenses()
  const [view, setView] = useState<'dia' | 'mes'>('dia')
  const [monthDate, setMonthDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))

  const totalsByDate = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    for (const e of expenses) {
      const entry = map.get(e.date) ?? { count: 0, total: 0 }
      entry.count += 1
      entry.total += e.amount
      map.set(e.date, entry)
    }
    return map
  }, [expenses])

  const dayExpenses = expenses.filter((e) => e.date === selectedDate)

  const dateLabel = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(selectedDate + 'T00:00:00'))

  return (
    <div>
      <PageHeader icon={Bus} title="Colectivos" />

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
          {view === 'dia' && (
            <button
              onClick={() => {
                const today = new Date()
                setMonthDate(today)
                setSelectedDate(toISODate(today))
              }}
              className="rounded-lg bg-app-surface-2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
            >
              Hoy
            </button>
          )}
        </div>
      </div>

      {loading && <p className="mb-2 text-gray-500">Cargando…</p>}

      {!loading && view === 'dia' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <TransportMonthGrid
            monthDate={monthDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            totalsByDate={totalsByDate}
          />
          <TransportDayPanel
            dateLabel={dateLabel}
            isoDate={selectedDate}
            expenses={dayExpenses}
            onAdd={addExpense}
            onRemove={removeExpense}
          />
        </div>
      )}

      {!loading && view === 'mes' && <TransportMonthlyReport expenses={expenses} monthDate={monthDate} />}
    </div>
  )
}
