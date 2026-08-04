import type { Dayjs } from 'dayjs'
import type { DaySummary } from './types'
import DayProofCollage from './DayProofCollage'

type CalendarDayCellProps = {
  day: Dayjs
  viewMonthIndex: number
  todayStr: string
  summary?: DaySummary
}

export default function CalendarDayCell({ day, viewMonthIndex, todayStr, summary }: CalendarDayCellProps) {
  const dateKey = day.format('YYYY-MM-DD')
  const inCurrentMonth = day.month() === viewMonthIndex
  const isToday = dateKey === todayStr
  const proofImages = summary?.imageUrls ?? []
  const hasProofImages = inCurrentMonth && proofImages.length > 0

  return (
    <div
      className={`relative flex min-h-[72px] flex-col rounded-2xl border p-2 transition-colors sm:min-h-[88px] sm:p-3 ${
        !inCurrentMonth
          ? 'border-transparent bg-gray-50/80 text-gray-300'
          : isToday
            ? 'border-primary bg-[#F3F1FE]/80 shadow-[0_0_0_1px_rgba(127,119,221,0.25)]'
            : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <span
        className={`text-sm font-semibold sm:text-base ${
          inCurrentMonth ? (isToday ? 'text-primary' : 'text-gray-800') : 'text-gray-300'
        }`}
      >
        {day.date()}
      </span>

      {hasProofImages && (
        <div className="mt-auto flex justify-end pt-1 sm:pt-2">
          <DayProofCollage imageUrls={proofImages} />
        </div>
      )}

      {inCurrentMonth && summary && summary.doneCount > 0 && !summary.hasImage && (
        <span
          className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-success sm:bottom-3 sm:right-3"
          title="Tasks completed"
        />
      )}
    </div>
  )
}
