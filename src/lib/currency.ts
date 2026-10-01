// es-PY agrupa los miles con "." (105.000), que a simple vista se puede leer como
// un decimal (105,000 -> "105"). Se usa un separador de espacio para que el monto
// completo sea inequívoco.
export function formatGs(amount: number): string {
  const grouped = new Intl.NumberFormat('en-US').format(Math.round(amount)).replace(/,/g, ' ')
  return `${grouped} Gs`
}

export function formatMoney(amount: number, currency: string): string {
  if (currency === 'PYG') return formatGs(amount)
  const grouped = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(amount)
    .replace(/,/g, ' ')
  return `${grouped} ${currency}`
}
