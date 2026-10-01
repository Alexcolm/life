import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { budgetsCollection } from '../../firebase/firestore'
import type { Budget } from '../../types/finance'

export function useBudget(month: string) {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const ref = doc(budgetsCollection, month)
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setBudget({
          month,
          startingBalance: data.startingBalance ?? 0,
          monthlyLimit: data.monthlyLimit ?? 0,
          updatedAt: data.updatedAt?.toMillis?.() ?? 0,
        })
      } else {
        setBudget(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [month])

  async function saveBudget(input: { startingBalance: number; monthlyLimit: number }) {
    await setDoc(doc(budgetsCollection, month), { ...input, updatedAt: serverTimestamp() }, { merge: true })
  }

  return { budget, loading, saveBudget }
}
