'use client'

import StatCard from './StatCard'

const TotalTasks = ({ totalTask, data, isEmpty = false }) => {
  const { pendingToday } = data

  const badge = isEmpty
    ? { label: 'No tasks yet', className: 'bg-[#EEEDFE] text-[#534AB7]' }
    : pendingToday > 0
      ? { label: `${pendingToday} pending`, className: 'bg-[#EEEDFE] text-[#534AB7]' }
      : { label: `${pendingToday} pending`, className: 'bg-[#E1F5EE] text-[#0F6E56]' }

  return (
    <StatCard
      theme="purple"
      icon="clipboard"
      value={totalTask}
      label="Total tasks"
      badge={badge}
    />
  )
}

export default TotalTasks
