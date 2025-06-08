'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, ArrowLeft } from 'lucide-react'
import { GamificationStats } from '@/components/gamification/gamification-stats'

export default function AchievementsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
      return
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              Achievements & Progress
            </h1>
            <div></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-400">
            Track your learning progress, view earned badges, and see your XP growth.
          </p>
        </div>

        {/* Gamification Stats */}
        <GamificationStats userId={user.id} />

        {/* Tips Card */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-white">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Earn More XP</h4>
                <ul className="text-sm space-y-1">
                  <li>• Complete roadmap steps consistently</li>
                  <li>• Finish entire roadmaps for bonus XP</li>
                  <li>• Participate in community discussions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Unlock Badges</h4>
                <ul className="text-sm space-y-1">
                  <li>• "Getting Started" - Complete your first step</li>
                  <li>• "Roadmap Finisher" - Complete an entire roadmap</li>
                  <li>• "Streak Master" - Maintain a 5-day streak</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 