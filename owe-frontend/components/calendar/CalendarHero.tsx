export default function CalendarHero() {
  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-violet-100/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEEDFE] text-primary sm:h-16 sm:w-16">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <rect x="5" y="7" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M5 13h22M11 5v4M21 5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M13 19l3 3 6-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Task proof calendar
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">Track your daily completions ✨</p>
            <div className="mt-4 inline-flex max-w-xl items-start gap-2 rounded-2xl bg-[#F3F1FE] px-4 py-3 text-xs leading-relaxed text-[#534AB7] sm:text-sm">
              <span className="mt-0.5 shrink-0" aria-hidden>
                📊
              </span>
              <span>
                Stay consistent, stay productive! Upload proofs and keep your streak going.
              </span>
            </div>
          </div>
        </div>
        <div className="hidden shrink-0 lg:block" aria-hidden>
          <div className="relative h-28 w-36 rounded-2xl bg-gradient-to-br from-[#EEEDFE] to-[#E8E4FF]">
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-90">📅</div>
          </div>
        </div>
      </div>
    </section>
  )
}
