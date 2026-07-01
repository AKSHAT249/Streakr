'use client'

const TotalTasks = ({ totalTask, data }) => {
  const { pendingToday } = data

  const getPendingBadge = () => {
    if (pendingToday > 0) {
      return {
        label: `${pendingToday} pending`,
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
      }
    }

    return {
      label: `${pendingToday} pending`,
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    }
  }

  const badge = getPendingBadge()

  return (
    <div className="bg-white border border-black/8 rounded-xl p-4">
      <div className="text-[22px] font-semibold text-gray-900">{totalTask}</div>
      <div className="text-[11px] text-gray-400 mt-0.5">Total tasks</div>
      <span
        className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-2 ${badge.className}`}
      >
        {badge.label}
      </span>
    </div>
  )
}

export default TotalTasks
