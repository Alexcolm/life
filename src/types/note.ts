export type NoteType = 'texto' | 'compra'

export interface ShoppingItem {
  id: string
  name: string
  price: number
}

export interface Note {
  id: string
  type: NoteType
  title: string
  description: string
  store: string | null // solo para notas tipo 'compra'
  items: ShoppingItem[] // solo para notas tipo 'compra'
  taskId: string | null
  createdAt: number
  updatedAt: number
}
