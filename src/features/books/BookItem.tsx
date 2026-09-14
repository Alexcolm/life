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
    <li className="flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface">
      <div className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-app-surface-2 text-gray-600">
        {book.coverDataUrl ? (
          <img src={book.coverDataUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <BookOpen size={40} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate text-sm font-medium text-gray-100">{book.title}</p>
          {book.author && <p className="truncate text-xs text-gray-500">{book.author}</p>}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <select
            value={book.status}
            onChange={(e) => onChangeStatus(e.target.value as BookStatus)}
            className={`min-w-0 flex-1 rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${STATUS_COLOR[book.status]}`}
          >
            {Object.entries(BOOK_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value} className="bg-app-surface text-gray-100">
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={onRemove}
            className="shrink-0 rounded p-1 text-gray-500 hover:text-red-400"
            aria-label="Eliminar libro"
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  )
}
