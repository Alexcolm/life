import { addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { scheduleCompletionsCollection } from '../../firebase/firestore'
import type { ScheduleCompletion } from '../../types/schedule'

export function useScheduleCompletions() {
  const [completions, setCompletions] = useState<ScheduleCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(query(scheduleCompletionsCollection), (snapshot) => {
      setCompletions(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            itemId: data.itemId,
            date: data.date,
            completedAt: data.completedAt?.toMillis?.() ?? 0,
          } as ScheduleCompletion
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function isDone(itemId: string, date: string): boolean {
    return completions.some((c) => c.itemId === itemId && c.date === date)
  }

  async function toggle(itemId: string, date: string) {
    const existing = completions.find((c) => c.itemId === itemId && c.date === date)
    if (existing) {
      await deleteDoc(doc(scheduleCompletionsCollection, existing.id))
    } else {
      await addDoc(scheduleCompletionsCollection, { itemId, date, completedAt: serverTimestamp() })
    }
  }

  return { completions, loading, isDone, toggle }
}
