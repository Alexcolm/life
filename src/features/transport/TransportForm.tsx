import { useState, type FormEvent } from 'react'
import { TRANSPORT_DEFAULT_AMOUNT, TRANSPORT_METHOD_LABEL, type TransportMethod } from '../../types/transport'

interface TransportFormProps {
  date: string
  onSubmit: (input: { date: string; method: TransportMethod; amount: number; note: string | null }) => Promise<void>
}

const METHODS: TransportMethod[] = ['efectivo', 'tarjeta', 'bolt']

export function TransportForm({ date, onSubmit }: TransportFormProps) {
  const [method, setMethod] = useState<TransportMethod>('tarjeta')
  const [amount, setAmount] = useState<string>(String(TRANSPORT_DEFAULT_AMOUNT.tarjeta))
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function selectMethod(m: TransportMethod) {
    setMethod(m)
    const defaultAmount = TRANSPORT_DEFAULT_AMOUNT[m]
    setAmount(defaultAmount != null ? String(defaultAmount) : '')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) return
    setSubmitting(true)
    try {
      await onSubmit({ date, method, amount: parsed, note: note.trim() || null })
      setNote('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface p-3">
      <div className="flex flex-wrap gap-1.5">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => selectMethod(m)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              method === m ? 'bg-blue-500/20 text-blue-300' : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
            }`}
          >
            {TRANSPORT_METHOD_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={50}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto en Gs"
          className="w-32 shrink-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota (opcional)…"
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
