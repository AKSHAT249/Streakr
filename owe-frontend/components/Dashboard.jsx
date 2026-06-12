'use client'

import { useEffect, useRef } from 'react'

const tasks = [
  { name: 'Review design mockups', category: 'Work',     color: '#7F77DD', catClass: 'cat-work',     days: [true,  true,  true,  false, false], pct: 60,  done: true  },
  { name: 'Morning run 5km',       category: 'Health',   color: '#1D9E75', catClass: 'cat-health',   days: [true,  false, false, false, false], pct: 20,  done: false },
  { name: 'Read 30 pages',         category: 'Personal', color: '#EF9F27', catClass: 'cat-personal', days: [true,  true,  true,  false, false], pct: 80,  done: true  },
  { name: 'React course module 2',   category: 'Learning', color: '#D85A30', catClass: 'cat-learning', days: [false, true,  false, false, false], pct: 40,  done: false },
]

const weekDays  = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13']
const todayIdx  = 2
const chartData = [55, 70, 45, 80, 60, 90, 67]
const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const catStyle: Record<string, string> = {
  Work:     'bg-[#EEEDFE] text-[#534AB7]',
  Health:   'bg-[#E1F5EE] text-[#0F6E56]',
  Personal: 'bg-[#FAEEDA] text-[#854F0B]',
  Learning: 'bg-[#FAECE7] text-[#993C1D]',
}

export default function DashboardPage() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: unknown = null

    async function loadChart() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      if (!chartRef.current) return

      chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: chartDays,
          datasets: [{
            data: chartData,
            borderColor: '#7F77DD',
            borderWidth: 2,
            pointBackgroundColor: '#7F77DD',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { bottom: number } } }) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.chartArea?.bottom ?? 200)
              g.addColorStop(0, 'rgba(127,119,221,0.18)')
              g.addColorStop(1, 'rgba(127,119,221,0)')
              return g
            },
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => c.parsed.y + '%' } },
          },
          scales: {
            y: { min: 0, max: 100, ticks: { color: '#888', font: { size: 11 }, callback: (v) => v + '%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { ticks: { color: '#888', font: { size: 11 } }, grid: { display: false } },
          },
        },
      })
    }

    loadChart()
    return () => { if (chart && typeof (chart as { destroy?: () => void }).destroy === 'function') (chart as { destroy: () => void }).destroy() }
  }, [])

  return (
    <div className="p-6 md:p-7 max-w-[1100px]">

      {/* ── Top bar ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My tasks</h1>
          <p className="text-xs text-gray-400 mt-0.5">Tuesday, 10 June 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="4" /><line x1="10" y1="10" x2="13" y2="13" />
            </svg>
            Search
          </button>
          <button className="btn-primary flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
            </svg>
            Add task
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { val: '12', lbl: 'Total tasks',      pill: '4 pending',        pillClass: 'bg-amber-50 text-amber-700' },
          { val: '8',  lbl: 'Completed today',  pill: '+3 from yesterday', pillClass: 'bg-emerald-50 text-emerald-700' },
          { val: '67%',lbl: 'Completion rate',  pill: '5-day avg',        pillClass: 'bg-amber-50 text-amber-700' },
          { val: '6',  lbl: 'Day streak',        pill: 'Personal best!',   pillClass: 'bg-emerald-50 text-emerald-700' },
        ].map(s => (
          <div key={s.lbl} className="bg-white border border-black/8 rounded-xl p-4">
            <div className="text-[22px] font-semibold text-gray-900">{s.val}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{s.lbl}</div>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 ${s.pillClass}`}>{s.pill}</span>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-black/8 rounded-xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/7">
          <span className="text-sm font-semibold text-gray-900">Task tracker</span>
          <div className="flex gap-2">
            {['All', 'Work', 'Health', 'Personal'].map((f, i) => (
              <button key={f} className={`text-[11px] px-3 py-1 rounded-full font-medium ${i === 0 ? 'bg-[#EEEDFE] text-[#534AB7]' : 'bg-[#F1EFE8] text-gray-500 hover:bg-gray-100'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-black/7">
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide w-52">Task</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide w-24">Category</th>
                {weekDays.map((d, i) => (
                  <th key={d} className={`text-center px-3 py-2.5 text-[11px] font-semibold tracking-wide w-16 ${i === todayIdx ? 'text-primary' : 'text-gray-400'}`}>
                    {d}
                  </th>
                ))}
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 tracking-wide">Progress</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.name} className="border-b border-black/5 last:border-0 hover:bg-violet-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-2 text-[12px] font-medium ${task.done ? 'line-through text-gray-300' : 'text-gray-800'}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: task.color }} />
                      {task.name}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${catStyle[task.category]}`}>
                      {task.category}
                    </span>
                  </td>
                  {task.days.map((checked, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      <div className={`w-4 h-4 rounded mx-auto flex items-center justify-center cursor-pointer transition-colors
                        ${checked ? 'bg-primary border-primary' : i === todayIdx ? 'bg-violet-50 border border-primary' : 'border border-gray-200'}`}>
                        {checked && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" />
                          </svg>
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="h-1.5 bg-violet-100 rounded-full w-20">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${task.pct}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{task.pct}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile task list */}
        <div className="md:hidden divide-y divide-black/5">
          {tasks.map(task => (
            <div key={task.name} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer flex-shrink-0
                ${task.done ? 'bg-primary' : 'border border-primary bg-violet-50'}`}>
                {task.done && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${task.done ? 'line-through text-gray-300' : 'text-gray-800'}`}>{task.name}</p>
                <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${catStyle[task.category]}`}>{task.category}</span>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="h-1 w-10 bg-violet-100 rounded-full">
                  <div className="h-1 bg-primary rounded-full" style={{ width: `${task.pct}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{task.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="bg-white border border-black/8 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Weekly progress</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Completion rate over last 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Completion %
          </div>
        </div>
        <div className="relative h-[140px] md:h-[160px]">
          <canvas ref={chartRef} />
        </div>
      </div>

    </div>
  )
}