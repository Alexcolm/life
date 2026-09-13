import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { nutritionLogsCollection } from '../../firebase/firestore'
import type { NutritionLog } from '../../types/nutrition'

export function useNutritionLogs() {
  const [logs, setLogs] = useState<NutritionLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(nutritionLogsCollection, orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name,
            portion: data.portion,
            calories: data.calories ?? null,
            date: data.date,
            time: data.time ?? null,
            notes: data.notes ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as NutritionLog
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addLog(input: {
    name: string
    portion: string
    calories: number | null
    date: string
    time: string | null
  }) {
    await addDoc(nutritionLogsCollection, {
      ...input,
      notes: null,
      createdAt: serverTimestamp(),
    })
  }

  async function removeLog(id: string) {
    await deleteDoc(doc(nutritionLogsCollection, id))
  }

  return { logs, loading, addLog, removeLog }
}
