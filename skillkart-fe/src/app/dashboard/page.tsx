'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, User, Clock, Target, TrendingUp, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileSetupModal } from '@/components/profile/profile-setup-modal'
import EditProfileModal from '@/components/profile/edit-profile-modal'
import { GamificationStats } from '@/components/gamification/gamification-stats'

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
  skillCategory: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  totalWeeks: number
  skills: string[]
}



export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const router = useRouter()

  // Get recommended roadmaps based on user interests
  const getRecommendedRoadmaps = (userInterests: string[] = []): Roadmap[] => {
    const interestKeywords = userInterests.map(interest => interest.toLowerCase())
    
    return roadmaps.filter(roadmap => {
      const roadmapKeywords = [
        roadmap.title.toLowerCase(),
        roadmap.skillCategory.toLowerCase(),
        roadmap.description.toLowerCase(),
        ...(roadmap.skills || []).map(skill => skill.toLowerCase())
      ]
      
      return interestKeywords.some(interest => 
        roadmapKeywords.some(keyword => keyword.includes(interest) || interest.includes(keyword))
      )
    }).slice(0, 3) // Show top 3 recommendations
  }

  const recommendedRoadmaps = user ? getRecommendedRoadmaps(user.interests) : []

  useEffect(() => {
    const loadData = async () => {
      // Get user from localStorage
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (!userData || !token) {
        router.push('/')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Check if profile is incomplete (no interests, goal, or weekly hours)
      if (!parsedUser.interests || !parsedUser.goal || !parsedUser.availableWeeklyHours) {
        setShowProfileSetup(true)
      }

      // Fetch roadmaps from backend
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const roadmapsData = await response.json()
          setRoadmaps(roadmapsData)
        } else {
          console.error('Failed to fetch roadmaps')
        }
      } catch (error) {
        console.error('Error fetching roadmaps:', error)
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
    // Recalculate recommended roadmaps with new interests
    // This will happen automatically due to the reactive nature of recommendedRoadmaps
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  const isProfileComplete = user.interests && user.goal && user.availableWeeklyHours

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SkillKart</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-white">{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <Button variant="outline" onClick={handleLogout} className="text-gray-300 border-gray-600">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-400">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Profile Completion Banner */}
        {!isProfileComplete && (
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-800 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Set up your learning preferences to get personalized roadmaps and recommendations.
                  </p>
                  <Button 
                    onClick={() => setShowProfileSetup(true)}
                    className="bg-white text-blue-900 hover:bg-gray-100"
                  >
                    Complete Setup
                  </Button>
                </div>
                <Target className="h-16 w-16 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Summary */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-lg font-semibold">Profile Summary</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditProfile(true)}
                  className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-400 transition-colors"
                >
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                {user.interests && (
                  <div>
                    <p className="text-sm text-gray-400">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {user.goal && (
                  <div>
                    <p className="text-sm text-gray-400">Goal</p>
                    <p className="text-white">{user.goal}</p>
                  </div>
                )}
                {user.availableWeeklyHours && (
                  <div>
                    <p className="text-sm text-gray-400">Weekly Hours</p>
                    <p className="text-white">{user.availableWeeklyHours} hours/week</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-lg font-semibold">Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Roadmaps</span>
                  <span className="text-2xl font-bold text-white">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Completed Steps</span>
                  <span className="text-2xl font-bold text-white">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">XP Points</span>
                  <span className="text-2xl font-bold text-blue-400">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-lg font-semibold">Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No activity yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Start your first roadmap to see activity here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Roadmaps */}
        {isProfileComplete && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recommendedRoadmaps.map((roadmap) => (
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
                        <span className="text-sm text-gray-400 font-medium">{roadmap.duration}</span>
                        <p className="text-xs text-gray-500">{roadmap.totalWeeks} weeks</p>
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
                      Start Roadmap
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {recommendedRoadmaps.length === 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No specific recommendations yet</p>
                  <p className="text-sm text-gray-500">
                    Explore all available roadmaps below
                  </p>
                </CardContent>
              </Card>
            )}
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
              {roadmaps.map((roadmap) => (
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
                        <span className="text-sm text-gray-400 font-medium">{roadmap.duration}</span>
                        <p className="text-xs text-gray-500">{roadmap.totalWeeks} weeks</p>
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
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Gamification Section */}
        {isProfileComplete && (
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

        {/* Profile Setup Modal */}
        {showProfileSetup && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recommended Roadmaps</CardTitle>
              <CardDescription className="text-gray-400">
                Based on your interests and learning goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Personalized roadmaps coming soon!</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse All Roadmaps
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isProfileComplete && (
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
          // Refresh user data after profile completion
          const userData = localStorage.getItem('user')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user!}
        onUpdateSuccess={handleProfileUpdate}
      />
    </div>
  )
} 