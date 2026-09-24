export interface ScheduleItem {
  id: string
  date: string // yyyy-MM-dd
  time: string // HH:mm
  activity: string
  description: string
  completed: boolean
  createdAt: number
}
