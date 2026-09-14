import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { notesCollection } from '../../firebase/firestore'
import type { Note } from '../../types/note'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(notesCollection, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            taskId: data.taskId ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
            updatedAt: data.updatedAt?.toMillis?.() ?? 0,
          } as Note
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addNote(input: { title: string; description: string; taskId: string | null }) {
    await addDoc(notesCollection, {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function updateNote(
    id: string,
    input: Partial<{ title: string; description: string; taskId: string | null }>,
  ) {
    await updateDoc(doc(notesCollection, id), { ...input, updatedAt: serverTimestamp() })
  }

  async function removeNote(id: string) {
    await deleteDoc(doc(notesCollection, id))
  }

  return { notes, loading, addNote, updateNote, removeNote }
}
