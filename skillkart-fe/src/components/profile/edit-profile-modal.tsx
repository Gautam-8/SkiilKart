'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Check, Loader2, User, Target, Clock } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: number
    name: string
    email: string
    interests?: string[]
    goal?: string
    availableWeeklyHours?: number
  }
  onUpdateSuccess: (updatedUser: any) => void
}

const INTEREST_OPTIONS = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'UI/UX Design', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'Game Development', 'Blockchain', 'AI/ML', 'Digital Marketing'
]

const WEEKLY_HOURS_OPTIONS = [
  { value: 5, label: '5 hours/week', description: 'Light commitment' },
  { value: 10, label: '10 hours/week', description: 'Steady progress' },
  { value: 20, label: '20 hours/week', description: 'Focused learning' },
  { value: 30, label: '30+ hours/week', description: 'Intensive study' }
]

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateSuccess
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name || '')
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || [])
  const [goal, setGoal] = useState(user.goal || '')
  const [weeklyHours, setWeeklyHours] = useState<number>(user.availableWeeklyHours || 5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when user changes
  useEffect(() => {
    setName(user.name || '')
    setSelectedInterests(user.interests || [])
    setGoal(user.goal || '')
    setWeeklyHours(user.availableWeeklyHours || 5)
    setError('')
  }, [user])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (selectedInterests.length === 0) {
      setError('Please select at least one interest')
      return
    }

    if (!goal.trim()) {
      setError('Learning goal is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          interests: selectedInterests,
          goal: goal.trim(),
          availableWeeklyHours: weeklyHours
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        onUpdateSuccess(updatedUser)
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gray-900 border-gray-700 overflow-hidden">
        <div className="max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <User className="h-6 w-6 mr-2" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-white text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Interests ({selectedInterests.length} selected)
            </Label>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTEREST_OPTIONS.map((interest) => (
                    <div
                      key={interest}
                      onClick={() => !loading && toggleInterest(interest)}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all text-center text-sm
                        ${selectedInterests.includes(interest)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center justify-center">
                        {selectedInterests.includes(interest) && (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        {interest}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-white text-sm font-medium">
              Learning Goal
            </Label>
            <Input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a full-stack developer"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Weekly Hours */}
          <div className="space-y-3">
            <Label className="text-white text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Available Weekly Hours
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WEEKLY_HOURS_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  onClick={() => !loading && setWeeklyHours(option.value)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${weeklyHours === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-center">
                    {weeklyHours === option.value && (
                      <Check className="h-4 w-4 text-blue-400 mr-2" />
                    )}
                    <div className="text-center">
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-gray-400 text-sm">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}