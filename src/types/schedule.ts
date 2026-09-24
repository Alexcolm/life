export interface ScheduleItem {
  id: string
  time: string // HH:mm
  activity: string
  description: string
  recurring: boolean // true = todos los días de semana (Lun-Vie), false = fecha puntual
  date: string | null // yyyy-MM-dd, solo cuando recurring=false
  createdAt: number
}

export interface ScheduleCompletion {
  id: string
  itemId: string // id de un ScheduleItem o de un ScheduleSubitem
  date: string // yyyy-MM-dd de la ocurrencia puntual que se marca
  completedAt: number
}

export interface ScheduleSubitem {
  id: string
  itemId: string // ScheduleItem al que pertenece
  title: string
  order: number
  createdAt: number
}
