'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallbackPath?: string
}

export function AuthGuard({ 
  children, 
  requireAdmin = false, 
  fallbackPath = '/' 
}: AuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      // Check if user is logged in
      if (!userData || !token) {
        toast.error('Please login to access this page')
        router.push(fallbackPath)
        return
      }

      const parsedUser = JSON.parse(userData)

      // Check admin role if required
      if (requireAdmin && parsedUser.role !== 'Admin') {
        toast.error('Access denied. Admin privileges required.')
        router.push('/dashboard')
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requireAdmin, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Verifying Access...</div>
        </div>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}

// Usage examples:
// <AuthGuard>{children}</AuthGuard> - Requires auth
// <AuthGuard requireAdmin>{children}</AuthGuard> - Requires admin role
// <AuthGuard fallbackPath="/login">{children}</AuthGuard> - Custom redirect 