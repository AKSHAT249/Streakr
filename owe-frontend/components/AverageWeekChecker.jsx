'use client'

import StatCard from './StatCard'

const AverageWeekChecker = ({ data, isEmpty = false }) => {
  const { completionRate } = data

  const badge = isEmpty
    ? { label: 'No data yet', className: 'bg-[#FAEEDA] text-[#854F0B]' }
    : completionRate >= 70
      ? { label: '7 day avg', className: 'bg-[#E1F5EE] text-[#0F6E56]' }
      : completionRate >= 40
        ? { label: '7 day avg', className: 'bg-[#FAEEDA] text-[#854F0B]' }
        : { label: '7 day avg', className: 'bg-rose-50 text-rose-600' }

  return (
    <StatCard
      theme="orange"
      icon="ring"
      value={`${completionRate}%`}
      label="Completion rate"
      badge={badge}
      progressRing={isEmpty ? 0 : completionRate}
    />
  )
}

export default AverageWeekChecker
