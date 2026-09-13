export type TaskPriority = 'alta' | 'media' | 'baja'

export type TaskFrequency = 'ninguna' | 'diaria' | 'semanal' | 'mensual'

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  frequency: TaskFrequency
  order: number
  dueDate: string | null // ISO date (yyyy-MM-dd), pensado para cruzarse con el calendario más adelante
  completed: boolean
  createdAt: number
  updatedAt: number
}

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const FREQUENCY_LABEL: Record<TaskFrequency, string> = {
  ninguna: 'Sin frecuencia',
  diaria: 'Diaria',
  semanal: 'Semanal',
  mensual: 'Mensual',
}
