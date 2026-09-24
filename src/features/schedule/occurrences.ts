import { toISODate } from '../../lib/date'
import type { ScheduleItem } from '../../types/schedule'

/** Lunes a viernes = recurrentes; sábado/domingo solo muestran ítems puntuales de esa fecha. */
export function getScheduleItemsForDate(items: ScheduleItem[], date: Date): ScheduleItem[] {
  const day = date.getDay() // 0=Domingo … 6=Sábado
  const isWeekend = day === 0 || day === 6
  const iso = toISODate(date)

  return items.filter((item) => (item.recurring ? !isWeekend : item.date === iso))
}
