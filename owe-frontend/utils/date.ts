/** Calendar date in the user's local timezone (YYYY-MM-DD). */
export function formatLocalYMD(value: Date | string | null | undefined): string {
  if (value == null || value === '') return ''

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) {
    return typeof value === 'string' ? value.slice(0, 10) : ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
