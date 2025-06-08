'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target,
  PlayCircle,
  Award,
  Calendar
} from 'lucide-react'
import { DiscussionThreads } from '@/components/roadmap/discussion-threads'

interface RoadmapStep {
  id: number
  title: string
  description: string
  type: 'video' | 'article' | 'quiz' | 'project'
  duration?: string
  completed: boolean
  resources?: Array<{
    title: string
    url: string
    type: 'video' | 'article' | 'documentation'
  }>
  week?: number
}

interface Roadmap {
  id: number
  title: string
  description: string
  skillCategory: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string
  skills?: string[]
  steps?: RoadmapStep[]
}

export default function RoadmapViewer() {
  const { id } = useParams()
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [steps, setSteps] = useState<RoadmapStep[]>([])
  const [currentWeek, setCurrentWeek] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getWeekSteps = (week: number) => {
    return steps.filter(step => step.week === week)
  }

  const totalWeeks = Math.max(...steps.map(step => step.week || 1), 1)

  useEffect(() => {
    const loadRoadmapWithProgress = async () => {
      // Check authentication
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (!userData || !token) {
        router.push('/')
        return
      }

      setUser(JSON.parse(userData))

      try {
        // Fetch roadmap data from backend
        const roadmapResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!roadmapResponse.ok) {
          setError('Roadmap not found')
          setLoading(false)
          return
        }

        const roadmapData = await roadmapResponse.json()

        // Fetch roadmap steps
        const stepsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${id}/steps`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!stepsResponse.ok) {
          setError('Failed to load roadmap steps')
          setLoading(false)
          return
        }

        const stepsData = await stepsResponse.json()

        // Try to get user's progress
        let userProgress: any[] = []
        try {
          const progressResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-roadmaps/roadmap/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (progressResponse.ok) {
            const userRoadmapData = await progressResponse.json()
            userProgress = userRoadmapData.progress || []
          }
        } catch (progressError) {
          console.log('No progress data found, starting fresh')
        }

        // Merge progress with steps data
        const stepsWithProgress = stepsData.map((step: any) => {
          const progressEntry = userProgress.find((p: any) => p.stepId === step.id)
          return {
            ...step,
            completed: progressEntry?.status === 'COMPLETED',
            resources: step.resources || []
          }
        })

        setRoadmap(roadmapData)
        setSteps(stepsWithProgress)
        setLoading(false)
      } catch (error) {
        console.error('Error loading roadmap:', error)
        setError('Failed to load roadmap')
        setLoading(false)
      }
    }

    loadRoadmapWithProgress()
  }, [id, router])

  const toggleStepCompletion = async (stepId: number) => {
    if (!roadmap) return
    
    try {
      const token = localStorage.getItem('token')
      const stepToUpdate = steps.find(step => step.id === stepId)
      
      if (!stepToUpdate) return
      
      const newStatus = stepToUpdate.completed ? 'IN_PROGRESS' : 'COMPLETED'
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-roadmaps/roadmap/${id}/step-progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stepId,
          status: newStatus
        })
      })

      if (response.ok) {
        // Update local state
        setSteps(prevSteps => 
          prevSteps.map(step => 
            step.id === stepId ? { ...step, completed: !step.completed } : step
          )
        )
      } else {
        console.error('Failed to update progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getOverallProgress = () => {
    if (steps.length === 0) return 0
    const completedSteps = steps.filter(step => step.completed).length
    return Math.round((completedSteps / steps.length) * 100)
  }

  const getWeekProgress = (week: number) => {
    const weekSteps = getWeekSteps(week)
    if (weekSteps.length === 0) return 0
    const completed = weekSteps.filter(step => step.completed).length
    return Math.round((completed / weekSteps.length) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-4">{error || 'Roadmap not found'}</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentWeekSteps = getWeekSteps(currentWeek)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{roadmap.title}</h1>
                <p className="text-gray-400 text-sm">{roadmap.skillCategory}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`
                px-3 py-1 text-sm font-medium
                ${roadmap.difficulty === 'Beginner' ? 'border-green-500/50 bg-green-500/10 text-green-400' : ''}
                ${roadmap.difficulty === 'Intermediate' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : ''}
                ${roadmap.difficulty === 'Advanced' ? 'border-red-500/50 bg-red-500/10 text-red-400' : ''}
              `}
            >
              {roadmap.difficulty}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-400" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{getOverallProgress()}%</div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentWeek}</div>
                  <div className="text-sm text-gray-400">of {totalWeeks} weeks</div>
                </div>
              </div>
              <Award className="h-12 w-12 text-yellow-500" />
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Week Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Weeks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`
                      w-full p-4 rounded-lg text-left transition-all duration-200
                      ${currentWeek === week 
                        ? 'bg-blue-600/20 border-blue-500/50 border' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Week {week}</span>
                      <span className="text-xs text-gray-400">{getWeekProgress(week)}%</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Week {week} Content</p>
                    <Progress value={getWeekProgress(week)} className="h-1" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Week Header */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    Week {currentWeek}
                  </CardTitle>
                  {roadmap.description && (
                    <p className="text-gray-300">{roadmap.description}</p>
                  )}
                </CardHeader>
              </Card>

              {/* Steps */}
              <div className="space-y-4">
                {currentWeekSteps.length === 0 ? (
                  <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-400">No steps available for Week {currentWeek}</p>
                    </CardContent>
                  </Card>
                ) : (
                  currentWeekSteps.map((step, index) => (
                    <Card 
                      key={step.id} 
                      className={`
                        border transition-all duration-300 shadow-lg
                        ${step.completed 
                          ? 'bg-green-900/20 border-green-500/30' 
                          : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/60'
                        }
                      `}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <button
                            onClick={() => toggleStepCompletion(step.id)}
                            className="mt-1"
                          >
                            {step.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-green-400" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-400 hover:text-blue-400 transition-colors" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-lg font-semibold ${step.completed ? 'text-green-300' : 'text-white'}`}>
                                {step.title}
                              </h3>
                              <div className="flex items-center space-x-3">
                                {step.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {step.type}
                                  </Badge>
                                )}
                                {step.duration && (
                                  <div className="flex items-center text-gray-400 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {step.duration}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{step.description}</p>
                            
                            {step.resources && step.resources.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">Resources</p>
                                <div className="space-y-2">
                                  {step.resources.map((resource, resourceIndex) => (
                                    <Button
                                      key={resourceIndex}
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                                    >
                                      <PlayCircle className="h-4 w-4 mr-2" />
                                      {resource.title}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Section */}
        <div className="mt-12">
          <DiscussionThreads roadmapId={roadmap.id} />
        </div>
      </div>
    </div>
  )
}