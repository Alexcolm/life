import { describeRoutine, type Routine } from '../../types/routine'

interface RoutineOccurrenceCardProps {
  routine: Routine
  done: boolean
  onToggle: () => void
}

export function RoutineOccurrenceCard({ routine, done, onToggle }: RoutineOccurrenceCardProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface px-3 py-2.5">
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-blue-500"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${done ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
          {routine.title}
        </p>
        <p className="text-xs text-gray-500">{describeRoutine(routine)}</p>
      </div>
    </li>
  )
}
