'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { Provider } from 'react-redux'
import { makeStore } from '@/store/store'

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      <Provider store={makeStore}>
        {children}
      </Provider>
    </ClerkProvider>
  )
}