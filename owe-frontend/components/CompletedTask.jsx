'use client'

import StatCard from './StatCard'

const CompletedTask = ({ data, isEmpty = false }) => {
  const { doneToday, diffFromYesterday } = data

  const badge = isEmpty
    ? { label: 'No completions yet', className: 'bg-[#E1F5EE] text-[#0F6E56]' }
    : diffFromYesterday > 0
      ? { label: `+${diffFromYesterday} from yesterday`, className: 'bg-[#E1F5EE] text-[#0F6E56]' }
      : diffFromYesterday < 0
        ? {
            label: `${Math.abs(diffFromYesterday)} less from yesterday`,
            className: 'bg-rose-50 text-rose-600',
          }
        : { label: 'Same as yesterday', className: 'bg-gray-50 text-gray-500' }

  return (
    <StatCard
      theme="green"
      icon="check"
      value={doneToday}
      label="Completed today"
      badge={badge}
    />
  )
}

export default CompletedTask
