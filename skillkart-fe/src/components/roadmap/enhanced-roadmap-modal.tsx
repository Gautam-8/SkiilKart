'use client'

import { useState } from 'react'
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, FileText, HelpCircle, Clock, X, Users, BookOpen, Target } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

interface RoadmapStep {
  id: number
  title: string
  roadmapId: number
  type: string
  description?: string
  estimatedHours?: number
}

interface Roadmap {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  skills: string[]
  steps: RoadmapStep[]
}

interface EnhancedRoadmapModalProps {
  open: boolean
  onClose: () => void
  roadmap: Roadmap | null
  loading: boolean
}

export function EnhancedRoadmapModal({ open, onClose, roadmap, loading }: EnhancedRoadmapModalProps) {
  if (!roadmap) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'Videos': return <Video className="h-4 w-4 text-red-400" />
      case 'Blogs': return <FileText className="h-4 w-4 text-blue-400" />
      case 'Quizzes': return <HelpCircle className="h-4 w-4 text-green-400" />
      default: return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const totalHours = roadmap.steps.reduce((sum, step) => sum + (step.estimatedHours || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="fixed top-[50%] left-[50%] z-50 w-[90vw] max-w-4xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            {roadmap.title} - Roadmap Preview
          </DialogTitle>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-300">Loading preview...</span>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="relative bg-gray-800 border-b border-gray-700 p-8">
                <Button 
                  onClick={onClose} 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="max-w-3xl">
                  <h1 className="text-3xl font-bold mb-3 text-white">{roadmap.title}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    {roadmap.description}
                  </p>
                  
                  <div className="flex items-center space-x-6">
                    <Badge className={`px-3 py-1 border ${getDifficultyColor(roadmap.difficulty)}`}>
                      {roadmap.difficulty}
                    </Badge>
                    <span className="flex items-center text-gray-300">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {roadmap.steps.length} lessons
                    </span>
                    <span className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      {totalHours}h total
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-modern">
                {/* Skills Section */}
                {roadmap.skills && roadmap.skills.length > 0 && (
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-400" />
                      What you'll learn
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {roadmap.skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Path */}
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-400" />
                    Learning Path
                  </h3>
                  
                  <div className="max-h-96 overflow-y-auto scrollbar-thin space-y-4 pr-2">
                    {roadmap.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-300">{index + 1}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStepIcon(step.type)}
                            <h4 className="text-white font-medium">{step.title}</h4>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                              {step.type}
                            </span>
                            {step.estimatedHours && (
                              <span className="text-gray-400 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.estimatedHours}h
                              </span>
                            )}
                          </div>
                          
                          {step.description && (
                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 border-t border-gray-700 bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-400">
                      <p className="text-sm">Ready to start your learning journey?</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Close Preview
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          // This would typically navigate to the roadmap page or start the roadmap
                          onClose()
                        }}
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
} 