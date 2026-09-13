export interface NutritionLog {
  id: string
  name: string
  portion: string // texto libre asistido por chips ("1 plato mediano", "2 unidades", etc.)
  calories: number | null // estimado, no hace falta balanza
  date: string // yyyy-MM-dd
  time: string | null // HH:mm opcional
  notes: string | null
  createdAt: number
}

export const PORTION_PRESETS = [
  '1 unidad',
  '1 cucharada',
  '1 taza',
  'plato chico',
  'plato mediano',
  'plato grande',
]
