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
      {/* Enhanced Navbar with Welcome Message & Stats */}
      <header className="sticky top-0 z-40 border-b border-gray-800/50 backdrop-blur-md bg-gray-900/80">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SkillKart</h1>
                  <p className="text-gray-400 text-xs">Your Learning Journey</p>
                </div>
              </div>
              
              {/* Welcome Message on Left */}
              {user && isProfileComplete && (
                <div className="hidden lg:block">
                  <p className="text-lg font-semibold text-white">Welcome back, {user.name}! 👋</p>
                  <p className="text-sm text-gray-400">Ready to continue learning?</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Inline Stats on Right */}
              {user && isProfileComplete && (
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-lg font-bold text-blue-400">{user.availableWeeklyHours}h</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-lg font-bold text-green-400">{user.interests?.length || 0}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/achievements')}>
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-lg font-bold text-yellow-400">0</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-lg font-bold text-purple-400">{roadmaps.length}</span>
                  </div>
                </div>
              )}
              
              {user && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                    className="text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 border-gray-600/50 hover:bg-gray-800/60 hover:text-white hover:border-gray-500 transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        {/* Your Progress & Achievements Section - Now First */}
        {user && isProfileComplete && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-yellow-600 rounded-xl flex items-center justify-center mr-4">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Your Progress & Achievements
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/achievements')}
                className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-200"
              >
                <Award className="h-4 w-4 mr-2" />
                View All Achievements
              </Button>
            </div>
            <GamificationStats userId={user.id} />
          </div>
        )}

        {/* All Roadmaps Section - Recommended First */}
        {isProfileComplete && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Learning Roadmaps
              </h2>
              <div className="text-sm text-gray-400">
                {roadmaps.length} total • {recommendedList.length} recommended for you
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Render Recommended Roadmaps First */}
              {recommendedList.map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={`recommended-${roadmap.id}`} className="relative group bg-gradient-to-br from-blue-600/20 to-blue-700/10 border-blue-500/40 backdrop-blur-sm hover:from-blue-600/30 hover:to-blue-700/20 hover:border-blue-400/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 h-full flex flex-col">
                    
                    {/* Recommended Badge */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                        ⭐ Recommended
                      </div>
                    </div>
                    
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
                          <div className="flex items-center text-sm text-gray-300 font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.personalizedDuration}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {personalizedRoadmap.estimatedWeeks} weeks for you
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl font-bold leading-tight group-hover:text-blue-100 transition-colors">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-200 text-sm mb-6 leading-relaxed flex-1">
                        {roadmap.description}
                      </p>
                      <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Skills you'll learn</p>
                        <div className="flex flex-wrap gap-2">
                          {roadmap.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-blue-700/30 text-blue-200 border-blue-500/50">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start Learning Journey
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
              
              {/* Render Remaining Roadmaps */}
              {roadmaps.filter(roadmap => !recommendedList.some(rec => rec.id === roadmap.id)).map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={roadmap.id} className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300 shadow-md hover:shadow-lg h-full flex flex-col">
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
                      <CardTitle className="text-white text-lg font-bold leading-tight">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
                        {roadmap.description}
                      </p>
                      {roadmap.skills && roadmap.skills.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {roadmap.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 border-gray-600/50">
                                {skill}
                              </Badge>
                            ))}
                            {roadmap.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 border-gray-500/30">
                                +{roadmap.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                        className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-200 py-2.5 font-medium"
                      >
                        <ChevronRight className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Profile Incomplete Prompt */}
        {!isProfileComplete && user && (
          <div className="py-12">
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 border-gray-700/50 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Complete Your Profile</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Help us personalize your learning experience by completing your profile. We'll recommend the best roadmaps based on your interests and goals.
                </p>
                <Button 
                  onClick={() => setShowProfileSetup(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 font-medium"
                >
                  Complete Profile Setup
                </Button>
              </CardContent>
            </Card>
          </div>
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