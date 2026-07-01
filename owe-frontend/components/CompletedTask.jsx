import React from 'react'

const CompletedTask = ({ data }) => {
  const { doneToday, diffFromYesterday } = data

  const getDiffBadge = () => {
    if (diffFromYesterday > 0) {
      return {
        label: `+${diffFromYesterday} from yesterday`,
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      }
    }

    if (diffFromYesterday < 0) {
      const count = Math.abs(diffFromYesterday)
      return {
        label: `${count} less from yesterday`,
        className: 'bg-rose-50 text-rose-700 border border-rose-200',
      }
    }

    return {
      label: 'Same as yesterday',
      className: 'bg-gray-50 text-gray-500 border border-gray-200',
    }
  }

  const badge = getDiffBadge()

  return (
    <div className="bg-white border border-black/8 rounded-xl p-4">
      <div className="text-[22px] font-semibold text-gray-900">{doneToday}</div>
      <div className="text-[11px] text-gray-400 mt-0.5">Completed today</div>
      <span
        className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-2 ${badge.className}`}
      >
        {badge.label}
      </span>
    </div>
  )
}

export default CompletedTask
