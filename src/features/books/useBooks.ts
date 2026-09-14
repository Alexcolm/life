import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { booksCollection } from '../../firebase/firestore'
import type { Book, BookStatus } from '../../types/book'

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(booksCollection, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title,
            author: data.author ?? null,
            status: data.status,
            coverDataUrl: data.coverDataUrl ?? null,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as Book
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function addBook(input: {
    title: string
    author: string | null
    status: BookStatus
    coverDataUrl: string | null
  }) {
    await addDoc(booksCollection, { ...input, createdAt: serverTimestamp() })
  }

  async function updateStatus(id: string, status: BookStatus) {
    await updateDoc(doc(booksCollection, id), { status })
  }

  async function removeBook(id: string) {
    await deleteDoc(doc(booksCollection, id))
  }

  return { books, loading, addBook, updateStatus, removeBook }
}
