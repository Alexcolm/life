import { useState, type FormEvent } from 'react'
import type { TransactionType } from '../../types/finance'

interface ManualTransactionFormProps {
  onSubmit: (input: { date: number; amount: number; type: TransactionType; description: string }) => Promise<void>
}

export function ManualTransactionForm({ onSubmit }: ManualTransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) return
    setSubmitting(true)
    try {
      await onSubmit({ date: Date.now(), amount: parsed, type, description: description.trim() })
      setAmount('')
      setDescription('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface p-3">
      <p className="text-xs text-gray-500">Cargá a mano lo que gastaste o cobraste hoy y no vino del banco (ej. efectivo).</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            type === 'expense' ? 'bg-red-500/20 text-red-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            type === 'income' ? 'bg-green-500/20 text-green-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
          }`}
        >
          Ingreso
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto en Gs"
          className="w-32 shrink-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿En qué? (opcional)"
          className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={submitting || !amount || Number(amount) <= 0}
          className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
        >
          Agregar
        </button>
      </div>
    </form>
  )
}
