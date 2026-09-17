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
import { careerCollection } from '../../firebase/firestore'
import { orderBetween } from '../../lib/order'
import { buildGoalTree, type Goal } from '../../types/goal'

export function useCareer() {
  const [nodes, setNodes] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(careerCollection, orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNodes(
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

  const tree = useMemo(() => buildGoalTree(nodes), [nodes])

  async function addNode(parentId: string | null, title: string) {
    const siblings = nodes.filter((n) => n.parentId === parentId)
    const lastOrder = siblings.length > 0 ? siblings[siblings.length - 1].order : null
    await addDoc(careerCollection, {
      title,
      parentId,
      order: orderBetween(lastOrder, null),
      completed: false,
      createdAt: serverTimestamp(),
    })
  }

  async function toggleCompleted(node: Goal) {
    await updateDoc(doc(careerCollection, node.id), { completed: !node.completed })
  }

  async function removeNode(id: string) {
    const idsToDelete: string[] = [id]
    let frontier = [id]
    while (frontier.length > 0) {
      const children = nodes.filter((n) => n.parentId && frontier.includes(n.parentId))
      frontier = children.map((c) => c.id)
      idsToDelete.push(...frontier)
    }
    await Promise.all(idsToDelete.map((nodeId) => deleteDoc(doc(careerCollection, nodeId))))
  }

  return { nodes, tree, loading, addNode, toggleCompleted, removeNode }
}
