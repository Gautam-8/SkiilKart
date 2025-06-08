'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister: () => void
}

export function LoginModal({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const emailValidation = email.length > 0 ? isValidEmail(email) : true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic email format validation
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Welcome back!')
        onOpenChange(false)
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-semibold text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Email Field with Validation */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-11 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10 ${
                  email.length > 0 && !emailValidation ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter your email"
                required
              />
              {email.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailValidation ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {email.length > 0 && !emailValidation && (
              <p className="text-xs text-red-400">Please enter a valid email address</p>
            )}
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4 pt-2">
            <Button 
              type="submit" 
              disabled={loading || !emailValidation} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onSwitchToRegister} 
              className="w-full h-10 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              disabled={loading}
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 