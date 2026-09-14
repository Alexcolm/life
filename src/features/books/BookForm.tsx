import { ImagePlus } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { fileToCompressedDataUrl } from '../../lib/image'
import { BOOK_STATUS_LABEL, type BookStatus } from '../../types/book'

interface BookFormProps {
  onSubmit: (input: {
    title: string
    author: string | null
    status: BookStatus
    coverDataUrl: string | null
  }) => Promise<void>
}

export function BookForm({ onSubmit }: BookFormProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<BookStatus>('leyendo')
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setCoverDataUrl(await fileToCompressedDataUrl(file))
    } catch {
      setCoverDataUrl(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), author: author.trim() || null, status, coverDataUrl })
      setTitle('')
      setAuthor('')
      setStatus('leyendo')
      setCoverDataUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-xl border border-app-border bg-app-surface p-3 sm:flex-row"
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-app-border bg-app-surface-2 text-gray-500 hover:border-blue-400 hover:text-blue-300"
      >
        {coverDataUrl ? (
          <img src={coverDataUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus size={20} />
        )}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del libro…"
          className="w-full min-w-0 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Autor (opcional)"
            className="min-w-0 flex-1 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-2 text-sm text-gray-100 outline-none focus:border-blue-400"
          >
            {Object.entries(BOOK_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </div>
    </form>
  )
}
