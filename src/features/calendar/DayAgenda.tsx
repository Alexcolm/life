import { Link } from 'react-router-dom'
import { PRIORITY_LABEL, type Task } from '../../types/task'
import type { CalendarEvent } from '../../types/event'
import { EventForm } from './EventForm'

const PRIORITY_DOT: Record<Task['priority'], string> = {
  alta: 'bg-red-400',
  media: 'bg-yellow-400',
  baja: 'bg-gray-500',
}

interface DayAgendaProps {
  dateLabel: string
  isoDate: string
  events: CalendarEvent[]
  tasks: Task[]
  onAddEvent: (input: { title: string; date: string; time: string | null; description: string | null }) => Promise<void>
  onRemoveEvent: (id: string) => void
  onToggleTask: (task: Task) => void
  onPostponeTask: (task: Task, days: number) => void
}

export function DayAgenda({
  dateLabel,
  isoDate,
  events,
  tasks,
  onAddEvent,
  onRemoveEvent,
  onToggleTask,
  onPostponeTask,
}: DayAgendaProps) {
  const sortedEvents = [...events].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))

  const priorityCounts = { alta: 0, media: 0, baja: 0 }
  for (const task of tasks) priorityCounts[task.priority] += 1

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-app-border bg-app-surface p-4">
      <h2 className="text-sm font-semibold capitalize text-gray-200">{dateLabel}</h2>

      <section>
        <h3 className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Eventos</h3>
        {sortedEvents.length === 0 && <p className="text-sm text-gray-600">Sin eventos.</p>}
        <ul className="flex flex-col gap-1.5">
          {sortedEvents.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface-2/50 px-2.5 py-1.5 text-sm"
            >
              {event.time && <span className="shrink-0 text-xs text-blue-300">{event.time}</span>}
              <span className="min-w-0 flex-1 truncate text-gray-100">{event.title}</span>
              <button
                onClick={() => onRemoveEvent(event.id)}
                className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400"
                aria-label="Eliminar evento"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <EventForm date={isoDate} onSubmit={onAddEvent} />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Tareas para hoy {tasks.length > 0 && `(${tasks.length})`}
          </h3>
          <Link to="/tareas" className="text-xs text-blue-300 hover:underline">
            Ver todas
          </Link>
        </div>

        {tasks.length > 0 && (
          <div className="mb-2 flex gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" /> {priorityCounts.alta} alta
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-400" /> {priorityCounts.media} media
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-500" /> {priorityCounts.baja} baja
            </span>
          </div>
        )}

        {tasks.length === 0 && <p className="text-sm text-gray-600">Sin tareas para este día.</p>}
        <ul className="flex flex-col gap-1.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface-2/50 px-2.5 py-1.5 text-sm"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task)}
                className="h-4 w-4 shrink-0 accent-blue-500"
              />
              <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              <span
                className={`min-w-0 flex-1 truncate ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-100'
                }`}
                title={PRIORITY_LABEL[task.priority]}
              >
                {task.title}
              </span>
              <button
                onClick={() => onPostponeTask(task, 1)}
                className="shrink-0 rounded bg-app-surface-2 px-1.5 py-0.5 text-xs text-gray-400 hover:text-gray-200"
              >
                +1d
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
