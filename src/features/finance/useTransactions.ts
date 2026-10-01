import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { transactionsCollection } from '../../firebase/firestore'
import type { Transaction, TransactionType } from '../../types/finance'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(transactionsCollection, orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            date: data.date,
            amount: data.amount,
            currency: data.currency,
            type: data.type,
            description: data.description ?? '',
            subject: data.subject ?? '',
            source: data.source ?? 'bank',
          } as Transaction
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addManualTransaction(input: { date: number; amount: number; type: TransactionType; description: string }) {
    await addDoc(transactionsCollection, {
      ...input,
      currency: 'PYG',
      subject: '',
      source: 'manual',
    })
  }

  async function removeTransaction(id: string) {
    await deleteDoc(doc(transactionsCollection, id))
  }

  return { transactions, loading, addManualTransaction, removeTransaction }
}
