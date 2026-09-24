export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// No envuelve a las 24hs: si un desfasaje empuja una actividad a la madrugada del
// día siguiente (ej. 23:00 + 5h = "28:00"), se conserva ese valor para que siga
// ordenando después de todo lo demás en vez de "volver" a mostrarse a la mañana.
export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, minutes)
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
