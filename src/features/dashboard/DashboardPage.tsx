import { CalendarDays, Flame, ListChecks, Repeat, Salad, Target } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { toISODate } from '../../lib/date'
import { useEvents } from '../calendar/useEvents'
import { goalProgress } from '../../types/goal'
import { useGoals } from '../goals/useGoals'
import { useNutritionLogs } from '../nutrition/useNutritionLogs'
import { isRoutineDueOn } from '../routines/occurrences'
import { useRoutineCompletions } from '../routines/useRoutineCompletions'
import { useRoutines } from '../routines/useRoutines'
import { PRIORITY_LABEL, type TaskPriority } from '../../types/task'
import { useTasks } from '../tasks/useTasks'

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { alta: 0, media: 1, baja: 2 }
const PRIORITY_DOT: Record<TaskPriority, string> = {
  alta: 'bg-red-400',
  media: 'bg-yellow-400',
  baja: 'bg-gray-500',
}

export function DashboardPage() {
  const today = useMemo(() => new Date(), [])
  const todayISO = toISODate(today)

  const { tasks, toggleCompleted: toggleTask } = useTasks()
  const { routines } = useRoutines()
  const { isDone: isRoutineDone, toggle: toggleRoutine } = useRoutineCompletions()
  const { events } = useEvents()
  const { logs } = useNutritionLogs()
  const { tree: goalTree } = useGoals()

  const greetingDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today)

  const routinesToday = routines.filter((r) => isRoutineDueOn(r, today))
  const routinesDoneCount = routinesToday.filter((r) => isRoutineDone(r.id, todayISO)).length

  const todayTasks = tasks
    .filter((t) => t.dueDate === todayISO)
    .sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority])

  const nextEvent = events
    .filter((e) => e.date >= todayISO)
    .sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')))[0]

  const todayLogs = logs.filter((l) => l.date === todayISO)
  const todayCalories = todayLogs.reduce((sum, l) => sum + (l.calories ?? 0), 0)

  const topGoal = goalTree[0]

  return (
    <div>
      <p className="mb-1 text-sm text-gray-500 capitalize">{greetingDate}</p>
      <h1 className="mb-5 font-display text-2xl font-bold text-gray-100">Tu resumen</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card title="Rutinas de hoy" icon={Repeat} to="/rutinas">
          {routinesToday.length === 0 ? (
            <p className="text-sm text-gray-500">Nada programado para hoy.</p>
          ) : (
            <>
              <p className="mb-2 text-xs text-gray-500">
                {routinesDoneCount}/{routinesToday.length} cumplidas
              </p>
              <ul className="flex flex-col gap-1.5">
                {routinesToday.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isRoutineDone(r.id, todayISO)}
                      onChange={() => toggleRoutine(r.id, todayISO)}
                      className="h-4 w-4 shrink-0 accent-blue-500"
                    />
                    <span
                      className={`truncate ${
                        isRoutineDone(r.id, todayISO) ? 'text-gray-500 line-through' : 'text-gray-200'
                      }`}
                    >
                      {r.title}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card title="Tareas de hoy" icon={ListChecks} to="/tareas">
          {todayTasks.length === 0 ? (
            <p className="text-sm text-gray-500">No tenés tareas para hoy.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {todayTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                    className="h-4 w-4 shrink-0 accent-blue-500"
                  />
                  <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-200'
                    }`}
                    title={PRIORITY_LABEL[task.priority]}
                  >
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Calendario" icon={CalendarDays} to="/calendario">
          {nextEvent ? (
            <div className="text-sm">
              <p className="text-gray-200">{nextEvent.title}</p>
              <p className="text-xs text-gray-500">
                {nextEvent.date === todayISO ? 'Hoy' : nextEvent.date}
                {nextEvent.time && ` · ${nextEvent.time}`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin próximos eventos.</p>
          )}
        </Card>

        <Card title="Nutrición" icon={Salad} to="/nutricion">
          <p className="text-sm text-gray-200">
            {todayLogs.length > 0 ? (
              <>
                <span className="font-medium text-blue-300">{todayCalories} kcal</span> estimadas hoy
                <span className="text-gray-500"> · {todayLogs.length} registros</span>
              </>
            ) : (
              <span className="text-gray-500">Todavía no registraste nada hoy.</span>
            )}
          </p>
        </Card>

        <Card title="Metas" icon={Target} to="/metas">
          {topGoal ? (
            <div>
              <p className="mb-1.5 truncate text-sm text-gray-200">{topGoal.title}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-app-surface-2">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.round(goalProgress(topGoal) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Todavía no creaste ninguna meta.</p>
          )}
        </Card>

        <Link
          to="/rutinas"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-app-border p-4 text-sm text-gray-500 hover:border-blue-500/40 hover:text-blue-300"
        >
          <Flame size={18} />
          Seguí sumando rutinas y tareas cumplidas cada día.
        </Link>
      </div>
    </div>
  )
}
