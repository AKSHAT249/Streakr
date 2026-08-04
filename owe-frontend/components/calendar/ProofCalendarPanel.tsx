import type { Dayjs } from 'dayjs'
import type { DaySummaryMap } from './types'
import { WEEKDAY_LABELS } from './utils'
import CalendarDayCell from './CalendarDayCell'
import CalendarEmptyState from './CalendarEmptyState'

type ProofCalendarPanelProps = {
  monthLabel: string
  monthOffset: number
  viewMonth: Dayjs
  calendarDays: Dayjs[]
  todayStr: string
  daySummaryMap: DaySummaryMap
  showEmptyState: boolean
  fetching?: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export default function ProofCalendarPanel({
  monthLabel,
  monthOffset,
  viewMonth,
  calendarDays,
  todayStr,
  daySummaryMap,
  showEmptyState,
  fetching = false,
  onPrevMonth,
  onNextMonth,
  onToday,
}: ProofCalendarPanelProps) {
  const viewMonthIndex = viewMonth.month()

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/30 hover:bg-[#F3F1FE] hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4L6 8l4 4" />
            </svg>
          </button>
          <h2 className="min-w-[160px] text-center text-lg font-semibold text-gray-900 sm:text-xl">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/30 hover:bg-[#F3F1FE] hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={onToday}
          disabled={monthOffset === 0}
          className="inline-flex h-10 items-center justify-center gap-2 self-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-primary/30 hover:bg-[#F3F1FE] disabled:cursor-default disabled:opacity-50 sm:self-auto"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2" y="3" width="12" height="11" rx="1.5" />
            <path d="M5 1v3M11 1v3M2 6.5h12" strokeLinecap="round" />
          </svg>
          Today
        </button>
      </div>

      {showEmptyState && <CalendarEmptyState monthLabel={monthLabel} />}

      <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400 sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className={`grid grid-cols-7 gap-1 transition-opacity sm:gap-2 ${fetching ? 'pointer-events-none opacity-50' : ''}`}
      >
        {calendarDays.map((day) => (
          <CalendarDayCell
            key={day.format('YYYY-MM-DD')}
            day={day}
            viewMonthIndex={viewMonthIndex}
            todayStr={todayStr}
            summary={daySummaryMap[day.format('YYYY-MM-DD')]}
          />
        ))}
      </div>
    </section>
  )
}
