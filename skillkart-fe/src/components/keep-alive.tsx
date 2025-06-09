'use client'

import { useEffect } from 'react'

export function KeepAlive() {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log('Backend ping successful')
      } catch (error) {
        console.log('Backend ping failed:', error)
      }
    }

    // Ping immediately on mount
    pingBackend()

    // Set up interval to ping every 30 seconds
    const interval = setInterval(pingBackend, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  // This component doesn't render anything
  return null
} 