import { Repeat } from 'lucide-react'
import { useMemo } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { toISODate } from '../../lib/date'
import { describeRoutine } from '../../types/routine'
import { isRoutineDueOn } from './occurrences'
import { RoutineForm } from './RoutineForm'
import { RoutineOccurrenceCard } from './RoutineOccurrenceCard'
import { useRoutineCompletions } from './useRoutineCompletions'
import { useRoutines } from './useRoutines'

export function RoutinesPage() {
  const { routines, loading, addRoutine, removeRoutine } = useRoutines()
  const { isDone, countFor, toggle } = useRoutineCompletions()

  const today = useMemo(() => new Date(), [])
  const todayISO = toISODate(today)

  const dueToday = routines.filter((r) => isRoutineDueOn(r, today))

  return (
    <div>
      <PageHeader icon={Repeat} title="Rutinas" />

      <RoutineForm onSubmit={addRoutine} />

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-gray-300">Hoy</h2>
        {loading && <p className="text-gray-500">Cargando…</p>}
        {!loading && dueToday.length === 0 && (
          <p className="text-gray-500">No tenés rutinas programadas para hoy.</p>
        )}
        <ul className="flex flex-col gap-2">
          {dueToday.map((routine) => (
            <RoutineOccurrenceCard
              key={routine.id}
              routine={routine}
              done={isDone(routine.id, todayISO)}
              onToggle={() => toggle(routine.id, todayISO)}
            />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-300">Todas las rutinas</h2>
        {!loading && routines.length === 0 && (
          <p className="text-gray-500">Todavía no creaste ninguna rutina.</p>
        )}
        <ul className="flex flex-col gap-2">
          {routines.map((routine) => (
            <li
              key={routine.id}
              className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-100">{routine.title}</p>
                <p className="text-xs text-gray-500">{describeRoutine(routine)}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-500">
                {countFor(routine.id)} veces cumplida
              </span>
              <button
                onClick={() => removeRoutine(routine.id)}
                className="shrink-0 rounded p-1 text-gray-500 hover:text-red-400"
                aria-label="Eliminar rutina"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
