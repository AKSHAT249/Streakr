import dayjs, { type Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { formatLocalYMD } from '@/utils/date'
import type { DaySummaryMap, MonthTaskRow } from './types'

dayjs.extend(isoWeek)

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function toLocalYMD(isoString: string) {
  return formatLocalYMD(isoString)
}

export function getMonthBounds(monthOffset: number) {
  const anchor = dayjs().add(monthOffset, 'month')
  return {
    viewMonth: anchor,
    startDate: anchor.startOf('month').format('YYYY-MM-DD'),
    endDate: anchor.endOf('month').format('YYYY-MM-DD'),
    label: anchor.format('MMMM YYYY'),
  }
}

export function buildCalendarDays(viewMonth: Dayjs) {
  const start = viewMonth.startOf('month').startOf('isoWeek')
  const end = viewMonth.endOf('month').endOf('isoWeek')
  const days: Dayjs[] = []
  let cursor = start
  while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
    days.push(cursor)
    cursor = cursor.add(1, 'day')
  }
  return days
}

export function buildDaySummaryMap(monthData: MonthTaskRow[]): DaySummaryMap {
  const map: DaySummaryMap = {}
  for (const row of monthData) {
    if (!row.date) continue
    const key = toLocalYMD(row.date)
    if (!map[key]) {
      map[key] = { proofCount: 0, hasImage: false, doneCount: 0, imageUrls: [] }
    }
    if (row.is_done) map[key].doneCount += 1
    if (row.image_url) {
      map[key].hasImage = true
      map[key].proofCount += 1
      if (!map[key].imageUrls.includes(row.image_url)) {
        map[key].imageUrls.push(row.image_url)
      }
    }
  }
  return map
}

export function hasMonthCompletionActivity(monthData: MonthTaskRow[]) {
  return monthData.some((row) => row.date != null)
}
