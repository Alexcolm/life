import { formatGs } from '../../lib/currency'
import { TRANSPORT_METHOD_LABEL, type TransportExpense, type TransportMethod } from '../../types/transport'
import { TransportForm } from './TransportForm'

const METHOD_DOT: Record<TransportMethod, string> = {
  efectivo: 'bg-green-400',
  tarjeta: 'bg-blue-400',
  bolt: 'bg-purple-400',
}

interface TransportDayPanelProps {
  dateLabel: string
  isoDate: string
  expenses: TransportExpense[]
  onAdd: (input: { date: string; method: TransportMethod; amount: number; note: string | null }) => Promise<void>
  onRemove: (id: string) => void
}

export function TransportDayPanel({ dateLabel, isoDate, expenses, onAdd, onRemove }: TransportDayPanelProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-app-border bg-app-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold capitalize text-gray-200">{dateLabel}</h2>
        {expenses.length > 0 && <span className="text-sm font-medium text-blue-300">{formatGs(total)}</span>}
      </div>

      {expenses.length === 0 && <p className="text-sm text-gray-600">Sin viajes cargados.</p>}
      <ul className="flex flex-col gap-1.5">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface-2/50 px-2.5 py-1.5 text-sm"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${METHOD_DOT[expense.method]}`} />
            <span className="shrink-0 text-xs text-gray-400">{TRANSPORT_METHOD_LABEL[expense.method]}</span>
            <span className="min-w-0 flex-1 truncate text-gray-100">{expense.note ?? ''}</span>
            <span className="shrink-0 font-medium text-gray-200">{formatGs(expense.amount)}</span>
            <button
              onClick={() => onRemove(expense.id)}
              className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400"
              aria-label="Eliminar viaje"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <TransportForm date={isoDate} onSubmit={onAdd} />
    </div>
  )
}
