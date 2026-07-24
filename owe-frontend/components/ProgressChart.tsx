'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface ChartDay {
  day: string
  completed: number
  total: number
  isToday?: boolean
}

interface ProgressChartProps {
  chartData: ChartDay[]
}

interface TooltipPayload {
  payload: ChartDay
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  const { completed, total } = payload[0].payload

  return (
    <div className="rounded-lg border border-black/8 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold text-gray-900">{label}</p>
      <p className="mt-0.5 text-[11px] text-gray-500">
        {completed} of {total} task{total === 1 ? '' : 's'} done
      </p>
    </div>
  )
}

export default function ProgressChart({ chartData }: ProgressChartProps) {
  const maxY = useMemo(() => {
    const peak = Math.max(...chartData.map((d) => d.completed), 0)
    const total = chartData[0]?.total ?? 0
    return Math.max(peak, total, 1)
  }, [chartData])

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Weekly progress</h2>
          <p className="mt-0.5 text-[11px] text-gray-400">Tasks completed each day this week</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-[#C4BFF5]" />
            Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-primary" />
            Today
          </span>
        </div>
      </div>

      <div className="h-[180px] w-full sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#888' }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, maxY]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#888' }}
              width={32}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(127,119,221,0.06)' }}
            />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.day}-${index}`}
                  fill={entry.isToday ? '#7F77DD' : '#C4BFF5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
