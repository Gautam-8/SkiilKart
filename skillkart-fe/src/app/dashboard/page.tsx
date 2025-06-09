'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProfileSetupModal } from '@/components/profile/profile-setup-modal'
import EditProfileModal from '@/components/profile/edit-profile-modal'
import { GamificationStats } from '@/components/gamification/gamification-stats'
import { 
  BookOpen, 
  Target, 
  Award, 
  Clock,
  User,
  Eye
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
  type?: string
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
  const [showFlowchart, setShowFlowchart] = useState(false)
  const [selectedRoadmapForFlow, setSelectedRoadmapForFlow] = useState<Roadmap | null>(null)
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

  const handleViewFlowchart = (roadmap: Roadmap) => {
    setSelectedRoadmapForFlow(roadmap)
    setShowFlowchart(true)
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
          <div className="flex items-center justify-between py-3">
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
                  <p className="text-base text-gray-300">Welcome back, {user.name}! 👋</p>
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
                  
                  <div className="flex items-center space-x-2">
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

        {/* Your Progress & Badges Section - Now First */}
        {user && isProfileComplete && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <div className="w-6 h-6 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                  <Award className="h-4 w-4 text-white" />
                </div>
                Your Progress & Badges
              </h2>
            </div>
            <GamificationStats userId={user.id} />
          </div>
        )}

        {/* All Roadmaps Section - Recommended First */}
        {isProfileComplete && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                Learning Roadmaps
              </h2>
              <div className="text-sm text-gray-400">
                {roadmaps.length} total • {recommendedList.length} recommended for you
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Render Recommended Roadmaps First */}
              {recommendedList.map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={`recommended-${roadmap.id}`} className="relative group bg-gradient-to-br from-blue-600/15 to-blue-700/5 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 h-full flex flex-col">
                    
                    {/* Recommended Badge */}
                    <div className="absolute -top-1 -right-1 z-10">
                      <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                        ⭐ Recommended
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant="outline" 
                          className={`
                            px-2 py-1 text-xs
                            ${roadmap.difficulty === 'Beginner' ? 'border-green-500/50 text-green-400' : ''}
                            ${roadmap.difficulty === 'Intermediate' ? 'border-yellow-500/50 text-yellow-400' : ''}
                            ${roadmap.difficulty === 'Advanced' ? 'border-red-500/50 text-red-400' : ''}
                          `}
                        >
                          {roadmap.difficulty}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-gray-300">{personalizedRoadmap.personalizedDuration}</div>
                          <div className="text-xs text-gray-400">{personalizedRoadmap.estimatedWeeks} weeks</div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-base font-semibold leading-tight mb-3">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2 font-medium">Skills you'll learn</p>
                        <div className="flex flex-wrap gap-1">
                          {roadmap.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-700/30 text-blue-200 border-blue-500/50">
                              {skill}
                            </Badge>
                          ))}
                          {roadmap.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 border-blue-500/30">
                              +{roadmap.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleViewFlowchart(roadmap)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
                        >
                          Start My Journey
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {/* Render Remaining Roadmaps */}
              {roadmaps.filter(roadmap => !recommendedList.some(rec => rec.id === roadmap.id)).map((roadmap) => {
                const personalizedRoadmap = calculatePersonalizedTimeline(roadmap)
                return (
                  <Card key={roadmap.id} className="bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant="outline" 
                          className={`
                            px-2 py-1 text-xs
                            ${roadmap.difficulty === 'Beginner' ? 'border-green-500/50 text-green-400' : ''}
                            ${roadmap.difficulty === 'Intermediate' ? 'border-yellow-500/50 text-yellow-400' : ''}
                            ${roadmap.difficulty === 'Advanced' ? 'border-red-500/50 text-red-400' : ''}
                          `}
                        >
                          {roadmap.difficulty}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">{personalizedRoadmap.personalizedDuration}</div>
                          <div className="text-xs text-gray-500">{personalizedRoadmap.estimatedWeeks} weeks</div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-base font-semibold leading-tight mb-3">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {roadmap.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 border-gray-600/50">
                              {skill}
                            </Badge>
                          ))}
                          {roadmap.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 border-gray-500/30">
                              +{roadmap.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleViewFlowchart(roadmap)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600/50 text-gray-400 hover:bg-gray-700/50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                          className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors py-2.5"
                        >
                          View My Plan
                        </Button>
                      </div>
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

      {/* Flowchart Modal */}
      <Dialog open={showFlowchart} onOpenChange={setShowFlowchart}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {selectedRoadmapForFlow?.title} - Learning Path
            </DialogTitle>
          </DialogHeader>
          
                    {selectedRoadmapForFlow && (
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-4 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedRoadmapForFlow.description}</p>
                    <p className="text-gray-400 text-xs mt-2">{selectedRoadmapForFlow.steps?.length || 0} steps • {selectedRoadmapForFlow.steps?.reduce((sum, step) => sum + step.estimatedHours, 0) || 0}h</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-blue-400">{selectedRoadmapForFlow.difficulty}</div>
                    <div className="text-xs text-gray-500">Learning Path</div>
                  </div>
                </div>
              </div>

              {/* Compact Step Grid */}
              <div className="p-4 space-y-3">
                {selectedRoadmapForFlow.steps?.map((step, index) => {
                  const getStepColor = () => {
                    if (step.type?.toLowerCase().includes('video')) return 'border-l-red-400 bg-red-500/5'
                    if (step.type?.toLowerCase().includes('blog')) return 'border-l-blue-400 bg-blue-500/5'
                    if (step.type?.toLowerCase().includes('quiz')) return 'border-l-purple-400 bg-purple-500/5'
                    return 'border-l-yellow-400 bg-yellow-500/5'
                  }
                  
                  const getTypeIcon = () => {
                    if (step.type?.toLowerCase().includes('video')) return '🎥'
                    if (step.type?.toLowerCase().includes('blog')) return '📚'
                    if (step.type?.toLowerCase().includes('quiz')) return '🧩'
                    return '📝'
                  }

                  return (
                    <div 
                      key={step.id} 
                      className={`
                        group p-3 rounded-lg border-l-4 transition-all duration-200
                        hover:bg-gray-800/30 hover:scale-[1.01] cursor-pointer
                        ${getStepColor()}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Step Number */}
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        
                        {/* Type Icon */}
                        <div className="text-lg flex-shrink-0">{getTypeIcon()}</div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors truncate">
                            {step.title}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1">
                            {step.type && (
                              <span className="px-2 py-0.5 bg-gray-700/40 text-gray-300 rounded text-xs">
                                {step.type}
                              </span>
                            )}
                            <div className="flex items-center text-gray-400 text-xs">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {step.estimatedHours}h
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Dot */}
                        <div className="w-2 h-2 bg-gray-600 rounded-full flex-shrink-0"></div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Completion */}
                <div className="pt-4 text-center border-t border-gray-700/30">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-300 text-sm font-medium">Learning Path Complete</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 