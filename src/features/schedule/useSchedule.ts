import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { scheduleCollection } from '../../firebase/firestore'
import type { ScheduleItem } from '../../types/schedule'

export function useSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(scheduleCollection, orderBy('date', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            date: data.date,
            time: data.time,
            activity: data.activity,
            description: data.description ?? '',
            completed: !!data.completed,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as ScheduleItem
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addItem(input: { date: string; time: string; activity: string; description: string }) {
    await addDoc(scheduleCollection, { ...input, completed: false, createdAt: serverTimestamp() })
  }

  async function toggleCompleted(item: ScheduleItem) {
    await updateDoc(doc(scheduleCollection, item.id), { completed: !item.completed })
  }

  async function removeItem(id: string) {
    await deleteDoc(doc(scheduleCollection, id))
  }

  return { items, loading, addItem, toggleCompleted, removeItem }
}
