import type { NutritionLog } from '../../types/nutrition'

interface LogEntryItemProps {
  log: NutritionLog
  onRemove: () => void
}

export function LogEntryItem({ log, onRemove }: LogEntryItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-100">{log.name}</p>
        <p className="text-xs text-gray-500">{log.portion}</p>
      </div>

      {log.calories !== null && (
        <span className="shrink-0 rounded-full bg-app-surface-2 px-2 py-0.5 text-xs text-blue-300">
          {log.calories} kcal
        </span>
      )}

      <button
        onClick={onRemove}
        className="shrink-0 rounded p-1 text-gray-500 hover:text-red-400"
        aria-label="Eliminar registro"
      >
        ✕
      </button>
    </li>
  )
}
