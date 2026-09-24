import {
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Home,
  ListChecks,
  Repeat,
  Salad,
  StickyNote,
  Target,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/tareas', label: 'Tareas', icon: ListChecks },
  { to: '/horario', label: 'Horario', icon: Clock },
  { to: '/notas', label: 'Notas', icon: StickyNote },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/carrera', label: 'Carrera', icon: GraduationCap },
  { to: '/rutinas', label: 'Rutinas', icon: Repeat },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/nutricion', label: 'Nutrición', icon: Salad },
  { to: '/libros', label: 'Libros', icon: BookOpen },
]

export function NavBar() {
  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-10 flex gap-1 overflow-x-auto border-t border-app-border bg-app-surface/90 px-1 pt-1.5 backdrop-blur-lg
        sm:static sm:inset-auto sm:w-56 sm:flex-col sm:overflow-visible sm:border-t-0 sm:border-r sm:bg-app-surface sm:p-3 sm:pt-4"
    >
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition
             sm:w-full sm:flex-row sm:justify-start sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm ${
               isActive
                 ? 'text-blue-300 sm:bg-blue-500/15'
                 : 'text-gray-500 hover:text-gray-300 sm:hover:bg-app-surface-2'
             }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} className="sm:h-[18px] sm:w-[18px]" />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
