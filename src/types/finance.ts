export type TransactionType = 'income' | 'expense' | 'own' | 'unknown'

// Espejo de los campos que sube la app "openbanking" (Flutter) a Firestore,
// más los que carga uno mismo a mano (ej. gastos en efectivo sin correo).
export interface Transaction {
  id: string
  date: number // epoch ms
  amount: number // siempre positivo
  currency: string // PYG, USD...
  type: TransactionType
  description: string
  subject: string
  source: 'bank' | 'manual' // 'bank' si no viene el campo (movimientos viejos)
}

export function signedAmount(t: Transaction): number {
  if (t.type === 'expense') return -t.amount
  if (t.type === 'income') return t.amount
  return 0
}

export interface Budget {
  month: string // yyyy-MM, también el id del documento
  startingBalance: number
  monthlyLimit: number
  updatedAt: number
}
