'use client'

import { KeepAlive } from './keep-alive'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KeepAlive />
      {children}
    </>
  )
} 