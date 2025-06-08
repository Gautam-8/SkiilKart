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

interface RoadmapStep {
  id: number
  title: string
  description: string
  type: 'video' | 'article' | 'quiz' | 'project'
  duration: string
  completed: boolean
  resources: Array<{
    title: string
    url: string
    type: 'video' | 'article' | 'documentation'
  }>
}

interface RoadmapWeek {
  week: number
  title: string
  description: string
  steps: RoadmapStep[]
}

interface Roadmap {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  totalWeeks: number
  weeks: RoadmapWeek[]
}

// Static roadmap data with week-by-week content
const ROADMAP_DATA: Record<number, Roadmap> = {
  1: {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, JavaScript, and modern web development practices',
    category: 'Web Development',
    difficulty: 'Beginner',
    totalWeeks: 12,
    weeks: [
      {
        week: 1,
        title: 'HTML Foundations',
        description: 'Master the building blocks of web pages',
        steps: [
          {
            id: 1,
            title: 'HTML Structure & Semantics',
            description: 'Learn about HTML5 semantic elements and document structure',
            type: 'video',
            duration: '45 min',
            completed: false,
            resources: [
              { title: 'HTML Basics Video', url: '#', type: 'video' },
              { title: 'MDN HTML Guide', url: '#', type: 'documentation' }
            ]
          },
          {
            id: 2,
            title: 'Forms & Input Elements',
            description: 'Build interactive forms with proper validation',
            type: 'article',
            duration: '30 min',
            completed: false,
            resources: [
              { title: 'HTML Forms Tutorial', url: '#', type: 'article' }
            ]
          },
          {
            id: 3,
            title: 'HTML Practice Project',
            description: 'Create a personal portfolio page structure',
            type: 'project',
            duration: '2 hours',
            completed: false,
            resources: [
              { title: 'Project Requirements', url: '#', type: 'article' }
            ]
          }
        ]
      },
      {
        week: 2,
        title: 'CSS Styling & Layout',
        description: 'Style your web pages with modern CSS',
        steps: [
          {
            id: 4,
            title: 'CSS Selectors & Properties',
            description: 'Master CSS selectors and common styling properties',
            type: 'video',
            duration: '40 min',
            completed: false,
            resources: [
              { title: 'CSS Fundamentals', url: '#', type: 'video' }
            ]
          },
          {
            id: 5,
            title: 'Flexbox & Grid Layout',
            description: 'Create responsive layouts with modern CSS',
            type: 'video',
            duration: '60 min',
            completed: false,
            resources: [
              { title: 'Flexbox Complete Guide', url: '#', type: 'article' },
              { title: 'CSS Grid Tutorial', url: '#', type: 'video' }
            ]
          },
          {
            id: 6,
            title: 'CSS Layout Quiz',
            description: 'Test your understanding of CSS layout concepts',
            type: 'quiz',
            duration: '15 min',
            completed: false,
            resources: []
          }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: 'Frontend Development Mastery',
    description: 'Master modern frontend frameworks and advanced UI/UX concepts',
    category: 'Frontend Development',
    difficulty: 'Intermediate',
    totalWeeks: 10,
    weeks: [
      {
        week: 1,
        title: 'React Fundamentals',
        description: 'Master React components, state, and props',
        steps: [
          {
            id: 1,
            title: 'React Components & JSX',
            description: 'Learn to build reusable React components',
            type: 'video',
            duration: '50 min',
            completed: false,
            resources: [
              { title: 'React Basics', url: '#', type: 'video' },
              { title: 'React Documentation', url: '#', type: 'documentation' }
            ]
          },
          {
            id: 2,
            title: 'State Management',
            description: 'Understand useState and useEffect hooks',
            type: 'video',
            duration: '45 min',
            completed: false,
            resources: [
              { title: 'React Hooks Guide', url: '#', type: 'article' }
            ]
          },
          {
            id: 3,
            title: 'React Todo App',
            description: 'Build a complete todo application',
            type: 'project',
            duration: '3 hours',
            completed: false,
            resources: [
              { title: 'Project Starter Code', url: '#', type: 'article' }
            ]
          }
        ]
      },
      {
        week: 2,
        title: 'TypeScript Integration',
        description: 'Add type safety to your React applications',
        steps: [
          {
            id: 4,
            title: 'TypeScript Basics',
            description: 'Learn TypeScript fundamentals for React',
            type: 'video',
            duration: '40 min',
            completed: false,
            resources: [
              { title: 'TypeScript for React', url: '#', type: 'video' }
            ]
          },
          {
            id: 5,
            title: 'Typed Components',
            description: 'Create strongly typed React components',
            type: 'article',
            duration: '30 min',
            completed: false,
            resources: [
              { title: 'TypeScript React Patterns', url: '#', type: 'article' }
            ]
          }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: 'UI/UX Design Complete Course',
    description: 'Learn user experience design, prototyping, and design systems',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    totalWeeks: 8,
    weeks: [
      {
        week: 1,
        title: 'Design Principles',
        description: 'Master fundamental design principles',
        steps: [
          {
            id: 1,
            title: 'Color Theory & Typography',
            description: 'Understand color psychology and typography basics',
            type: 'video',
            duration: '35 min',
            completed: false,
            resources: [
              { title: 'Color Theory Guide', url: '#', type: 'video' },
              { title: 'Typography Handbook', url: '#', type: 'article' }
            ]
          },
          {
            id: 2,
            title: 'Layout & Composition',
            description: 'Learn grid systems and visual hierarchy',
            type: 'article',
            duration: '25 min',
            completed: false,
            resources: [
              { title: 'Grid Systems Guide', url: '#', type: 'article' }
            ]
          },
          {
            id: 3,
            title: 'Design Principles Quiz',
            description: 'Test your understanding of design fundamentals',
            type: 'quiz',
            duration: '10 min',
            completed: false,
            resources: []
          }
        ]
      },
      {
        week: 2,
        title: 'User Research',
        description: 'Learn to research and understand users',
        steps: [
          {
            id: 4,
            title: 'User Personas',
            description: 'Create detailed user personas',
            type: 'video',
            duration: '40 min',
            completed: false,
            resources: [
              { title: 'Persona Creation Guide', url: '#', type: 'video' }
            ]
          },
          {
            id: 5,
            title: 'User Journey Mapping',
            description: 'Map user experiences and touchpoints',
            type: 'project',
            duration: '2 hours',
            completed: false,
            resources: [
              { title: 'Journey Map Template', url: '#', type: 'article' }
            ]
          }
        ]
      }
    ]
  },
  4: {
    id: 4,
    title: 'Data Science Foundations',
    description: 'Python, statistics, machine learning, and data visualization',
    category: 'Data Science',
    difficulty: 'Intermediate',
    totalWeeks: 16,
    weeks: [
      {
        week: 1,
        title: 'Python for Data Science',
        description: 'Master Python fundamentals for data analysis',
        steps: [
          {
            id: 1,
            title: 'Python Basics',
            description: 'Variables, data types, and control structures',
            type: 'video',
            duration: '60 min',
            completed: false,
            resources: [
              { title: 'Python Crash Course', url: '#', type: 'video' },
              { title: 'Python Documentation', url: '#', type: 'documentation' }
            ]
          },
          {
            id: 2,
            title: 'NumPy & Pandas',
            description: 'Data manipulation with NumPy and Pandas',
            type: 'video',
            duration: '75 min',
            completed: false,
            resources: [
              { title: 'Pandas Tutorial', url: '#', type: 'video' }
            ]
          },
          {
            id: 3,
            title: 'Data Analysis Project',
            description: 'Analyze a real dataset using Pandas',
            type: 'project',
            duration: '4 hours',
            completed: false,
            resources: [
              { title: 'Sample Dataset', url: '#', type: 'article' }
            ]
          }
        ]
      },
      {
        week: 2,
        title: 'Data Visualization',
        description: 'Create compelling visualizations',
        steps: [
          {
            id: 4,
            title: 'Matplotlib & Seaborn',
            description: 'Create charts and graphs with Python libraries',
            type: 'video',
            duration: '50 min',
            completed: false,
            resources: [
              { title: 'Visualization Guide', url: '#', type: 'video' }
            ]
          },
          {
            id: 5,
            title: 'Dashboard Creation',
            description: 'Build an interactive data dashboard',
            type: 'project',
            duration: '3 hours',
            completed: false,
            resources: [
              { title: 'Dashboard Template', url: '#', type: 'article' }
            ]
          }
        ]
      }
    ]
  },
  5: {
    id: 5,
    title: 'Mobile Development with React Native',
    description: 'Build cross-platform mobile apps with React Native',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    totalWeeks: 14,
    weeks: [
      {
        week: 1,
        title: 'React Native Setup',
        description: 'Get started with React Native development',
        steps: [
          {
            id: 1,
            title: 'Environment Setup',
            description: 'Install and configure React Native development environment',
            type: 'article',
            duration: '30 min',
            completed: false,
            resources: [
              { title: 'Setup Guide', url: '#', type: 'article' },
              { title: 'Expo Documentation', url: '#', type: 'documentation' }
            ]
          },
          {
            id: 2,
            title: 'First Mobile App',
            description: 'Create your first React Native application',
            type: 'video',
            duration: '45 min',
            completed: false,
            resources: [
              { title: 'React Native Basics', url: '#', type: 'video' }
            ]
          },
          {
            id: 3,
            title: 'Navigation Setup',
            description: 'Implement navigation between screens',
            type: 'video',
            duration: '40 min',
            completed: false,
            resources: [
              { title: 'Navigation Tutorial', url: '#', type: 'video' }
            ]
          }
        ]
      },
      {
        week: 2,
        title: 'Mobile UI Components',
        description: 'Build beautiful mobile interfaces',
        steps: [
          {
            id: 4,
            title: 'Native Components',
            description: 'Use React Native core components',
            type: 'video',
            duration: '55 min',
            completed: false,
            resources: [
              { title: 'Components Guide', url: '#', type: 'video' }
            ]
          },
          {
            id: 5,
            title: 'Mobile App Project',
            description: 'Build a complete mobile application',
            type: 'project',
            duration: '5 hours',
            completed: false,
            resources: [
              { title: 'Project Specification', url: '#', type: 'article' }
            ]
          }
        ]
      }
    ]
  }
}

export default function RoadmapViewer() {
  const { id } = useParams()
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/')
      return
    }

    setUser(JSON.parse(userData))

    // Load roadmap data
    const roadmapId = parseInt(id as string)
    const roadmapData = ROADMAP_DATA[roadmapId]
    
    if (roadmapData) {
      setRoadmap(roadmapData)
    } else {
      router.push('/dashboard')
    }
  }, [id, router])

  const toggleStepCompletion = (stepId: number) => {
    if (!roadmap) return
    
    const updatedRoadmap = { ...roadmap }
    updatedRoadmap.weeks = updatedRoadmap.weeks.map(week => ({
      ...week,
      steps: week.steps.map(step => 
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    }))
    
    setRoadmap(updatedRoadmap)
  }

  const getOverallProgress = () => {
    if (!roadmap) return 0
    
    const totalSteps = roadmap.weeks.reduce((acc, week) => acc + week.steps.length, 0)
    const completedSteps = roadmap.weeks.reduce(
      (acc, week) => acc + week.steps.filter(step => step.completed).length, 
      0
    )
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  }

  const getWeekProgress = (week: RoadmapWeek) => {
    const completed = week.steps.filter(step => step.completed).length
    const total = week.steps.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  if (!roadmap || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  const currentWeekData = roadmap.weeks.find(w => w.week === currentWeek)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-gray-400 text-sm">{roadmap.category}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <div className="text-sm text-gray-400">of {roadmap.totalWeeks} weeks</div>
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
                {roadmap.weeks.map((week) => (
                  <button
                    key={week.week}
                    onClick={() => setCurrentWeek(week.week)}
                    className={`
                      w-full p-4 rounded-lg text-left transition-all duration-200
                      ${currentWeek === week.week 
                        ? 'bg-blue-600/20 border-blue-500/50 border' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Week {week.week}</span>
                      <span className="text-xs text-gray-400">{getWeekProgress(week)}%</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{week.title}</p>
                    <Progress value={getWeekProgress(week)} className="h-1" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentWeekData && (
              <div className="space-y-6">
                {/* Week Header */}
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      Week {currentWeekData.week}: {currentWeekData.title}
                    </CardTitle>
                    <p className="text-gray-300">{currentWeekData.description}</p>
                  </CardHeader>
                </Card>

                {/* Steps */}
                <div className="space-y-4">
                  {currentWeekData.steps.map((step, index) => (
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
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {step.duration}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{step.description}</p>
                            
                            {step.resources.length > 0 && (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}