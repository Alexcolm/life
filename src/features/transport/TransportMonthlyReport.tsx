import { formatGs } from '../../lib/currency'
import { TRANSPORT_METHOD_LABEL, type TransportExpense, type TransportMethod } from '../../types/transport'

interface TransportMonthlyReportProps {
  expenses: TransportExpense[]
  monthDate: Date
}

const METHODS: TransportMethod[] = ['efectivo', 'tarjeta', 'bolt']

export function TransportMonthlyReport({ expenses, monthDate }: TransportMonthlyReportProps) {
  const monthPrefix = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthPrefix))

  const byMethod = new Map<TransportMethod, { count: number; total: number }>()
  for (const m of METHODS) byMethod.set(m, { count: 0, total: 0 })
  for (const e of monthExpenses) {
    const entry = byMethod.get(e.method)!
    entry.count += 1
    entry.total += e.amount
  }

  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

  const byDate = new Map<string, number>()
  for (const e of monthExpenses) byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.amount)
  const rows = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
        <span>
          Viajes del mes: <b className="text-gray-100">{monthExpenses.length}</b>
        </span>
        <span>
          Total gastado: <b className="text-blue-300">{formatGs(total)}</b>
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {METHODS.map((m) => {
          const entry = byMethod.get(m)!
          return (
            <div key={m} className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
              <p className="text-xs text-gray-500">{TRANSPORT_METHOD_LABEL[m]}</p>
              <p className="text-sm font-medium text-gray-100">
                {entry.count} · {formatGs(entry.total)}
              </p>
            </div>
          )
        })}
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500">Sin viajes este mes.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-app-border">
          <table className="w-full min-w-[320px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-app-border bg-app-surface text-left text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([date, dayTotal]) => (
                <tr key={date} className="border-b border-app-border/60 bg-app-surface last:border-0">
                  <td className="px-3 py-2 text-gray-100">{date}</td>
                  <td className="px-3 py-2 text-right text-blue-300">{formatGs(dayTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
