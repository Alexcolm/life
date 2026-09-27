export type TransportMethod = 'efectivo' | 'tarjeta' | 'bolt'

export const TRANSPORT_METHOD_LABEL: Record<TransportMethod, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  bolt: 'Bolt',
}

// Precio de referencia actual del pasaje en Paraguay; se autocompleta pero se puede editar.
export const TRANSPORT_DEFAULT_AMOUNT: Record<TransportMethod, number | null> = {
  efectivo: null,
  tarjeta: 2600,
  bolt: 2600,
}

export interface TransportExpense {
  id: string
  date: string // yyyy-MM-dd
  method: TransportMethod
  amount: number
  note: string | null
  createdAt: number
}
