import { ListChecks } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { PRIORITY_LABEL, type TaskPriority } from '../../types/task'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import { useTasks } from './useTasks'

type PriorityFilter = TaskPriority | 'todas'

const FILTERS: PriorityFilter[] = ['todas', 'alta', 'media', 'baja']

export function TasksPage() {
  const {
    tasks,
    loading,
    addTask,
    toggleCompleted,
    removeTask,
    moveTask,
    updatePriority,
    updateDueDate,
    postpone,
  } = useTasks()
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('todas')
  const [hideCompleted, setHideCompleted] = useState(true)

  const visibleTasks = useMemo(() => {
    return tasks
      .map((task, index) => ({ task, index }))
      .filter(({ task }) => priorityFilter === 'todas' || task.priority === priorityFilter)
      .filter(({ task }) => !hideCompleted || !task.completed)
  }, [tasks, priorityFilter, hideCompleted])

  return (
    <div>
      <PageHeader icon={ListChecks} title="Tareas" />

      <TaskForm onSubmit={addTask} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setPriorityFilter(filter)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              priorityFilter === filter
                ? 'bg-blue-500/15 text-blue-300'
                : 'bg-app-surface-2 text-gray-400 hover:text-gray-200'
            }`}
          >
            {filter === 'todas' ? 'Todas' : PRIORITY_LABEL[filter]}
          </button>
        ))}

        <label className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            className="accent-blue-500"
          />
          Ocultar completadas
        </label>
      </div>

      {loading && <p className="text-gray-500">Cargando…</p>}

      {!loading && visibleTasks.length === 0 && (
        <p className="text-gray-500">No hay tareas para mostrar.</p>
      )}

      <ul className="flex flex-col gap-2">
        {visibleTasks.map(({ task, index }) => (
          <TaskItem
            key={task.id}
            task={task}
            canMoveUp={index > 0}
            canMoveDown={index < tasks.length - 1}
            onToggle={() => toggleCompleted(task)}
            onRemove={() => removeTask(task.id)}
            onMoveUp={() => moveTask(index, -1)}
            onMoveDown={() => moveTask(index, 1)}
            onChangePriority={(priority) => updatePriority(task.id, priority)}
            onChangeDueDate={(dueDate) => updateDueDate(task.id, dueDate)}
            onPostpone={(days) => postpone(task, days)}
          />
        ))}
      </ul>
    </div>
  )
}
