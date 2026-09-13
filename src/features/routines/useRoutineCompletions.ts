import { addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { routineCompletionsCollection } from '../../firebase/firestore'
import type { RoutineCompletion } from '../../types/routine'

export function useRoutineCompletions() {
  const [completions, setCompletions] = useState<RoutineCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(query(routineCompletionsCollection), (snapshot) => {
      setCompletions(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            routineId: data.routineId,
            scheduledFor: data.scheduledFor,
            completedAt: data.completedAt?.toMillis?.() ?? 0,
          } as RoutineCompletion
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function isDone(routineId: string, scheduledFor: string): boolean {
    return completions.some((c) => c.routineId === routineId && c.scheduledFor === scheduledFor)
  }

  function countFor(routineId: string): number {
    return completions.filter((c) => c.routineId === routineId).length
  }

  async function toggle(routineId: string, scheduledFor: string) {
    const existing = completions.find(
      (c) => c.routineId === routineId && c.scheduledFor === scheduledFor,
    )
    if (existing) {
      await deleteDoc(doc(routineCompletionsCollection, existing.id))
    } else {
      await addDoc(routineCompletionsCollection, {
        routineId,
        scheduledFor,
        completedAt: serverTimestamp(),
      })
    }
  }

  return { completions, loading, isDone, countFor, toggle }
}
