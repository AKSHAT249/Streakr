'use client'

const themes = {
  purple: {
    iconBg: 'bg-primary shadow-lg shadow-primary/25',
    arrow: 'bg-[#EEEDFE] text-[#534AB7]',
    wave: '#7F77DD',
  },
  green: {
    iconBg: 'bg-[#1D9E75] shadow-lg shadow-[#1D9E75]/25',
    arrow: 'bg-[#E1F5EE] text-[#0F6E56]',
    wave: '#1D9E75',
  },
  orange: {
    iconBg: 'bg-[#EF9F27] shadow-lg shadow-[#EF9F27]/25',
    arrow: 'bg-[#FAEEDA] text-[#854F0B]',
    wave: '#EF9F27',
  },
  blue: {
    iconBg: 'bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/25',
    arrow: 'bg-[#DBEAFE] text-[#1D4ED8]',
    wave: '#3B82F6',
  },
}

function WaveDecoration({ color }) {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 right-0 h-16 w-32 opacity-[0.12]"
      viewBox="0 0 120 60"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 45 C20 25 40 55 60 35 C80 15 100 50 120 30 L120 60 L0 60 Z"
        fill={color}
      />
      <path
        d="M0 55 C25 40 50 58 75 42 C95 30 110 52 120 45 L120 60 L0 60 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  )
}

function ProgressRing({ value, color, size = 48 }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#FAEEDA"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

function CardIcon({ type, theme }) {
  const t = themes[theme]

  if (type === 'ring') return null

  const icons = {
    clipboard: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
    check: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    flame: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22c4-2 6-6 6-10a6 6 0 0 0-12 0c0 4 2 8 6 10z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    ),
  }

  return (
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.iconBg}`}>
      {icons[type]}
    </div>
  )
}

export default function StatCard({
  theme = 'purple',
  icon = 'clipboard',
  value,
  label,
  badge,
  progressRing,
}) {
  const t = themes[theme]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <button
        type="button"
        aria-label={`View ${label}`}
        className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80 sm:right-4 sm:top-4 ${t.arrow}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 2l4 4-4 4" />
        </svg>
      </button>

      <WaveDecoration color={t.wave} />

      <div className="relative flex items-start gap-3 pr-8">
        {progressRing != null ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            <ProgressRing value={progressRing} color="#EF9F27" />
          </div>
        ) : (
          <CardIcon type={icon} theme={theme} />
        )}

        <div className="min-w-0 flex-1">
          <div className="text-2xl font-bold tracking-tight text-gray-900 sm:text-[28px]">
            {value}
          </div>
          <div className="mt-0.5 text-sm font-normal text-gray-500">{label}</div>
          {badge && (
            <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
