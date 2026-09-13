import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { routinesCollection } from '../../firebase/firestore'
import type { Routine, RoutineType } from '../../types/routine'

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(routinesCollection, orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRoutines(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            type: data.type,
            daysOfWeek: data.daysOfWeek ?? [],
            dayOfMonth: data.dayOfMonth ?? null,
            time: data.time ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as Routine
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addRoutine(input: {
    title: string
    type: RoutineType
    daysOfWeek: number[]
    dayOfMonth: number | null
    time: string | null
  }) {
    await addDoc(routinesCollection, { ...input, createdAt: serverTimestamp() })
  }

  async function removeRoutine(id: string) {
    await deleteDoc(doc(routinesCollection, id))
  }

  return { routines, loading, addRoutine, removeRoutine }
}
