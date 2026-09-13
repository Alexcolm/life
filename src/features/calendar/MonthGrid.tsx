import { isSameMonth, isToday } from 'date-fns'
import { getMonthGrid, toISODate, WEEKDAY_LABELS } from '../../lib/date'

interface DayMarkers {
  eventCount: number
  taskCount: number
  taskByPriority: { alta: number; media: number; baja: number }
}

interface MonthGridProps {
  monthDate: Date
  selectedDate: string
  onSelectDate: (iso: string) => void
  markersByDate: Map<string, DayMarkers>
}

export function MonthGrid({ monthDate, selectedDate, onSelectDate, markersByDate }: MonthGridProps) {
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
          const markers = markersByDate.get(iso)
          const inMonth = isSameMonth(day, monthDate)
          const today = isToday(day)
          const selected = iso === selectedDate

          const byPriority = markers?.taskByPriority
          const badgeColor = byPriority?.alta
            ? 'bg-red-500/20 text-red-300'
            : byPriority?.media
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-gray-700/40 text-gray-300'

          const priorityTitle = byPriority
            ? `${byPriority.alta} alta, ${byPriority.media} media, ${byPriority.baja} baja`
            : undefined

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
              <span className={`font-medium ${today ? 'text-blue-300' : 'text-gray-200'}`}>
                {day.getDate()}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-1">
                {!!markers?.taskCount && (
                  <span
                    title={priorityTitle}
                    className={`rounded-full px-1 text-[10px] leading-tight font-medium ${badgeColor}`}
                  >
                    {markers.taskCount}
                  </span>
                )}
                {!!markers?.eventCount && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
