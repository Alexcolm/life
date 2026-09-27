import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { transportExpensesCollection } from '../../firebase/firestore'
import type { TransportExpense, TransportMethod } from '../../types/transport'

export function useTransportExpenses() {
  const [expenses, setExpenses] = useState<TransportExpense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(transportExpensesCollection, orderBy('date', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            date: data.date,
            method: data.method,
            amount: data.amount,
            note: data.note ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as TransportExpense
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addExpense(input: { date: string; method: TransportMethod; amount: number; note: string | null }) {
    await addDoc(transportExpensesCollection, { ...input, createdAt: serverTimestamp() })
  }

  async function updateExpense(id: string, patch: Partial<Pick<TransportExpense, 'amount' | 'method' | 'note'>>) {
    await updateDoc(doc(transportExpensesCollection, id), patch)
  }

  async function removeExpense(id: string) {
    await deleteDoc(doc(transportExpensesCollection, id))
  }

  return { expenses, loading, addExpense, updateExpense, removeExpense }
}
