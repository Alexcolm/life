import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { eventsCollection } from '../../firebase/firestore'
import type { CalendarEvent } from '../../types/event'

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(eventsCollection, orderBy('date', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            date: data.date,
            time: data.time ?? null,
            description: data.description ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as CalendarEvent
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addEvent(input: {
    title: string
    date: string
    time: string | null
    description: string | null
  }) {
    await addDoc(eventsCollection, { ...input, createdAt: serverTimestamp() })
  }

  async function updateEvent(id: string, input: Partial<Pick<CalendarEvent, 'title' | 'date' | 'time' | 'description'>>) {
    await updateDoc(doc(eventsCollection, id), input)
  }

  async function removeEvent(id: string) {
    await deleteDoc(doc(eventsCollection, id))
  }

  return { events, loading, addEvent, updateEvent, removeEvent }
}
