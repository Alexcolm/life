import { ChevronDown, ChevronUp, ExternalLink, Link2, MapPin, Plus, Store } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { formatGs } from '../../lib/currency'
import { mapsEmbedUrl, mapsSearchUrl } from '../../lib/maps'
import type { Note, ShoppingItem } from '../../types/note'
import type { Task } from '../../types/task'

interface NoteItemProps {
  note: Note
  linkedTask: Task | null
  onUpdate: (input: Partial<Pick<Note, 'title' | 'description' | 'store' | 'items'>>) => void
  onRemove: () => void
}

export function NoteItem({ note, linkedTask, onUpdate, onRemove }: NoteItemProps) {
  if (note.type === 'compra') {
    return <ShoppingNoteCard note={note} linkedTask={linkedTask} onUpdate={onUpdate} onRemove={onRemove} />
  }
  return <TextNoteCard note={note} linkedTask={linkedTask} onUpdate={onUpdate} onRemove={onRemove} />
}

function TextNoteCard({ note, linkedTask, onUpdate, onRemove }: NoteItemProps) {
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

function ShoppingNoteCard({ note, linkedTask, onUpdate, onRemove }: NoteItemProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [editingStore, setEditingStore] = useState(false)
  const [store, setStore] = useState(note.store ?? '')
  const [showMap, setShowMap] = useState(false)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const total = note.items.reduce((sum, item) => sum + item.price, 0)

  function saveTitle() {
    setEditingTitle(false)
    if (title.trim() && title !== note.title) onUpdate({ title: title.trim() })
    else setTitle(note.title)
  }

  function saveStore() {
    setEditingStore(false)
    const trimmed = store.trim()
    if (trimmed !== (note.store ?? '')) onUpdate({ store: trimmed || null })
  }

  function handleAddItem(e: FormEvent) {
    e.preventDefault()
    const parsedPrice = Number(price)
    if (!name.trim() || !parsedPrice || parsedPrice < 0) return
    const item: ShoppingItem = { id: crypto.randomUUID(), name: name.trim(), price: parsedPrice }
    onUpdate({ items: [...note.items, item] })
    setName('')
    setPrice('')
  }

  function removeItem(id: string) {
    onUpdate({ items: note.items.filter((i) => i.id !== id) })
  }

  return (
    <li className="rounded-xl border border-app-border bg-app-surface p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="min-w-0 flex-1 rounded-lg border border-blue-400 bg-app-surface-2 px-2 py-1 text-sm font-semibold text-gray-100 outline-none"
          />
        ) : (
          <h3
            onClick={() => setEditingTitle(true)}
            className="font-display cursor-pointer text-sm font-semibold text-gray-100"
          >
            {note.title}
          </h3>
        )}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400"
          aria-label="Eliminar nota"
        >
          ✕
        </button>
      </div>

      {editingStore ? (
        <input
          autoFocus
          value={store}
          onChange={(e) => setStore(e.target.value)}
          onBlur={saveStore}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="¿Dónde vas a comprar? (nombre o dirección)"
          className="mb-2 w-full rounded-lg border border-blue-400 bg-app-surface-2 px-2 py-1 text-xs text-gray-100 outline-none"
        />
      ) : (
        <div className="mb-2 flex items-center gap-1">
          <button
            onClick={() => setEditingStore(true)}
            className="flex min-w-0 flex-1 items-center gap-1 text-xs text-gray-500 hover:text-blue-300"
          >
            <Store size={12} />
            <span className="truncate">{note.store || 'Agregar local…'}</span>
          </button>
          {note.store && (
            <>
              <a
                href={mapsSearchUrl(note.store)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Abrir en Google Maps"
                className="shrink-0 rounded p-0.5 text-gray-500 hover:text-blue-300"
              >
                <MapPin size={13} />
              </a>
              <button
                onClick={() => setShowMap((v) => !v)}
                title="Vista previa del mapa"
                className="shrink-0 rounded p-0.5 text-gray-500 hover:text-blue-300"
              >
                {showMap ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </>
          )}
        </div>
      )}

      {note.store && showMap && (
        <div className="relative mb-2 overflow-hidden rounded-lg border border-app-border">
          <iframe
            title={`Mapa de ${note.store}`}
            src={mapsEmbedUrl(note.store)}
            className="h-36 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={mapsSearchUrl(note.store)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-md bg-app-surface/90 px-1.5 py-0.5 text-[10px] text-blue-300 hover:underline"
          >
            <ExternalLink size={10} /> Abrir en Maps
          </a>
        </div>
      )}

      <ul className="mb-2 flex flex-col gap-1">
        {note.items.map((item) => (
          <li key={item.id} className="group flex items-center gap-2 text-sm">
            <span className="min-w-0 flex-1 truncate text-gray-200">{item.name}</span>
            <span className="shrink-0 font-medium text-gray-100">{formatGs(item.price)}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="shrink-0 text-gray-600 opacity-0 hover:text-red-400 group-hover:opacity-100"
              aria-label="Quitar producto"
            >
              ✕
            </button>
          </li>
        ))}
        {note.items.length === 0 && <li className="text-sm text-gray-600">Sin productos cargados.</li>}
      </ul>

      {adding ? (
        <form onSubmit={handleAddItem} className="mb-2 flex items-center gap-1.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Producto…"
            className="min-w-0 flex-1 rounded-md border border-app-border bg-app-surface-2 px-2 py-1 text-xs text-gray-100 outline-none focus:border-blue-400"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
            className="w-20 shrink-0 rounded-md border border-app-border bg-app-surface-2 px-2 py-1 text-xs text-gray-100 outline-none focus:border-blue-400"
          />
          <button type="submit" className="shrink-0 rounded-md bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-400">
            +
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mb-2 flex items-center gap-1 text-xs text-gray-500 hover:text-blue-300"
        >
          <Plus size={12} /> producto
        </button>
      )}

      <div className="flex items-center justify-between border-t border-app-border pt-1.5">
        <span className="text-xs text-gray-500">Total</span>
        <span className="text-sm font-semibold text-blue-300">{formatGs(total)}</span>
      </div>

      {linkedTask && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-blue-300/80">
          <Link2 size={12} />
          Se borra al completar: {linkedTask.title}
        </p>
      )}
    </li>
  )
}
