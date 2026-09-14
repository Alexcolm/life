import { BookOpen } from 'lucide-react'
import { BOOK_STATUS_LABEL, type Book, type BookStatus } from '../../types/book'

const STATUS_COLOR: Record<BookStatus, string> = {
  leyendo: 'bg-blue-500/15 text-blue-300',
  pendiente: 'bg-gray-700/40 text-gray-300',
  terminado: 'bg-green-500/15 text-green-300',
}

interface BookItemProps {
  book: Book
  onChangeStatus: (status: BookStatus) => void
  onRemove: () => void
}

export function BookItem({ book, onChangeStatus, onRemove }: BookItemProps) {
  return (
    <li className="flex gap-3 rounded-xl border border-app-border bg-app-surface p-3">
      <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-app-surface-2 text-gray-600">
        {book.coverDataUrl ? (
          <img src={book.coverDataUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <BookOpen size={22} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="truncate text-sm font-medium text-gray-100">{book.title}</p>
          {book.author && <p className="truncate text-xs text-gray-500">{book.author}</p>}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={book.status}
            onChange={(e) => onChangeStatus(e.target.value as BookStatus)}
            className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${STATUS_COLOR[book.status]}`}
          >
            {Object.entries(BOOK_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value} className="bg-app-surface text-gray-100">
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={onRemove}
            className="ml-auto rounded p-1 text-gray-500 hover:text-red-400"
            aria-label="Eliminar libro"
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  )
}
