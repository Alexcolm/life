export type BookStatus = 'leyendo' | 'pendiente' | 'terminado'

export interface Book {
  id: string
  title: string
  author: string | null
  status: BookStatus
  coverDataUrl: string | null
  createdAt: number
}

export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  leyendo: 'Leyendo',
  pendiente: 'Pendiente',
  terminado: 'Terminado',
}
