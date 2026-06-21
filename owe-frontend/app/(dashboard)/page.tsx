'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignIn, SignUp, useAuth, useUser } from '@clerk/nextjs';
import { useDispatch } from "react-redux";


export default function DashboardHomePage() {
  const { isSignedIn, isLoaded } = useAuth();

  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (isSignedIn) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Taskly</h1>
          <p className="mt-1 text-sm text-gray-400">
            {mode === 'sign-in' ? 'Sign in to manage your tasks' : 'Create an account to get started'}
          </p>
        </div>

        <div className="mb-6 flex rounded-lg bg-white p-1 shadow-sm border border-black/8">
          <button
            type="button"
            onClick={() => setMode('sign-in')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'sign-in' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('sign-up')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'sign-up' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign up
          </button>
        </div>

        {mode === 'sign-in' ? (
          <SignIn
            routing="hash"
            signUpUrl="#sign-up"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          />
        ) : (
          <SignUp
            routing="hash"
            signInUrl="#sign-in"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          />
        )}
      </div>
    </div>
  )
}
