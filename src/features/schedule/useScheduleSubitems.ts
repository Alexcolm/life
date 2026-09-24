import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { scheduleSubitemsCollection } from '../../firebase/firestore'
import { orderBetween } from '../../lib/order'
import type { ScheduleSubitem } from '../../types/schedule'

export function useScheduleSubitems() {
  const [subitems, setSubitems] = useState<ScheduleSubitem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(scheduleSubitemsCollection, orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubitems(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            itemId: data.itemId,
            title: data.title,
            order: data.order,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as ScheduleSubitem
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function byItem(itemId: string): ScheduleSubitem[] {
    return subitems.filter((s) => s.itemId === itemId)
  }

  async function addSubitem(itemId: string, title: string) {
    const siblings = byItem(itemId)
    const lastOrder = siblings.length > 0 ? siblings[siblings.length - 1].order : null
    await addDoc(scheduleSubitemsCollection, {
      itemId,
      title,
      order: orderBetween(lastOrder, null),
      createdAt: serverTimestamp(),
    })
  }

  async function removeSubitem(id: string) {
    await deleteDoc(doc(scheduleSubitemsCollection, id))
  }

  return { subitems, loading, byItem, addSubitem, removeSubitem }
}
