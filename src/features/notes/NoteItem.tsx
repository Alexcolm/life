import { Link2 } from 'lucide-react'
import { useState } from 'react'
import type { Note } from '../../types/note'
import type { Task } from '../../types/task'

interface NoteItemProps {
  note: Note
  linkedTask: Task | null
  onUpdate: (input: { title: string; description: string }) => void
  onRemove: () => void
}

export function NoteItem({ note, linkedTask, onUpdate, onRemove }: NoteItemProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [description, setDescription] = useState(note.description)

  function save() {
    setEditing(false)
    if (title.trim() && (title !== note.title || description !== note.description)) {
      onUpdate({ title: title.trim(), description })
    } else {
      setTitle(note.title)
      setDescription(note.description)
    }
  }

  return (
    <li className="rounded-xl border border-app-border bg-app-surface p-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-2 px-2 py-1.5 text-sm font-medium text-gray-100 outline-none focus:border-blue-400"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-app-border bg-app-surface-2 px-2 py-1.5 text-sm text-gray-200 outline-none focus:border-blue-400"
          />
          <div className="flex justify-end gap-2">
            <button onClick={save} className="rounded-lg bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-400">
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => setEditing(true)} className="cursor-pointer">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-gray-100">{note.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400"
              aria-label="Eliminar nota"
            >
              ✕
            </button>
          </div>
          {note.description && (
            <p className="mb-1.5 whitespace-pre-wrap text-sm text-gray-400">{note.description}</p>
          )}
          {linkedTask && (
            <p className="flex items-center gap-1 text-xs text-blue-300/80">
              <Link2 size={12} />
              Se borra al completar: {linkedTask.title}
            </p>
          )}
        </div>
      )}
    </li>
  )
}
