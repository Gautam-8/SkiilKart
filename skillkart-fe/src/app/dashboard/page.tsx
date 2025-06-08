'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSetupModal } from '@/components/profile/profile-setup-modal'
import EditProfileModal from '@/components/profile/edit-profile-modal'
import { GamificationStats } from '@/components/gamification/gamification-stats'
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Users,
  Sparkles,
  Clock,
  Calendar,
  User,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: number
  name: string
  email: string
  role: string
  interests?: string[]
  goal?: string
  availableWeeklyHours?: number
}

interface Roadmap {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  skills: string[]
  steps?: RoadmapStep[]
}

interface RoadmapStep {
  id: number
  title: string
  estimatedHours: number
}

interface PersonalizedRoadmap extends Roadmap {
  personalizedDuration: string
  totalHours: number
  estimatedWeeks: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const router = useRouter()

  // Helper function to calculate personalized timeline
  const calculatePersonalizedTimeline = (roadmap: Roadmap): PersonalizedRoadmap => {
    const totalHours = roadmap.steps?.reduce((sum, step) => sum + step.estimatedHours, 0) || 0
    const userWeeklyHours = user?.availableWeeklyHours || 5 // Default fallback
    const estimatedWeeks = Math.ceil(totalHours / userWeeklyHours)
    
    const personalizedDuration = totalHours > 0 
      ? `${totalHours}h total` 
      : 'Duration varies'

    return {
      ...roadmap,
      totalHours,
      estimatedWeeks,
      personalizedDuration
    }
  }

  // Get recommended roadmaps based on user interests
  const getRecommendedRoadmaps = (userInterests: string[] | null | undefined = []): Roadmap[] => {
    if (!userInterests || !Array.isArray(userInterests) || !userInterests.length) return []
    
    return roadmaps.filter(roadmap => {
      if (!roadmap.skills || !Array.isArray(roadmap.skills)) return false
      
      const roadmapKeywords = [
        roadmap.title?.toLowerCase() || '',
        roadmap.description?.toLowerCase() || '',
        ...roadmap.skills.map(skill => skill?.toLowerCase() || '')
      ].filter(Boolean)
      
      return userInterests.some(interest => 
        roadmapKeywords.some(keyword => 
          keyword.includes(interest.toLowerCase()) || 
          interest.toLowerCase().includes(keyword)
        )
      )
    }).slice(0, 3) // Show top 3 recommendations
  }

  const recommendedList = user ? getRecommendedRoadmaps(user.interests || []) : []

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (!userData || !token) {
        router.push('/')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      const isComplete = parsedUser.interests && 
                        parsedUser.goal && 
                        parsedUser.availableWeeklyHours
      
      if (!isComplete) {
        setShowProfileSetup(true)
      }

      // Load roadmaps
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const roadmapsData = await response.json()
          setRoadmaps(roadmapsData)
        }
      } catch (error) {
        console.error('Error loading roadmaps:', error)
        toast.error('Failed to load roadmaps')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setShowEditProfile(false)
    toast.success('Profile updated successfully!')
  }

  const isProfileComplete = user?.interests && user?.goal && user?.availableWeeklyHours

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SkillKart</h1>
                <p className="text-gray-400 text-sm">Your Learning Journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        {user && (
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to continue your learning journey?
            </p>
            
            {isProfileComplete && (
              <div className="bg-gray-800/50 rounded-xl p-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{user.availableWeeklyHours}h</div>
                    <div className="text-sm text-gray-400">Weekly Study Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{user.interests?.length || 0}</div>
                    <div className="text-sm text-gray-400">Interests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{roadmaps.length}</div>
                    <div className="text-sm text-gray-400">Available Roadmaps</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommended Roadmaps Section */}
        {isProfileComplete && recommendedList.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recommendedList.map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={roadmap.id} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 hover:border-blue-500/50 transition-all duration-300 shadow-lg h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant="outline" 
                          className={`
                            px-3 py-1 text-xs font-medium
                            ${roadmap.difficulty === 'Beginner' ? 'border-green-500/50 bg-green-500/10 text-green-400' : ''}
                            ${roadmap.difficulty === 'Intermediate' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : ''}
                            ${roadmap.difficulty === 'Advanced' ? 'border-red-500/50 bg-red-500/10 text-red-400' : ''}
                          `}
                        >
                          {roadmap.difficulty}
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-400 font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.personalizedDuration}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.estimatedWeeks} weeks for you
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl font-bold leading-tight">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-1">
                        {roadmap.description}
                      </p>
                      <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Skills you'll learn</p>
                        <div className="flex flex-wrap gap-2">
                          {roadmap.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 border-gray-600/50">
                              {skill}
                            </Badge>
                          ))}
                          {roadmap.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-3 py-1 bg-blue-600/20 text-blue-300 border-blue-500/30">
                              +{roadmap.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start Personalized Roadmap
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* All Available Roadmaps */}
        {isProfileComplete && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <div className="w-8 h-8 bg-gray-600/20 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              All Roadmaps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {roadmaps.map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={roadmap.id} className="bg-gray-800/30 border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/40 hover:border-gray-600/50 transition-all duration-300 shadow-md h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant="outline" 
                          className={`
                            px-3 py-1 text-xs font-medium
                            ${roadmap.difficulty === 'Beginner' ? 'border-green-500/50 bg-green-500/10 text-green-400' : ''}
                            ${roadmap.difficulty === 'Intermediate' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : ''}
                            ${roadmap.difficulty === 'Advanced' ? 'border-red-500/50 bg-red-500/10 text-red-400' : ''}
                          `}
                        >
                          {roadmap.difficulty}
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-400 font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.personalizedDuration}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.estimatedWeeks} weeks for you
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl font-bold leading-tight">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-1">
                        {roadmap.description}
                      </p>
                      {roadmap.skills && roadmap.skills.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Skills you'll learn</p>
                          <div className="flex flex-wrap gap-2">
                            {roadmap.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 border-gray-600/50">
                                {skill}
                              </Badge>
                            ))}
                            {roadmap.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs px-3 py-1 bg-gray-600/20 text-gray-400 border-gray-500/30">
                                +{roadmap.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                        className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200 py-3 font-medium"
                      >
                        <ChevronRight className="h-4 w-4 mr-2" />
                        View Personalized Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Gamification Section */}
        {isProfileComplete && user && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-yellow-400" />
              </div>
              Your Progress & Achievements
            </h2>
            <GamificationStats userId={user.id} />
          </div>
        )}

        {/* Profile Incomplete Prompt */}
        {!isProfileComplete && user && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Complete your profile to see personalized roadmap recommendations
              </p>
              <Button 
                onClick={() => setShowProfileSetup(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Complete Profile Setup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        open={showProfileSetup}
        onOpenChange={setShowProfileSetup}
        onComplete={() => {
          setShowProfileSetup(false)
          window.location.reload() // Refresh to show new recommendations
        }}
      />

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={user}
          onUpdateSuccess={handleProfileUpdate}
        />
      )}
    </div>
  )
} 