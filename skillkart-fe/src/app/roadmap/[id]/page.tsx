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
  Calendar,
  User
} from 'lucide-react'
import { DiscussionThreads } from '@/components/roadmap/discussion-threads'
import { toast } from 'sonner'

interface RoadmapStep {
  id: number
  title: string
  description: string
  type: string
  estimatedHours: number
  completed: boolean
  learningObjectives?: string
  resources?: Array<{
    title: string
    url: string
    type: 'video' | 'article' | 'documentation'
  }>
  weekNumbers?: number[] // Which weeks this step spans
}

interface Roadmap {
  id: number
  title: string
  description: string
  difficulty: string
  skills: string[]
  steps?: RoadmapStep[]
}

interface User {
  id: number
  name: string
  email: string
  role: string
  availableWeeklyHours?: number
}

interface WeekData {
  weekNumber: number
  steps: RoadmapStep[]
  totalHours: number
  progressPercentage: number
}

export default function RoadmapViewer() {
  const { id } = useParams()
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [loadingSteps, setLoadingSteps] = useState<Set<number>>(new Set())
  const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set())
  const [changingWeek, setChangingWeek] = useState(false)
  const [navigating, setNavigating] = useState(false)

  // Calculate personalized timeline
  const calculatePersonalizedTimeline = () => {
    if (!roadmap?.steps || !user?.availableWeeklyHours) return { totalHours: 0, estimatedWeeks: 0 }
    
    const totalHours = roadmap.steps.reduce((sum, step) => sum + step.estimatedHours, 0)
    const estimatedWeeks = Math.ceil(totalHours / user.availableWeeklyHours)
    
    return { totalHours, estimatedWeeks }
  }

  // Advanced week calculation: steps can span multiple weeks, weeks can have multiple steps
  const calculateWeeksAndSteps = (): { weeksData: WeekData[], stepsWithWeeks: RoadmapStep[] } => {
    if (!roadmap?.steps || !user?.availableWeeklyHours) return { weeksData: [], stepsWithWeeks: [] }
    
    const hoursPerWeek = user.availableWeeklyHours
    const { estimatedWeeks } = calculatePersonalizedTimeline()
    
    // Initialize weeks data
    const weeksData: WeekData[] = Array.from({ length: estimatedWeeks }, (_, i) => ({
      weekNumber: i + 1,
      steps: [],
      totalHours: 0,
      progressPercentage: 0
    }))
    
    // Process each step and assign to weeks
    const stepsWithWeeks: RoadmapStep[] = roadmap.steps.map(step => {
      const weekNumbers: number[] = []
      let remainingHours = step.estimatedHours
      let currentWeek = 1
      
      // Find the first week with available capacity
      while (remainingHours > 0 && currentWeek <= estimatedWeeks) {
        const weekData = weeksData[currentWeek - 1]
        const availableHours = hoursPerWeek - weekData.totalHours
        
        if (availableHours > 0) {
          // Add this step to the current week
          weekNumbers.push(currentWeek)
          weekData.steps.push(step)
          
          // Calculate how many hours to allocate to this week
          const hoursToAllocate = Math.min(remainingHours, availableHours)
          weekData.totalHours += hoursToAllocate
          remainingHours -= hoursToAllocate
        }
        
        currentWeek++
      }
      
      return { ...step, weekNumbers }
    })
    
    // Calculate progress for each week
    weeksData.forEach(week => {
      if (week.steps.length > 0) {
        const completedSteps = week.steps.filter(step => step.completed).length
        week.progressPercentage = Math.round((completedSteps / week.steps.length) * 100)
      }
    })
    
    return { weeksData, stepsWithWeeks }
  }

  const getStepsForWeek = (weekNumber: number): RoadmapStep[] => {
    if (!roadmap?.steps) return []
    
    const { stepsWithWeeks } = calculateWeeksAndSteps()
    return stepsWithWeeks.filter(step => step.weekNumbers?.includes(weekNumber)) || []
  }

  useEffect(() => {
    const loadRoadmapWithProgress = async () => {
      // Check authentication
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (!userData || !token) {
        router.push('/')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      try {
        // Fetch roadmap data with steps included
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

        // If steps aren't included, fetch them separately
        let stepsData = roadmapData.steps || []
        if (!stepsData.length) {
          const stepsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${id}/steps`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (stepsResponse.ok) {
            stepsData = await stepsResponse.json()
          }
        }

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

        setRoadmap({ ...roadmapData, steps: stepsWithProgress })
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
    
    // Prevent multiple clicks on the same step
    if (loadingSteps.has(stepId)) return
    
    setLoadingSteps(prev => new Set(prev).add(stepId))
    
    try {
      const token = localStorage.getItem('token')
      const stepToUpdate = roadmap.steps?.find(step => step.id === stepId)
      
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
        setRoadmap(prevRoadmap => {
          if (!prevRoadmap?.steps) return prevRoadmap
          
          return {
            ...prevRoadmap,
            steps: prevRoadmap.steps.map(step => 
              step.id === stepId ? { ...step, completed: !step.completed } : step
            )
          }
        })
        
        toast.success(stepToUpdate.completed ? 'Step marked as in progress' : 'Step completed! 🎉')
      } else {
        toast.error('Failed to update progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Error updating progress')
    } finally {
      setLoadingSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(stepId)
        return newSet
      })
    }
  }

  const handleResourceClick = async (resource: any, stepId: number, resourceIndex: number) => {
    const resourceKey = `${stepId}-${resourceIndex}`
    
    if (loadingResources.has(resourceKey)) return
    
    setLoadingResources(prev => new Set(prev).add(resourceKey))
    
    try {
      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Open resource in new tab
      window.open(resource.url, '_blank')
      
      toast.success('Resource opened!')
    } catch (error) {
      toast.error('Failed to open resource')
    } finally {
      setLoadingResources(prev => {
        const newSet = new Set(prev)
        newSet.delete(resourceKey)
        return newSet
      })
    }
  }

  const handleWeekChange = async (weekNumber: number) => {
    if (changingWeek || selectedWeek === weekNumber) return
    
    setChangingWeek(true)
    
    try {
      // Simulate brief loading for smooth UX
      await new Promise(resolve => setTimeout(resolve, 150))
      setSelectedWeek(weekNumber)
    } finally {
      setChangingWeek(false)
    }
  }

  const handleBackToDashboard = async () => {
    if (navigating) return
    
    setNavigating(true)
    
    try {
      // Brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 200))
      router.push('/dashboard')
    } finally {
      // Note: This might not execute if navigation succeeds
      setNavigating(false)
    }
  }

  const getOverallProgress = () => {
    if (!roadmap?.steps?.length) return 0
    const completedSteps = roadmap.steps.filter(step => step.completed).length
    return Math.round((completedSteps / roadmap.steps.length) * 100)
  }

  const getPersonalizedDuration = () => {
    const { totalHours } = calculatePersonalizedTimeline()
    return totalHours > 0 ? `${totalHours}h total` : 'Duration varies'
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
          <Button 
            onClick={handleBackToDashboard} 
            disabled={navigating}
            className={`
              bg-blue-600 hover:bg-blue-700 transition-all duration-200
              ${navigating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {navigating ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const { totalHours, estimatedWeeks } = calculatePersonalizedTimeline()
  const { weeksData } = calculateWeeksAndSteps()
  const currentWeekSteps = getStepsForWeek(selectedWeek)

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
                onClick={handleBackToDashboard}
                disabled={navigating}
                className={`
                  text-gray-300 border-gray-600 hover:bg-gray-700 transition-all duration-200
                  ${navigating ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {navigating ? (
                  <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <ArrowLeft className="h-4 w-4 mr-2" />
                )}
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{roadmap.title}</h1>
                <p className="text-gray-400 text-sm">{roadmap.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
              {user && (
                <div className="flex items-center text-gray-400 text-sm">
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Personalized Timeline Overview */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-400" />
              Your Personalized Learning Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{getOverallProgress()}%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {totalHours > 0 ? `${totalHours}h` : 'Duration varies'}
                </div>
                <div className="text-sm text-gray-400">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{estimatedWeeks}</div>
                <div className="text-sm text-gray-400">Weeks for You</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{user?.availableWeeklyHours || 0}h</div>
                <div className="text-sm text-gray-400">Per Week</div>
              </div>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
            
            {roadmap.skills && roadmap.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wide">Skills you'll master</p>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two Column Layout: Weeks on Left, Steps on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section: Week Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Weeks Span
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-y-auto scrollbar-modern">
                {(() => {
                  const { stepsWithWeeks } = calculateWeeksAndSteps()
                  
                  // Group steps by their week spans
                  const weekSpanGroups = new Map<string, RoadmapStep[]>()
                  
                  stepsWithWeeks.forEach(step => {
                    if (step.weekNumbers && step.weekNumbers.length > 0) {
                      const weekKey = step.weekNumbers.join(',')
                      if (!weekSpanGroups.has(weekKey)) {
                        weekSpanGroups.set(weekKey, [])
                      }
                      weekSpanGroups.get(weekKey)!.push(step)
                    }
                  })
                  
                  // Convert to array and sort by first week number
                  const sortedGroups = Array.from(weekSpanGroups.entries())
                    .sort((a, b) => {
                      const aFirstWeek = parseInt(a[0].split(',')[0])
                      const bFirstWeek = parseInt(b[0].split(',')[0])
                      return aFirstWeek - bFirstWeek
                    })
                  
                  return sortedGroups.map(([weekKey, steps], index) => {
                    const weekNumbers = weekKey.split(',').map(Number)
                    const totalHours = steps.reduce((sum, step) => sum + step.estimatedHours, 0)
                    const completedSteps = steps.filter(step => step.completed).length
                    const progressPercentage = Math.round((completedSteps / steps.length) * 100)
                    
                    // Format week display
                    const formatWeekSpan = (weeks: number[]): string => {
                      if (weeks.length === 1) {
                        return `Week ${weeks[0]}`
                      } else if (weeks.length === 2) {
                        return `Week ${weeks[0]} & ${weeks[1]}`
                      } else if (weeks.length === 3) {
                        return `Week ${weeks[0]}, ${weeks[1]} & ${weeks[2]}`
                      } else {
                        // For more than 3 weeks, show as range
                        const consecutive = weeks.every((week, i) => i === 0 || week === weeks[i-1] + 1)
                        if (consecutive) {
                          return `Week ${weeks[0]}-${weeks[weeks.length - 1]}`
                        } else {
                          return `Week ${weeks.slice(0, -1).join(', ')} & ${weeks[weeks.length - 1]}`
                        }
                      }
                    }
                    
                    const isSelected = weekNumbers.includes(selectedWeek)
                    
                    return (
                      <div
                        key={weekKey}
                        className={`
                          p-4 rounded-lg border transition-all duration-200
                          ${isSelected 
                            ? 'bg-blue-600/20 border-blue-500/50' 
                            : 'bg-gray-700/30 border-gray-600/30'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium text-sm">
                            {formatWeekSpan(weekNumbers)}
                          </h4>
                          <span className="text-xs text-gray-400">{progressPercentage}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">
                            {steps.length} step{steps.length !== 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {totalHours}h
                          </div>
                        </div>
                        
                        <Progress value={progressPercentage} className="h-1.5 mb-3" />
                        
                        {/* Step list */}
                        <div className="space-y-1">
                          {steps.map((step, stepIndex) => (
                            <button
                              key={step.id}
                              onClick={() => handleWeekChange(step.weekNumbers?.[0] || 1)}
                              disabled={changingWeek}
                              className={`
                                w-full text-left p-2 rounded text-xs transition-all duration-200
                                ${changingWeek ? 'opacity-50 cursor-not-allowed' : ''}
                                ${step.completed 
                                  ? 'bg-green-600/20 text-green-300' 
                                  : 'bg-gray-600/20 text-gray-300 hover:bg-gray-600/30'
                                }
                              `}
                            >
                              <div className="flex items-center space-x-2">
                                {step.completed ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Circle className="h-3 w-3 text-gray-400" />
                                )}
                                <span className="truncate">
                                  {step.title}
                                </span>
                              </div>
                              {step.weekNumbers && step.weekNumbers.length > 1 && (
                                <div className="text-xs text-purple-400 mt-1 ml-5">
                                  Spans {formatWeekSpan(step.weekNumbers)}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Right Section: Steps for Selected Week */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center justify-between">
                  <span>Week {selectedWeek}</span>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {weeksData[selectedWeek - 1]?.totalHours || 0}h total
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Steps for Current Week */}
            <div className="h-[500px] overflow-y-auto scrollbar-modern space-y-6 pr-2">
              {changingWeek ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading week content...</p>
                  </div>
                </div>
              ) : currentWeekSteps.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No steps for Week {selectedWeek}</p>
                    <p className="text-gray-500 text-sm mt-2">This week might be a buffer or review period</p>
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
                          disabled={loadingSteps.has(step.id)}
                          className={`
                            mt-1 transition-all duration-200
                            ${loadingSteps.has(step.id) 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-110'
                            }
                          `}
                        >
                          {loadingSteps.has(step.id) ? (
                            <div className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          ) : step.completed ? (
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
                                <Badge variant="outline" className="text-xs capitalize">
                                  {step.type}
                                </Badge>
                              )}
                              <div className="flex items-center text-gray-400 text-sm">
                                <Clock className="h-4 w-4 mr-1" />
                                {step.estimatedHours}h
                              </div>
                              {step.weekNumbers && step.weekNumbers.length > 1 && (
                                <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300">
                                  Spans weeks {step.weekNumbers.join(', ')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-4">{step.description}</p>
                          
                          {step.learningObjectives && (
                            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                              <p className="text-sm font-medium text-blue-400 mb-1">Learning Objectives</p>
                              <p className="text-sm text-gray-300">{step.learningObjectives}</p>
                            </div>
                          )}
                          
                          {step.resources && step.resources.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">Resources</p>
                              <div className="space-y-2">
                                {step.resources.map((resource, resourceIndex) => {
                                  const resourceKey = `${step.id}-${resourceIndex}`
                                  const isLoadingResource = loadingResources.has(resourceKey)
                                  
                                  return (
                                    <Button
                                      key={resourceIndex}
                                      variant="outline"
                                      size="sm"
                                      disabled={isLoadingResource}
                                      className={`
                                        text-blue-400 border-blue-500/30 hover:bg-blue-500/10 transition-all duration-200
                                        ${isLoadingResource ? 'opacity-50 cursor-not-allowed' : ''}
                                      `}
                                      onClick={() => handleResourceClick(resource, step.id, resourceIndex)}
                                    >
                                      {isLoadingResource ? (
                                        <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                                      ) : (
                                        <PlayCircle className="h-4 w-4 mr-2" />
                                      )}
                                      {resource.title}
                                    </Button>
                                  )
                                })}
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

        {/* Discussion Section */}
        <div className="mt-12">
          <DiscussionThreads roadmapId={roadmap.id} />
        </div>
      </div>
    </div>
  )
}