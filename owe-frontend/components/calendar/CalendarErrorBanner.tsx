type CalendarErrorBannerProps = {
  message: string
  onRetry: () => void
}

export default function CalendarErrorBanner({ message, onRetry }: CalendarErrorBannerProps) {
  return (
    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
      <button type="button" onClick={onRetry} className="ml-2 font-semibold underline">
        Retry
      </button>
    </div>
  )
}
