import { AlarmClockCheck, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { ScheduleItem, ScheduleSubitem } from '../../types/schedule'

interface ScheduleTableProps {
  items: ScheduleItem[]
  date: string
  isDone: (id: string, date: string) => boolean
  onToggleDone: (id: string, date: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, patch: Partial<Pick<ScheduleItem, 'time' | 'activity'>>) => void
  onShiftFrom: (item: ScheduleItem, actualTime: string) => void
  subitemsByItem: Map<string, ScheduleSubitem[]>
  onAddSubitem: (itemId: string, title: string) => void
  onRemoveSubitem: (id: string) => void
}

interface EditableCellProps {
  value: string
  type?: 'text' | 'time'
  className?: string
  onSave: (value: string) => void
}

function EditableCell({ value, type = 'text', className, onSave }: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function save() {
    setEditing(false)
    const trimmed = type === 'text' ? draft.trim() : draft
    if (trimmed && trimmed !== value) onSave(trimmed)
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
        className="w-full min-w-0 rounded-md border border-blue-400 bg-app-surface-2 px-2 py-1 text-sm text-gray-100 outline-none"
      />
    )
  }

  return (
    <button
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
      className={`w-full rounded-md px-2 py-1 text-left hover:bg-app-surface-2 ${className ?? ''}`}
    >
      {value}
    </button>
  )
}

function ShiftFromControl({ item, onShiftFrom }: { item: ScheduleItem; onShiftFrom: (item: ScheduleItem, actualTime: string) => void }) {
  const [open, setOpen] = useState(false)
  const [actualTime, setActualTime] = useState(item.time)

  function apply() {
    if (actualTime && actualTime !== item.time) {
      onShiftFrom(item, actualTime)
    }
    setOpen(false)
  }

  if (open) {
    return (
      <div className="mt-1 flex items-center gap-1">
        <input
          autoFocus
          type="time"
          value={actualTime}
          onChange={(e) => setActualTime(e.target.value)}
          className="rounded-md border border-blue-400 bg-app-surface-2 px-1.5 py-0.5 text-xs text-gray-100 outline-none"
        />
        <button
          onClick={apply}
          className="rounded-md bg-blue-500 px-1.5 py-0.5 text-xs text-white hover:bg-blue-400"
        >
          Ajustar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        setActualTime(item.time)
        setOpen(true)
      }}
      className="mt-1 flex items-center gap-1 text-[11px] text-gray-600 hover:text-blue-300"
      title="Marcar hora real y correr el resto del día"
    >
      <AlarmClockCheck size={12} /> hora real
    </button>
  )
}

function SubitemChecklist({
  item,
  date,
  subitems,
  isDone,
  onToggleDone,
  onAdd,
  onRemove,
}: {
  item: ScheduleItem
  date: string
  subitems: ScheduleSubitem[]
  isDone: (id: string, date: string) => boolean
  onToggleDone: (id: string, date: string) => void
  onAdd: (itemId: string, title: string) => void
  onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(item.id, title.trim())
    setTitle('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-1 py-1">
      {subitems.map((sub) => (
        <label key={sub.id} className="group flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={isDone(sub.id, date)}
            onChange={() => onToggleDone(sub.id, date)}
            className="h-3.5 w-3.5 shrink-0 accent-blue-500"
          />
          <span className={isDone(sub.id, date) ? 'text-gray-500 line-through' : 'text-gray-400'}>
            {sub.title}
          </span>
          <button
            onClick={() => onRemove(sub.id)}
            className="text-gray-600 opacity-0 hover:text-red-400 group-hover:opacity-100"
            aria-label="Quitar mini actividad"
          >
            ✕
          </button>
        </label>
      ))}

      {adding ? (
        <form onSubmit={handleAdd} className="flex items-center gap-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => !title.trim() && setAdding(false)}
            placeholder="Mini actividad…"
            className="min-w-0 flex-1 rounded-md border border-app-border bg-app-surface-2 px-2 py-0.5 text-xs text-gray-100 outline-none focus:border-blue-400"
          />
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex w-fit items-center gap-1 text-xs text-gray-600 hover:text-blue-300"
        >
          <Plus size={11} /> mini actividad
        </button>
      )}
    </div>
  )
}

export function ScheduleTable({
  items,
  date,
  isDone,
  onToggleDone,
  onRemove,
  onUpdate,
  onShiftFrom,
  subitemsByItem,
  onAddSubitem,
  onRemoveSubitem,
}: ScheduleTableProps) {
  const sorted = [...items].sort((a, b) => a.time.localeCompare(b.time))

  if (sorted.length === 0) {
    return <p className="text-gray-500">No hay actividades cargadas para este día.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-app-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-app-border bg-app-surface text-left text-xs tracking-wide text-gray-500 uppercase">
            <th className="px-2 py-2">Actividad</th>
            <th className="px-2 py-2">Horario</th>
            <th className="px-2 py-2">Descripción</th>
            <th className="px-2 py-2 text-center">Cumplido</th>
            <th className="px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
            const done = isDone(item.id, date)
            return (
              <tr key={item.id} className="border-b border-app-border/60 bg-app-surface align-top last:border-0">
                <td className={`px-1 py-2 ${done ? 'opacity-50' : ''}`}>
                  <EditableCell
                    value={item.activity}
                    className={done ? 'text-gray-500 line-through' : 'text-gray-100'}
                    onSave={(v) => onUpdate(item.id, { activity: v })}
                  />
                </td>
                <td className="px-1 py-2">
                  <EditableCell
                    value={item.time}
                    type="time"
                    className="text-blue-300"
                    onSave={(v) => onUpdate(item.id, { time: v })}
                  />
                  <ShiftFromControl item={item} onShiftFrom={onShiftFrom} />
                </td>
                <td className="px-2 py-1">
                  <SubitemChecklist
                    item={item}
                    date={date}
                    subitems={subitemsByItem.get(item.id) ?? []}
                    isDone={isDone}
                    onToggleDone={onToggleDone}
                    onAdd={onAddSubitem}
                    onRemove={onRemoveSubitem}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onToggleDone(item.id, date)}
                    className="h-4 w-4 accent-blue-500"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="rounded p-1 text-gray-500 hover:text-red-400"
                    aria-label="Eliminar actividad"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
