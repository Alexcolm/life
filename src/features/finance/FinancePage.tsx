import { addMonths, format, subMonths } from 'date-fns'
import { Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { formatGs } from '../../lib/currency'
import { MONTH_LABELS } from '../../lib/date'
import { signedAmount, type Transaction } from '../../types/finance'
import { BudgetForm } from './BudgetForm'
import { ManualTransactionForm } from './ManualTransactionForm'
import { TransactionList } from './TransactionList'
import { useBudget } from './useBudget'
import { useTransactions } from './useTransactions'

export function FinancePage() {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const month = format(monthDate, 'yyyy-MM')

  const { transactions, loading: loadingTxns, addManualTransaction, removeTransaction } = useTransactions()
  const { budget, loading: loadingBudget, saveBudget } = useBudget(month)

  const monthTxns = useMemo(
    () => transactions.filter((t) => format(new Date(t.date), 'yyyy-MM') === month),
    [transactions, month],
  )

  const { income, expense, net } = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of monthTxns) {
      if (t.currency !== 'PYG') continue
      if (t.type === 'income') income += t.amount
      if (t.type === 'expense') expense += t.amount
    }
    return { income, expense, net: income - expense }
  }, [monthTxns])

  const startingBalance = budget?.startingBalance ?? 0
  const monthlyLimit = budget?.monthlyLimit ?? 0
  const realBalance = startingBalance + monthTxns.filter((t) => t.currency === 'PYG').reduce((s, t) => s + signedAmount(t as Transaction), 0)
  const remaining = monthlyLimit - expense
  const usedPct = monthlyLimit > 0 ? Math.min(100, Math.round((expense / monthlyLimit) * 100)) : 0
  const overBudget = monthlyLimit > 0 && expense > monthlyLimit

  const loading = loadingTxns || loadingBudget

  return (
    <div>
      <PageHeader icon={Wallet} title="Presupuesto" />

      <div className="mb-4 flex items-center gap-2">
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

      {loading && <p className="mb-2 text-gray-500">Cargando…</p>}

      <BudgetForm budget={budget} onSave={saveBudget} />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
          <p className="text-xs text-gray-500">Saldo real</p>
          <p className="text-sm font-semibold text-gray-100">{formatGs(realBalance)}</p>
        </div>
        <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
          <p className="text-xs text-gray-500">Ingresos del mes</p>
          <p className="text-sm font-semibold text-green-400">{formatGs(income)}</p>
        </div>
        <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
          <p className="text-xs text-gray-500">Gastado del mes</p>
          <p className="text-sm font-semibold text-red-400">{formatGs(expense)}</p>
        </div>
        <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
          <p className="text-xs text-gray-500">Neto del mes</p>
          <p className={`text-sm font-semibold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatGs(net)}</p>
        </div>
      </div>

      {monthlyLimit > 0 && (
        <div className="mb-4 rounded-xl border border-app-border bg-app-surface p-3">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {formatGs(expense)} de {formatGs(monthlyLimit)} presupuestados
            </span>
            <span className={overBudget ? 'font-semibold text-red-400' : 'text-gray-400'}>
              {overBudget ? `Te pasaste por ${formatGs(expense - monthlyLimit)}` : `Te quedan ${formatGs(remaining)}`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-app-surface-2">
            <div
              className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>
      )}

      <ManualTransactionForm onSubmit={addManualTransaction} />

      <h3 className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Movimientos del mes</h3>
      <TransactionList transactions={monthTxns} onRemove={removeTransaction} />
    </div>
  )
}
