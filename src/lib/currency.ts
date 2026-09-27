export function formatGs(amount: number): string {
  return `${new Intl.NumberFormat('es-PY').format(Math.round(amount))} Gs`
}
