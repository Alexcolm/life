import { BookOpen } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { BookForm } from './BookForm'
import { BookItem } from './BookItem'
import { useBooks } from './useBooks'

export function BooksPage() {
  const { books, loading, addBook, updateStatus, removeBook } = useBooks()

  return (
    <div>
      <PageHeader icon={BookOpen} title="Libros" />

      <BookForm onSubmit={addBook} />

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && books.length === 0 && <p className="text-gray-500">Todavía no cargaste libros.</p>}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onChangeStatus={(status) => updateStatus(book.id, status)}
            onRemove={() => removeBook(book.id)}
          />
        ))}
      </ul>
    </div>
  )
}
