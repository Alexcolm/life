import { addMonths, subMonths } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { useTasks } from '../tasks/useTasks'
import { DayAgenda } from './DayAgenda'
import { MonthGrid } from './MonthGrid'
import { useEvents } from './useEvents'
import { MONTH_LABELS, toISODate } from '../../lib/date'

export function CalendarPage() {
  const [searchParams] = useSearchParams()
  const requestedDate = searchParams.get('date')
  const initialDate = requestedDate ? new Date(requestedDate + 'T00:00:00') : new Date()

  const [monthDate, setMonthDate] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState(() => toISODate(initialDate))

  const { events, loading: loadingEvents, addEvent, removeEvent } = useEvents()
  const { tasks, loading: loadingTasks, toggleCompleted, postpone } = useTasks()

  const markersByDate = useMemo(() => {
    type DayMarkers = {
      eventCount: number
      taskCount: number
      taskByPriority: { alta: number; media: number; baja: number }
    }
    const emptyMarkers = (): DayMarkers => ({
      eventCount: 0,
      taskCount: 0,
      taskByPriority: { alta: 0, media: 0, baja: 0 },
    })
    const map = new Map<string, DayMarkers>()

    for (const event of events) {
      const entry = map.get(event.date) ?? emptyMarkers()
      entry.eventCount += 1
      map.set(event.date, entry)
    }

    for (const task of tasks) {
      if (!task.dueDate || task.completed) continue
      const entry = map.get(task.dueDate) ?? emptyMarkers()
      entry.taskCount += 1
      entry.taskByPriority[task.priority] += 1
      map.set(task.dueDate, entry)
    }

    return map
  }, [events, tasks])

  const dayEvents = events.filter((e) => e.date === selectedDate)
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate)

  const dateLabel = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(selectedDate + 'T00:00:00'))

  return (
    <div>
      <PageHeader icon={CalendarDays} title="Calendario" />

      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonthDate((d) => subMonths(d, 1))}
          className="rounded-lg bg-app-surface-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-100">
            {MONTH_LABELS[monthDate.getMonth()]} {monthDate.getFullYear()}
          </span>
          <button
            onClick={() => {
              const today = new Date()
              setMonthDate(today)
              setSelectedDate(toISODate(today))
            }}
            className="rounded-lg bg-app-surface-2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
          >
            Hoy
          </button>
        </div>

        <button
          onClick={() => setMonthDate((d) => addMonths(d, 1))}
          className="rounded-lg bg-app-surface-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white"
        >
          Siguiente →
        </button>
      </div>

      {(loadingEvents || loadingTasks) && <p className="mb-2 text-gray-500">Cargando…</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <MonthGrid
          monthDate={monthDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markersByDate={markersByDate}
        />

        <DayAgenda
          dateLabel={dateLabel}
          isoDate={selectedDate}
          events={dayEvents}
          tasks={dayTasks}
          onAddEvent={addEvent}
          onRemoveEvent={removeEvent}
          onToggleTask={toggleCompleted}
          onPostponeTask={postpone}
        />
      </div>
    </div>
  )
}
