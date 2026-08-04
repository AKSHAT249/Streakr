'use client'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  BackToDashboardLink,
  CalendarErrorBanner,
  CalendarHero,
  CalendarSkeleton,
  ProofCalendarPanel,
  buildCalendarDays,
  buildDaySummaryMap,
  hasMonthCompletionActivity,
  useCalendarMonthData,
} from '@/components/calendar'

export default function CalendarPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const { viewMonth, label, monthData, loading, fetching, error, fetchMonthData } =
    useCalendarMonthData(monthOffset)


  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), [])

  const daySummaryMap = useMemo(() => buildDaySummaryMap(monthData), [monthData])
  const hasMonthActivity = useMemo(() => hasMonthCompletionActivity(monthData), [monthData])
  const calendarDays = useMemo(() => buildCalendarDays(viewMonth), [viewMonth])

  return (
    <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6 md:p-7">
      <BackToDashboardLink />

      {loading ? (
        <CalendarSkeleton />
      ) : (
        <>
          <CalendarHero />

          {error && <CalendarErrorBanner message={error} onRetry={fetchMonthData} />}

          <ProofCalendarPanel
            monthLabel={label}
            monthOffset={monthOffset}
            viewMonth={viewMonth}
            calendarDays={calendarDays}
            todayStr={todayStr}
            daySummaryMap={daySummaryMap}
            showEmptyState={!hasMonthActivity && !error && !fetching}
            fetching={fetching}
            onPrevMonth={() => setMonthOffset((o) => o - 1)}
            onNextMonth={() => setMonthOffset((o) => o + 1)}
            onToday={() => setMonthOffset(0)}
          />
        </>
      )}
    </div>
  )
}
