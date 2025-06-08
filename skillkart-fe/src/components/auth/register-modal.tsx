'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ open, onOpenChange, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'Learner' | 'Admin'>('Learner')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)
    const hasMinLength = password.length >= 8

    return {
      hasNumber,
      hasUppercase,
      hasSymbol,
      hasMinLength,
      isValid: hasNumber && hasUppercase && hasSymbol && hasMinLength
    }
  }

  const passwordValidation = validatePassword(password)
  const emailValidation = email.length > 0 ? isValidEmail(email) : true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email format
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate password strength
    if (!passwordValidation.isValid) {
      toast.error('Please meet all password requirements')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await response.json()

      if (response.ok) {
        // Auto-login after successful registration
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Account created successfully!')
        onOpenChange(false)
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Registration failed')
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
          <DialogTitle className="text-white text-2xl font-semibold text-center">Create Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

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
                placeholder="Create a password"
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
            
            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="mt-2">
                <p className={`text-xs ${passwordValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                </p>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-300">
              Account Type
            </Label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'Learner' | 'Admin')}
                className="w-full h-11 bg-gray-800/50 border border-gray-600 text-white rounded-md px-3 py-2 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-gray-800/70"
                required
              >
                <option value="Learner" className="bg-gray-800 text-white py-2">Learner</option>
                <option value="Admin" className="bg-gray-800 text-white py-2">Content Curator (Admin)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4 pt-2">
            <Button 
              type="submit" 
              disabled={loading || !emailValidation || !passwordValidation.isValid} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onSwitchToLogin} 
              className="w-full h-10 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              disabled={loading}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 