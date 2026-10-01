import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { transactionsCollection } from '../../firebase/firestore'
import type { Transaction } from '../../types/finance'

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
          } as Transaction
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { transactions, loading }
}
