'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ChevronRight, ChevronLeft, Target, Clock, Lightbulb } from 'lucide-react'

interface ProfileSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

const AVAILABLE_INTERESTS = [
  'Web Development',
  'Frontend Development', 
  'Backend Development',
  'UI/UX Design',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'Blockchain',
  'Game Development'
]

const WEEKLY_HOURS_OPTIONS = [
  { value: 5, label: '5 hours/week', desc: 'Casual learning' },
  { value: 10, label: '10 hours/week', desc: 'Steady progress' },
  { value: 20, label: '20 hours/week', desc: 'Intensive learning' },
  { value: 30, label: '30+ hours/week', desc: 'Full-time focus' }
]

export function ProfileSetupModal({ open, onOpenChange, onComplete }: ProfileSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form data
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [weeklyHours, setWeeklyHours] = useState<number | null>(null)

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedInterests.length === 0) {
      toast.error('Please select at least one interest')
      return
    }
    if (currentStep === 2 && !goal.trim()) {
      toast.error('Please enter your learning goal')
      return
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!weeklyHours) {
      toast.error('Please select your available weekly hours')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          interests: selectedInterests,
          goal: goal.trim(),
          availableWeeklyHours: weeklyHours
        })
      })

      if (response.ok) {
        // Update local storage
        const updatedUser = {
          ...user,
          interests: selectedInterests,
          goal: goal.trim(),
          availableWeeklyHours: weeklyHours
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        toast.success('Profile setup completed!')
        onComplete()
        onOpenChange(false)
      } else {
        toast.error('Failed to save profile')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedInterests.length > 0
      case 2: return goal.trim().length > 0
      case 3: return weeklyHours !== null
      default: return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 w-[95vw] max-w-lg max-h-[95vh] p-0 gap-0 overflow-hidden scrollbar-modern">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
          <DialogHeader>
            <DialogTitle className="text-white text-xl sm:text-2xl font-semibold text-center">
              Complete Your Profile
            </DialogTitle>
            <div className="mt-3">
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-20 max-h-[calc(95vh-180px)]">
          {/* Step 1: Interests */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  What interests you?
                </h3>
                <p className="text-gray-400">
                  Select topics you'd like to learn about. You can choose multiple.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-2 sm:p-3 rounded-lg border transition-all text-left ${
                      selectedInterests.includes(interest)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{interest}</span>
                  </button>
                ))}
              </div>

              {selectedInterests.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Selected interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <Badge key={interest} className="bg-blue-600">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Goal */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  What's your learning goal?
                </h3>
                <p className="text-gray-400">
                  Tell us what you want to achieve with your learning journey.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-medium text-gray-300">
                  Your Learning Goal
                </Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g., Become a full-stack developer, Learn data analysis, Build my first mobile app..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">{goal.length}/200 characters</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">💡 Examples of good goals:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "Build and deploy my first web application"</li>
                  <li>• "Transition from designer to UX researcher"</li>
                  <li>• "Learn data science to advance my career"</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Weekly Hours */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  How much time can you dedicate?
                </h3>
                <p className="text-gray-400">
                  This helps us create a realistic learning schedule for you.
                </p>
              </div>

              <div className="space-y-3">
                {WEEKLY_HOURS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setWeeklyHours(option.value)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      weeklyHours === option.value
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm opacity-75">{option.desc}</p>
                      </div>
                      {weeklyHours === option.value && (
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1 sm:flex-initial"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-initial"
                size="sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Saving</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Complete Setup</span>
                    <span className="sm:hidden">Complete</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 