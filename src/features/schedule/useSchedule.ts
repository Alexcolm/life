import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { scheduleCollection } from '../../firebase/firestore'
import { minutesToTime, timeToMinutes } from '../../lib/time'
import type { ScheduleItem } from '../../types/schedule'

export function useSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(scheduleCollection, orderBy('time', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            time: data.time,
            activity: data.activity,
            description: data.description ?? '',
            recurring: !!data.recurring,
            date: data.date ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as ScheduleItem
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addItem(input: {
    time: string
    activity: string
    description: string
    recurring: boolean
    date: string | null
  }) {
    await addDoc(scheduleCollection, { ...input, createdAt: serverTimestamp() })
  }

  async function updateItem(
    id: string,
    patch: Partial<Pick<ScheduleItem, 'time' | 'activity' | 'description'>>,
  ) {
    await updateDoc(doc(scheduleCollection, id), patch)
  }

  async function removeItem(id: string) {
    await deleteDoc(doc(scheduleCollection, id))
  }

  /**
   * Marca la hora real de una actividad y corre todo lo que viene después (dentro de
   * `dayItems`, el horario del día visible) por el mismo desfasaje, para conservar
   * los mismos intervalos entre actividades.
   */
  async function shiftFrom(dayItems: ScheduleItem[], anchor: ScheduleItem, actualTime: string) {
    const delta = timeToMinutes(actualTime) - timeToMinutes(anchor.time)
    if (delta === 0) return

    const anchorMinutes = timeToMinutes(anchor.time)
    const toShift = dayItems.filter((i) => timeToMinutes(i.time) >= anchorMinutes)

    await Promise.all(
      toShift.map((i) =>
        updateDoc(doc(scheduleCollection, i.id), {
          time: minutesToTime(timeToMinutes(i.time) + delta),
        }),
      ),
    )
  }

  return { items, loading, addItem, updateItem, removeItem, shiftFrom }
}
