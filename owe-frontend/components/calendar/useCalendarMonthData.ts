'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { getMonthBounds } from './utils'
import type { MonthTaskRow } from './types'

export function useCalendarMonthData(monthOffset: number) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [monthData, setMonthData] = useState<MonthTaskRow[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const bounds = useMemo(() => getMonthBounds(monthOffset), [monthOffset])
  const { startDate, endDate } = bounds

  const fetchMonthData = useCallback(async () => {
    const userId = user?.id
    if (!userId) return

    const requestId = ++requestIdRef.current
    setFetching(true)
    setError(null)

    try {
      const token = await getToken()
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/week`,
        { startDate, endDate },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      )
      if (requestId !== requestIdRef.current) return
      setMonthData(Array.isArray(result.data) ? result.data : [])
    } catch {
      if (requestId !== requestIdRef.current) return
      setError('Could not load calendar data. Please try again.')
      setMonthData([])
    } finally {
      if (requestId === requestIdRef.current) {
        setFetching(false)
        setInitialLoading(false)
      }
    }
  }, [user?.id, getToken, startDate, endDate])

  useEffect(() => {
    if (!user?.id) return

    let cancelled = false

    void (async () => {
      await Promise.resolve()
      if (cancelled) return
      await fetchMonthData()
    })()

    return () => {
      cancelled = true
      requestIdRef.current += 1
    }
  }, [user?.id, fetchMonthData])

  return {
    ...bounds,
    monthData,
    loading: initialLoading,
    fetching,
    error,
    fetchMonthData,
  }
}
