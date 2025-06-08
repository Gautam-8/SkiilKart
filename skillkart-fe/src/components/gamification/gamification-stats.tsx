'use client'

import { useState, useEffect } from 'react'
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  TrendingUp,
  Calendar,
  Medal
} from 'lucide-react'

interface UserGamification {
  totalXP: number
  level: number
  xpToNextLevel: number
  currentStreak: number
  longestStreak: number
  badges: UserBadge[]
}

interface UserBadge {
  id: number
  name: string
  description: string
  iconType: 'trophy' | 'star' | 'medal' | 'award'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: string
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
      case 'trophy': return <Trophy className="h-3 w-3" />
      case 'star': return <Star className="h-3 w-3" />
      case 'medal': return <Medal className="h-3 w-3" />
      case 'award': return <Award className="h-3 w-3" />
      default: return <Award className="h-3 w-3" />
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
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm animate-pulse">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* XP Loading */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-5 w-16 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-700 rounded mb-1"></div>
                <div className="h-1.5 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
            
            {/* Streak Loading */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-5 w-8 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
            
            {/* Best Streak Loading */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-5 w-8 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Badge Loading */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-700 rounded"></div>
              <div className="h-4 w-12 bg-gray-700 rounded"></div>
              <div className="h-5 w-6 bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-600/50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!gamificationData) {
    return (
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Zap className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No progress data available</p>
          </div>
        </div>
      </div>
    )
  }

  const levelProgress = gamificationData.xpToNextLevel > 0 
    ? ((gamificationData.totalXP % 1000) / 1000) * 100 
    : 100

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Progress Stats - Compact Status Row */}
        <div className="flex flex-wrap items-center gap-6">
          {/* XP & Level */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {gamificationData.level}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{gamificationData.totalXP.toLocaleString()}</div>
              <div className="text-xs text-gray-400">XP • {gamificationData.xpToNextLevel} to next level</div>
              <div className="w-20 bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-full flex items-center justify-center border border-green-500/30">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{gamificationData.currentStreak}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-full flex items-center justify-center border border-purple-500/30">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{gamificationData.longestStreak}</div>
              <div className="text-xs text-gray-400">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Badge Collection - Compact Visual Row */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Badges</span>
            <span className="text-lg font-bold text-yellow-400">{gamificationData.badges.length}</span>
          </div>
          
          {gamificationData.badges.length > 0 ? (
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-600/50">
              {gamificationData.badges.slice(0, 5).map((badge) => (
                <div 
                  key={badge.id} 
                  className={`w-8 h-8 ${getRarityColor(badge.rarity)} rounded-lg flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer`}
                  title={`${badge.name} (${badge.rarity})`}
                >
                  {getBadgeIcon(badge.iconType)}
                </div>
              ))}
              {gamificationData.badges.length > 5 && (
                <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium">
                  +{gamificationData.badges.length - 5}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic pl-4 border-l border-gray-600/50">
              Complete roadmap steps to earn badges
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 