import { useState, type FormEvent } from 'react'

interface ResourceFormProps {
  onAddLink: (label: string, url: string) => Promise<void>
  onAddImage: (label: string, file: File) => Promise<void>
  onAddPdf: (label: string, file: File) => Promise<void>
}

export function ResourceForm({ onAddLink, onAddImage, onAddPdf }: ResourceFormProps) {
  const [mode, setMode] = useState<'link' | 'file'>('link')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!label.trim()) return
    setSubmitting(true)
    try {
      if (mode === 'link') {
        if (!url.trim()) return
        await onAddLink(label.trim(), url.trim())
        setUrl('')
      } else if (file) {
        if (file.type === 'application/pdf') {
          await onAddPdf(label.trim(), file)
        } else if (file.type.startsWith('image/')) {
          await onAddImage(label.trim(), file)
        } else {
          setError('Solo se aceptan imágenes o PDF.')
          return
        }
        setFile(null)
      } else {
        return
      }
      setLabel('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo adjuntar el recurso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 rounded-lg bg-app-surface-2/60 p-2">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode('link')}
          className={`rounded-full px-2 py-0.5 text-[11px] ${mode === 'link' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500'}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`rounded-full px-2 py-0.5 text-[11px] ${mode === 'file' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500'}`}
        >
          Imagen / PDF
        </button>
      </div>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nombre del recurso…"
        className="rounded-md border border-app-border bg-app-surface px-2 py-1 text-xs text-gray-100 outline-none focus:border-blue-400"
      />

      {mode === 'link' ? (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          type="url"
          className="rounded-md border border-app-border bg-app-surface px-2 py-1 text-xs text-gray-100 outline-none focus:border-blue-400"
        />
      ) : (
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs text-gray-400 file:mr-2 file:rounded-md file:border-0 file:bg-app-surface file:px-2 file:py-1 file:text-xs file:text-gray-300"
        />
      )}

      {error && <p className="text-[11px] text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !label.trim() || (mode === 'link' ? !url.trim() : !file)}
        className="self-start rounded-md bg-blue-500 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-400 disabled:opacity-50"
      >
        Adjuntar
      </button>
    </form>
  )
}
