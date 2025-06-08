'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  TrendingUp,
  Calendar,
  Medal,
  Target
} from 'lucide-react'

interface UserGamification {
  totalXP: number
  level: number
  xpToNextLevel: number
  currentStreak: number
  longestStreak: number
  badges: UserBadge[]
  achievements: Achievement[]
}

interface UserBadge {
  id: number
  name: string
  description: string
  iconType: 'trophy' | 'star' | 'medal' | 'award'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: string
}

interface Achievement {
  id: number
  title: string
  description: string
  xpReward: number
  completedAt: string
}

interface GamificationStatsProps {
  userId: number
}

export function GamificationStats({ userId }: GamificationStatsProps) {
  const [gamificationData, setGamificationData] = useState<UserGamification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGamificationData()
  }, [userId])

  const loadGamificationData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gamification`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGamificationData(data)
      }
    } catch (error) {
      console.error('Error loading gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy': return <Trophy className="h-4 w-4" />
      case 'star': return <Star className="h-4 w-4" />
      case 'medal': return <Medal className="h-4 w-4" />
      case 'award': return <Award className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600 text-gray-300'
      case 'rare': return 'bg-blue-600 text-blue-300'
      case 'epic': return 'bg-purple-600 text-purple-300'
      case 'legendary': return 'bg-yellow-600 text-yellow-300'
      default: return 'bg-gray-600 text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!gamificationData) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-8 text-center">
          <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No gamification data available</p>
        </CardContent>
      </Card>
    )
  }

  const levelProgress = gamificationData.xpToNextLevel > 0 
    ? ((gamificationData.totalXP % 1000) / 1000) * 100 
    : 100

  return (
    <div className="space-y-8">
      {/* XP and Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400">Level {gamificationData.level}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{gamificationData.totalXP.toLocaleString()}</div>
            <p className="text-sm text-blue-300">Total XP</p>
            <Progress value={levelProgress} className="h-2 mt-3" />
            <p className="text-xs text-blue-400 mt-1">
              {gamificationData.xpToNextLevel} XP to level {gamificationData.level + 1}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-xs text-green-400">Current</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{gamificationData.currentStreak}</div>
            <p className="text-sm text-green-300">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400">Best</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{gamificationData.longestStreak}</div>
            <p className="text-sm text-purple-300">Longest Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-xs text-yellow-400">Earned</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{gamificationData.badges.length}</div>
            <p className="text-sm text-yellow-300">Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Collection */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
            Badge Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gamificationData.badges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No badges earned yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete roadmap steps to earn your first badge!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamificationData.badges.map((badge) => (
                <Card key={badge.id} className="bg-gray-700/30 border-gray-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getRarityColor(badge.rarity)}`}>
                        {getBadgeIcon(badge.iconType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{badge.name}</h4>
                          <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{badge.description}</p>
                        <p className="text-xs text-gray-500">
                          Earned {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-400" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gamificationData.achievements.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No achievements yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Keep learning to unlock achievements!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {gamificationData.achievements.slice(0, 5).map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{achievement.title}</h4>
                      <p className="text-gray-300 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-semibold">+{achievement.xpReward} XP</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(achievement.completedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 