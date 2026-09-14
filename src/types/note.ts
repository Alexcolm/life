export interface Note {
  id: string
  title: string
  description: string
  taskId: string | null
  createdAt: number
  updatedAt: number
}
