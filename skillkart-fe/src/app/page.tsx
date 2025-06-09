'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginModal } from '@/components/auth/login-modal'
import { RegisterModal } from '@/components/auth/register-modal'
import { BookOpen, Users, Trophy, Rocket, Target, Clock } from 'lucide-react'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData)
          
          // Role-based redirect for already logged-in users
          if (parsedUser.role === 'Admin') {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
          return // Exit early if redirecting
        } catch (error) {
          // If user data is corrupted, clear it
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
      
      // User is not logged in, show landing page
      setLoading(false)
    }

    checkAuthAndRedirect()
  }, [router])

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Personalized Roadmaps",
      description: "Get custom learning paths tailored to your goals, interests, and available time."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Curated Resources",
      description: "Access high-quality videos, articles, and quizzes curated by experts for each topic."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Peer Support",
      description: "Connect with fellow learners, ask questions, and share knowledge in topic discussions."
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Gamification",
      description: "Earn XP points, unlock badges, and track your progress with learning streaks."
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-500" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress reports and completion statistics."
    },
    {
      icon: <Rocket className="h-8 w-8 text-pink-500" />,
      title: "Skill Mastery",
      description: "Master new skills like Web Development, UI/UX Design, and Data Science systematically."
    }
  ]

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading SkillKart...</div>
        </div>
      </div>
    )
  }

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
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowLogin(true)}
                className="text-gray-300 hover:text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowRegister(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Master New Skills with
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}Personalized Roadmaps
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Build personalized learning paths for Web Development, UI/UX Design, Data Science, and more. 
            Get curated resources, track progress, and connect with a community of learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowRegister(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowLogin(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need to master new skills efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:border-gray-600">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-800">
            <CardContent className="p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to start your learning journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of learners who are already mastering new skills with SkillKart.
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowRegister(true)}
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillKart</span>
          </div>
          <p className="text-gray-400">
            Empowering learners to master new skills through personalized roadmaps.
          </p>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal 
        open={showLogin}
        onOpenChange={setShowLogin}
        onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />
      <RegisterModal 
        open={showRegister}
        onOpenChange={setShowRegister}
        onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
      />
    </div>
  )
}
