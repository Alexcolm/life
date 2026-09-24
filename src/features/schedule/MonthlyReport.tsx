import { format } from 'date-fns'
import type { ScheduleItem } from '../../types/schedule'

interface MonthlyReportProps {
  items: ScheduleItem[]
  monthDate: Date
}

export function MonthlyReport({ items, monthDate }: MonthlyReportProps) {
  const monthPrefix = format(monthDate, 'yyyy-MM')
  const monthItems = items.filter((i) => i.date.startsWith(monthPrefix))

  const byDate = new Map<string, ScheduleItem[]>()
  for (const item of monthItems) {
    const list = byDate.get(item.date) ?? []
    list.push(item)
    byDate.set(item.date, list)
  }
  const dates = Array.from(byDate.keys()).sort()

  const total = monthItems.length
  const totalDone = monthItems.filter((i) => i.completed).length
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

      {dates.length === 0 ? (
        <p className="text-gray-500">Sin actividades cargadas este mes.</p>
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
              {dates.map((date) => {
                const dayItems = byDate.get(date)!
                const done = dayItems.filter((i) => i.completed).length
                const dayPct = Math.round((done / dayItems.length) * 100)
                return (
                  <tr key={date} className="border-b border-app-border/60 bg-app-surface last:border-0">
                    <td className="px-3 py-2 text-gray-100">{date}</td>
                    <td className="px-3 py-2 text-center text-gray-300">{dayItems.length}</td>
                    <td className="px-3 py-2 text-center text-gray-300">{done}</td>
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
