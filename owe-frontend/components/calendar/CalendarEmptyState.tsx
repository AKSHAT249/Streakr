import Link from 'next/link'

type CalendarEmptyStateProps = {
  monthLabel: string
}

export default function CalendarEmptyState({ monthLabel }: CalendarEmptyStateProps) {
  return (
    <div className="mb-5 rounded-2xl border border-dashed border-gray-200 bg-surface px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-700">No proofs for {monthLabel}</p>
      <p className="mt-1 text-sm text-gray-500">
        Complete tasks on your dashboard and upload proof to see them here.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
