export function formatPrice(value) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') {
    return value.startsWith('฿') ? value : `฿${Number(value).toLocaleString('th-TH')}`
  }

  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value)
}
