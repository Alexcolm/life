import { useEffect, useState, type FormEvent } from 'react'
import type { Budget } from '../../types/finance'

interface BudgetFormProps {
  budget: Budget | null
  onSave: (input: { startingBalance: number; monthlyLimit: number }) => Promise<void>
}

export function BudgetForm({ budget, onSave }: BudgetFormProps) {
  const [editing, setEditing] = useState(!budget)
  const [startingBalance, setStartingBalance] = useState(String(budget?.startingBalance ?? ''))
  const [monthlyLimit, setMonthlyLimit] = useState(String(budget?.monthlyLimit ?? ''))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setStartingBalance(String(budget?.startingBalance ?? ''))
    setMonthlyLimit(String(budget?.monthlyLimit ?? ''))
    setEditing(!budget)
  }, [budget])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const sb = Number(startingBalance) || 0
    const ml = Number(monthlyLimit) || 0
    setSubmitting(true)
    try {
      await onSave({ startingBalance: sb, monthlyLimit: ml })
      setEditing(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (!editing && budget) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mb-4 text-xs text-gray-500 hover:text-blue-300"
      >
        Editar presupuesto del mes
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface p-3"
    >
      <p className="text-xs text-gray-500">Definí tu presupuesto para este mes.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1 text-xs text-gray-500">
          Saldo inicial (con el que arrancás el mes)
          <input
            type="number"
            inputMode="numeric"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            placeholder="Gs"
            className="mt-1 w-full rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
          />
        </label>
        <label className="flex-1 text-xs text-gray-500">
          Límite de gasto mensual
          <input
            type="number"
            inputMode="numeric"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            placeholder="Gs"
            className="mt-1 w-full rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="self-end rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
      >
        Guardar
      </button>
    </form>
  )
}
