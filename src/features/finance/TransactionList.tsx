import { format } from 'date-fns'
import { formatMoney } from '../../lib/currency'
import type { Transaction } from '../../types/finance'

const TYPE_LABEL: Record<Transaction['type'], string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  own: 'Entre cuentas propias',
  unknown: 'Sin clasificar',
}

const TYPE_COLOR: Record<Transaction['type'], string> = {
  income: 'text-green-400',
  expense: 'text-red-400',
  own: 'text-gray-500',
  unknown: 'text-gray-500',
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="text-gray-500">Sin movimientos todavía. Sincronizá la app del banco para verlos acá.</p>
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {transactions.map((t) => {
        const sign = t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''
        return (
          <li
            key={t.id}
            className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface-2/50 px-2.5 py-1.5 text-sm"
          >
            <span className="shrink-0 text-xs text-gray-500">{format(new Date(t.date), 'dd/MM HH:mm')}</span>
            <span className="min-w-0 flex-1 truncate text-gray-200" title={TYPE_LABEL[t.type]}>
              {t.description || t.subject}
            </span>
            <span className={`shrink-0 font-medium ${TYPE_COLOR[t.type]}`}>
              {sign}
              {formatMoney(t.amount, t.currency)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
