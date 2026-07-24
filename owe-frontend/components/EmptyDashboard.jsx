'use client'

function FeatureCard({ theme, icon, title, description }) {
  const styles = {
    purple: {
      bg: 'bg-[#F8F7FF]',
      iconBg: 'bg-primary shadow-lg shadow-primary/20',
      arrow: 'bg-[#EEEDFE] text-[#534AB7]',
    },
    green: {
      bg: 'bg-[#F3FBF8]',
      iconBg: 'bg-[#1D9E75] shadow-lg shadow-[#1D9E75]/20',
      arrow: 'bg-[#E1F5EE] text-[#0F6E56]',
    },
    orange: {
      bg: 'bg-[#FFFAF3]',
      iconBg: 'bg-[#EF9F27] shadow-lg shadow-[#EF9F27]/20',
      arrow: 'bg-[#FAEEDA] text-[#854F0B]',
    },
  }

  const s = styles[theme]

  const icons = {
    tasks: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${s.bg}`}>
      <button
        type="button"
        aria-label={title}
        className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full ${s.arrow}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 2l4 4-4 4" />
        </svg>
      </button>
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
        {icons[icon]}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  )
}

export default function EmptyDashboard({ onAddTask }) {
  return (
    <div className="mb-5 space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          {/* Illustration */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-[#F8F7FF] to-[#F3FBF8] px-8 py-10 lg:w-[42%] lg:py-12">
            <div className="relative w-full max-w-[220px]">
              <div className="absolute -left-2 top-2 text-lg">✨</div>
              <div className="absolute -right-1 top-8 text-sm">✨</div>
              <div className="mx-auto flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 border-[#C4BFF5] bg-white shadow-md">
                <div className="mb-2 h-3 w-10 rounded-full bg-[#EEEDFE]" />
                <div className="space-y-2 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border border-[#7F77DD] bg-[#EEEDFE]" />
                    <div className="h-1.5 w-12 rounded bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border border-gray-200" />
                    <div className="h-1.5 w-10 rounded bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border border-gray-200" />
                    <div className="h-1.5 w-14 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-0 h-10 w-8 rounded-full bg-[#E1F5EE]" />
              <div className="absolute -bottom-1 right-2 h-12 w-10 rounded-full bg-[#EEEDFE]" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 lg:py-10">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Your productivity journey starts here! ✨
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
              You haven&apos;t added any tasks yet. Start by adding your first activity and build the habit of getting things done.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={onAddTask}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="7" y1="1" x2="7" y2="13" />
                  <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                Add your first task
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="1" y="1" width="5" height="5" rx="1" />
                  <rect x="8" y="1" width="5" height="5" rx="1" />
                  <rect x="1" y="8" width="5" height="5" rx="1" />
                  <rect x="8" y="8" width="5" height="5" rx="1" />
                </svg>
                Explore sample tasks
              </button>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="border-t border-gray-100 px-6 py-3 sm:px-8">
          <p className="flex items-start gap-2 text-xs text-gray-400 sm:text-sm">
            <span>💡</span>
            <span>Tip: Break your day into small tasks and track your progress easily.</span>
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          theme="purple"
          icon="tasks"
          title="Add your tasks"
          description="List down your tasks and organize by categories."
        />
        <FeatureCard
          theme="green"
          icon="calendar"
          title="Track daily"
          description="Mark tasks as done and add proof to stay consistent."
        />
        <FeatureCard
          theme="orange"
          icon="chart"
          title="See your progress"
          description="View insights and celebrate your achievements."
        />
      </div>
    </div>
  )
}
