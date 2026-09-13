import { Link } from 'react-router-dom'
import { FREQUENCY_LABEL, PRIORITY_LABEL, type Task, type TaskPriority } from '../../types/task'

const PRIORITY_DOT: Record<Task['priority'], string> = {
  alta: 'bg-red-400',
  media: 'bg-yellow-400',
  baja: 'bg-gray-500',
}

interface TaskItemProps {
  task: Task
  canMoveUp: boolean
  canMoveDown: boolean
  onToggle: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onChangePriority: (priority: TaskPriority) => void
  onChangeDueDate: (dueDate: string | null) => void
  onPostpone: (days: number) => void
}

export function TaskItem({
  task,
  canMoveUp,
  canMoveDown,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
  onChangePriority,
  onChangeDueDate,
  onPostpone,
}: TaskItemProps) {
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-app-border bg-app-surface px-3 py-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="h-5 w-5 shrink-0 accent-blue-500"
        />

        <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
            {task.title}
          </p>
          {task.frequency !== 'ninguna' && (
            <p className="text-xs text-gray-500">{FREQUENCY_LABEL[task.frequency]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0">
        <select
          value={task.priority}
          onChange={(e) => onChangePriority(e.target.value as TaskPriority)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-1 text-xs text-gray-200 outline-none focus:border-blue-400"
        >
          {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={task.dueDate ?? ''}
          onChange={(e) => onChangeDueDate(e.target.value || null)}
          className="rounded-lg border border-app-border bg-app-surface-2 px-2 py-1 text-xs text-gray-200 outline-none focus:border-blue-400"
        />

        <button
          onClick={() => onPostpone(1)}
          className="rounded-lg bg-app-surface-2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
        >
          +1d
        </button>
        <button
          onClick={() => onPostpone(7)}
          className="rounded-lg bg-app-surface-2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
        >
          +7d
        </button>

        {task.dueDate && (
          <Link
            to={`/calendario?date=${task.dueDate}`}
            className="rounded-lg bg-app-surface-2 px-2 py-1 text-xs text-gray-400 hover:text-blue-300"
            aria-label="Ver en calendario"
          >
            📅
          </Link>
        )}

        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="rounded p-1 text-gray-500 hover:text-gray-200 disabled:opacity-20"
          aria-label="Subir prioridad"
        >
          ↑
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="rounded p-1 text-gray-500 hover:text-gray-200 disabled:opacity-20"
          aria-label="Bajar prioridad"
        >
          ↓
        </button>
        <button
          onClick={onRemove}
          className="rounded p-1 text-gray-500 hover:text-red-400"
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
