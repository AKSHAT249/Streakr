'use client'

import StatCard from './StatCard'

const DayStreak = ({ streak = 0, isEmpty = false }) => {
  const badge = isEmpty
    ? { label: 'Start your streak today!', className: 'bg-[#DBEAFE] text-[#1D4ED8]' }
    : streak > 0
      ? { label: 'Personal best!', className: 'bg-[#DBEAFE] text-[#1D4ED8]' }
      : { label: 'Start your streak today!', className: 'bg-[#DBEAFE] text-[#1D4ED8]' }

  return (
    <StatCard
      theme="blue"
      icon="flame"
      value={streak}
      label="Day streak"
      badge={badge}
    />
  )
}

export default DayStreak
