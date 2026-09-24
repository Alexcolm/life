import type { ScheduleItem } from '../../types/schedule'

interface ScheduleTableProps {
  items: ScheduleItem[]
  onToggle: (item: ScheduleItem) => void
  onRemove: (id: string) => void
}

export function ScheduleTable({ items, onToggle, onRemove }: ScheduleTableProps) {
  const sorted = [...items].sort((a, b) => a.time.localeCompare(b.time))

  if (sorted.length === 0) {
    return <p className="text-gray-500">No hay actividades cargadas para este día.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-app-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-app-border bg-app-surface text-left text-xs tracking-wide text-gray-500 uppercase">
            <th className="px-3 py-2">Actividad</th>
            <th className="px-3 py-2">Horario</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2 text-center">Cumplido</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.id} className="border-b border-app-border/60 bg-app-surface last:border-0">
              <td
                className={`px-3 py-2 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}
              >
                {item.activity}
              </td>
              <td className="px-3 py-2 text-blue-300">{item.time}</td>
              <td className="px-3 py-2 text-gray-400">{item.description || '—'}</td>
              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggle(item)}
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
