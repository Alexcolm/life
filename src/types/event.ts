export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date, yyyy-MM-dd
  time: string | null // HH:mm, null = todo el día
  description: string | null
  createdAt: number
}
