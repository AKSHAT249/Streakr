import Link from 'next/link'

export default function BackToDashboardLink() {
  return (
    <div className="mb-5">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
  )
}
