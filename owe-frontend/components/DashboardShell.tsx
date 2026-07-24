'use client'

import { useAuth } from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded || !isSignedIn) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
