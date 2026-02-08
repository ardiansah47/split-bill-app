export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount)
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded)
  return `Rp ${formatted}`
}

export function parseRupiahInput(value: string): number {
  const cleaned = value.replace(/\D/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}
