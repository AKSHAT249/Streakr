export default function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-44 rounded-3xl bg-gray-200/80" />
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex justify-between">
          <div className="h-10 w-48 rounded-xl bg-gray-200" />
          <div className="h-10 w-24 rounded-xl bg-gray-200" />
        </div>
        <div className="mb-3 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="mx-auto h-4 w-8 rounded bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] min-h-[72px] rounded-2xl bg-gray-100 sm:min-h-[88px]" />
          ))}
        </div>
      </div>
    </div>
  )
}
