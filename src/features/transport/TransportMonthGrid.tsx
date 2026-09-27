import { isSameMonth, isToday } from 'date-fns'
import { getMonthGrid, toISODate, WEEKDAY_LABELS } from '../../lib/date'
import { formatGs } from '../../lib/currency'

interface DayTotals {
  count: number
  total: number
}

interface TransportMonthGridProps {
  monthDate: Date
  selectedDate: string
  onSelectDate: (iso: string) => void
  totalsByDate: Map<string, DayTotals>
}

export function TransportMonthGrid({ monthDate, selectedDate, onSelectDate, totalsByDate }: TransportMonthGridProps) {
  const days = getMonthGrid(monthDate)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-medium text-gray-500">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toISODate(day)
          const totals = totalsByDate.get(iso)
          const inMonth = isSameMonth(day, monthDate)
          const today = isToday(day)
          const selected = iso === selectedDate

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-lg border p-1 pt-1.5 text-xs transition ${
                selected
                  ? 'border-blue-400 bg-blue-500/15'
                  : today
                    ? 'border-blue-800 bg-app-surface'
                    : 'border-app-border bg-app-surface hover:border-app-border'
              } ${inMonth ? '' : 'opacity-40'}`}
            >
              <span className={`font-medium ${today ? 'text-blue-300' : 'text-gray-200'}`}>{day.getDate()}</span>

              {!!totals?.count && (
                <span className="rounded-full bg-blue-500/15 px-1 text-[9px] leading-tight font-medium text-blue-300">
                  {formatGs(totals.total)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
