import type { Routine } from '../../types/routine'

export function isRoutineDueOn(routine: Routine, date: Date): boolean {
  switch (routine.type) {
    case 'diaria':
      return true
    case 'semanal':
      return routine.daysOfWeek.includes(date.getDay())
    case 'mensual':
      return routine.dayOfMonth === date.getDate()
  }
}
