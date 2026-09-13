export type RoutineType = 'diaria' | 'semanal' | 'mensual'

export interface Routine {
  id: string
  title: string
  type: RoutineType
  daysOfWeek: number[] // 0=Domingo … 6=Sábado (Date.getDay()), solo para 'semanal'
  dayOfMonth: number | null // 1-31, solo para 'mensual'
  time: string | null // HH:mm opcional
  createdAt: number
}

export interface RoutineCompletion {
  id: string
  routineId: string
  scheduledFor: string // yyyy-MM-dd de la ocurrencia que se está marcando
  completedAt: number
}

export const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function describeRoutine(routine: Routine): string {
  const timePart = routine.time ? ` a las ${routine.time}` : ''

  if (routine.type === 'diaria') return `Todos los días${timePart}`

  if (routine.type === 'semanal') {
    const days = routine.daysOfWeek
      .slice()
      .sort((a, b) => a - b)
      .map((d) => WEEKDAY_SHORT[d])
      .join(', ')
    return `Semanal: ${days || '(sin días elegidos)'}${timePart}`
  }

  return `Mensual: día ${routine.dayOfMonth ?? '?'}${timePart}`
}
