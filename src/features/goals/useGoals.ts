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
import { useEffect, useMemo, useState } from 'react'
import { goalsCollection } from '../../firebase/firestore'
import { orderBetween } from '../../lib/order'
import { buildGoalTree, type Goal } from '../../types/goal'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(goalsCollection, orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGoals(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            parentId: data.parentId ?? null,
            order: data.order,
            completed: data.completed,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as Goal
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const tree = useMemo(() => buildGoalTree(goals), [goals])

  async function addGoal(parentId: string | null, title: string) {
    const siblings = goals.filter((g) => g.parentId === parentId)
    const lastOrder = siblings.length > 0 ? siblings[siblings.length - 1].order : null
    await addDoc(goalsCollection, {
      title,
      parentId,
      order: orderBetween(lastOrder, null),
      completed: false,
      createdAt: serverTimestamp(),
    })
  }

  async function toggleCompleted(goal: Goal) {
    await updateDoc(doc(goalsCollection, goal.id), { completed: !goal.completed })
  }

  async function removeGoal(id: string) {
    // Borra la meta y todas sus descendientes (sub-metas de sub-metas, etc.)
    const idsToDelete: string[] = [id]
    let frontier = [id]
    while (frontier.length > 0) {
      const children = goals.filter((g) => g.parentId && frontier.includes(g.parentId))
      frontier = children.map((c) => c.id)
      idsToDelete.push(...frontier)
    }
    await Promise.all(idsToDelete.map((goalId) => deleteDoc(doc(goalsCollection, goalId))))
  }

  return { goals, tree, loading, addGoal, toggleCompleted, removeGoal }
}
