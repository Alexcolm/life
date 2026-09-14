import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { notesCollection, tasksCollection } from '../../firebase/firestore'
import { orderBetween } from '../../lib/order'
import type { Task, TaskFrequency, TaskPriority } from '../../types/task'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(tasksCollection, orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            priority: data.priority,
            frequency: data.frequency,
            order: data.order,
            dueDate: data.dueDate ?? null,
            completed: data.completed,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
            updatedAt: data.updatedAt?.toMillis?.() ?? 0,
          } as Task
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addTask(input: {
    title: string
    priority: TaskPriority
    frequency: TaskFrequency
    dueDate: string | null
  }) {
    const lastOrder = tasks.length > 0 ? tasks[tasks.length - 1].order : null
    await addDoc(tasksCollection, {
      title: input.title,
      priority: input.priority,
      frequency: input.frequency,
      dueDate: input.dueDate,
      order: orderBetween(lastOrder, null),
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function toggleCompleted(task: Task) {
    const completed = !task.completed
    await updateDoc(doc(tasksCollection, task.id), {
      completed,
      updatedAt: serverTimestamp(),
    })

    if (completed) {
      // Las notas asociadas a una tarea son "notas de trabajo" para esa tarea:
      // pierden sentido apenas se completa, así que se borran con ella.
      const linkedNotes = await getDocs(query(notesCollection, where('taskId', '==', task.id)))
      await Promise.all(linkedNotes.docs.map((noteDoc) => deleteDoc(noteDoc.ref)))
    }
  }

  async function removeTask(id: string) {
    await deleteDoc(doc(tasksCollection, id))
  }

  async function updatePriority(id: string, priority: TaskPriority) {
    await updateDoc(doc(tasksCollection, id), { priority, updatedAt: serverTimestamp() })
  }

  async function updateDueDate(id: string, dueDate: string | null) {
    await updateDoc(doc(tasksCollection, id), { dueDate, updatedAt: serverTimestamp() })
  }

  async function postpone(task: Task, days: number) {
    const base = task.dueDate ? new Date(task.dueDate + 'T00:00:00') : new Date()
    base.setDate(base.getDate() + days)
    await updateDueDate(task.id, base.toISOString().slice(0, 10))
  }

  async function moveTask(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= tasks.length) return

    const current = tasks[index]
    const before = direction === -1 ? (tasks[targetIndex - 1] ?? null) : tasks[targetIndex]
    const after = direction === -1 ? tasks[targetIndex] : (tasks[targetIndex + 1] ?? null)

    await updateDoc(doc(tasksCollection, current.id), {
      order: orderBetween(before?.order ?? null, after?.order ?? null),
      updatedAt: serverTimestamp(),
    })
  }

  return {
    tasks,
    loading,
    addTask,
    toggleCompleted,
    removeTask,
    moveTask,
    updatePriority,
    updateDueDate,
    postpone,
  }
}
