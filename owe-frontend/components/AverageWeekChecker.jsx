import React from 'react'

const AverageWeekChecker = ({ data }) => {
  const { completionRate } = data

  const getAvgBadge = () => {
    if (completionRate >= 70) {
      return {
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      }
    }

    if (completionRate >= 40) {
      return {
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
      }
    }

    return {
      className: 'bg-rose-50 text-rose-700 border border-rose-200',
    }
  }

  const badge = getAvgBadge()

  return (
    <div className="bg-white border border-black/8 rounded-xl p-4">
      <div className="text-[22px] font-semibold text-gray-900">{completionRate}%</div>
      <div className="text-[11px] text-gray-400 mt-0.5">Completion rate</div>
      <span
        className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-2 ${badge.className}`}
      >
        7 day avg
      </span>
    </div>
  )
}

export default AverageWeekChecker
