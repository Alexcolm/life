import { StickyNote } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { useTasks } from '../tasks/useTasks'
import { NoteForm } from './NoteForm'
import { NoteItem } from './NoteItem'
import { useNotes } from './useNotes'

export function NotesPage() {
  const { notes, loading, addNote, updateNote, removeNote } = useNotes()
  const { tasks } = useTasks()

  const pendingTasks = tasks.filter((t) => !t.completed)
  const taskById = new Map(tasks.map((t) => [t.id, t]))

  return (
    <div>
      <PageHeader icon={StickyNote} title="Notas" />

      <NoteForm pendingTasks={pendingTasks} onSubmit={addNote} />

      {loading && <p className="text-gray-500">Cargando…</p>}
      {!loading && notes.length === 0 && <p className="text-gray-500">No tenés notas todavía.</p>}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            linkedTask={note.taskId ? (taskById.get(note.taskId) ?? null) : null}
            onUpdate={(input) => updateNote(note.id, input)}
            onRemove={() => removeNote(note.id)}
          />
        ))}
      </ul>
    </div>
  )
}
