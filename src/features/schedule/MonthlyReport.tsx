import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns'
import { toISODate } from '../../lib/date'
import type { ScheduleItem } from '../../types/schedule'
import { getScheduleItemsForDate } from './occurrences'

interface MonthlyReportProps {
  items: ScheduleItem[]
  monthDate: Date
  isDone: (id: string, date: string) => boolean
}

export function MonthlyReport({ items, monthDate, isDone }: MonthlyReportProps) {
  const days = eachDayOfInterval({ start: startOfMonth(monthDate), end: endOfMonth(monthDate) })

  const rows = days
    .map((day) => {
      const iso = toISODate(day)
      const dueItems = getScheduleItemsForDate(items, day)
      const done = dueItems.filter((item) => isDone(item.id, iso)).length
      return { iso, total: dueItems.length, done }
    })
    .filter((row) => row.total > 0)

  const total = rows.reduce((sum, r) => sum + r.total, 0)
  const totalDone = rows.reduce((sum, r) => sum + r.done, 0)
  const pct = total > 0 ? Math.round((totalDone / total) * 100) : 0

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
        <span>
          Actividades del mes: <b className="text-gray-100">{total}</b>
        </span>
        <span>
          Cumplidas: <b className="text-blue-300">{totalDone}</b>
        </span>
        <span>
          % de cumplimiento: <b className="text-blue-300">{pct}%</b>
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500">Sin actividades este mes.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-app-border">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-app-border bg-app-surface text-left text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2 text-center">Actividades</th>
                <th className="px-3 py-2 text-center">Cumplidas</th>
                <th className="px-3 py-2 text-center">% Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const dayPct = Math.round((row.done / row.total) * 100)
                return (
                  <tr key={row.iso} className="border-b border-app-border/60 bg-app-surface last:border-0">
                    <td className="px-3 py-2 text-gray-100">{row.iso}</td>
                    <td className="px-3 py-2 text-center text-gray-300">{row.total}</td>
                    <td className="px-3 py-2 text-center text-gray-300">{row.done}</td>
                    <td className="px-3 py-2 text-center text-blue-300">{dayPct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
