'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Send, ThumbsUp, Reply } from 'lucide-react'
import { toast } from 'sonner'

interface Thread {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
  }
  createdAt: string
  likes: number
  replies: ThreadReply[]
  hasLiked: boolean
}

interface ThreadReply {
  id: number
  content: string
  author: {
    id: number
    name: string
  }
  createdAt: string
  likes: number
  hasLiked: boolean
}

interface DiscussionThreadsProps {
  roadmapId: number
  stepId?: number
}

export function DiscussionThreads({ roadmapId, stepId }: DiscussionThreadsProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(false)
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadContent, setNewThreadContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    loadThreads()
  }, [roadmapId, stepId])

  const loadThreads = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = stepId 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/threads/roadmap/${roadmapId}/step/${stepId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/threads/roadmap/${roadmapId}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setThreads(data)
      }
    } catch (error) {
      console.error('Error loading threads:', error)
    }
  }

  const createThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newThreadTitle,
          content: newThreadContent,
          roadmapId,
          roadmapStepId: stepId
        })
      })

      if (response.ok) {
        toast.success('Thread created successfully!')
        setNewThreadTitle('')
        setNewThreadContent('')
        setShowNewThread(false)
        loadThreads()
      } else {
        toast.error('Failed to create thread')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const likeThread = async (threadId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/threads/${threadId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadThreads() // Refresh to get updated like count
      }
    } catch (error) {
      console.error('Error liking thread:', error)
    }
  }

  const replyToThread = async (threadId: number) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/threads/${threadId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent
        })
      })

      if (response.ok) {
        toast.success('Reply posted!')
        setReplyContent('')
        setReplyingTo(null)
        loadThreads()
      } else {
        toast.error('Failed to post reply')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
            {stepId ? 'Step Discussion' : 'Roadmap Discussion'}
          </CardTitle>
          <Button
            onClick={() => setShowNewThread(!showNewThread)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Thread
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Thread Form */}
        {showNewThread && (
          <Card className="bg-gray-700/50 border-gray-600/50">
            <CardContent className="p-4 space-y-4">
              <Input
                placeholder="Thread title..."
                value={newThreadTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewThreadTitle(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Textarea
                placeholder="What would you like to discuss?"
                value={newThreadContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewThreadContent(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={createThread}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Posting...' : 'Post Thread'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewThread(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Threads List */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No discussions yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start the conversation by creating the first thread!
              </p>
            </div>
          ) : (
            threads.map((thread) => (
              <Card key={thread.id} className="bg-gray-700/30 border-gray-600/30">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {thread.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{thread.title}</h3>
                        <span className="text-xs text-gray-400">
                          {formatDate(thread.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{thread.content}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeThread(thread.id)}
                          className={`text-gray-400 hover:text-blue-400 ${
                            thread.hasLiked ? 'text-blue-400' : ''
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {thread.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(thread.id)}
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply ({thread.replies?.length || 0})
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                          by {thread.author?.name || 'Unknown'}
                        </Badge>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === thread.id && (
                        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white mb-3"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => replyToThread(thread.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Post Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                              className="border-gray-600 text-gray-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {thread.replies && thread.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {thread.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-800/30 p-4 rounded-lg border-l-2 border-green-500/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-green-600 text-white text-xs">
                                      {reply.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-green-400">{reply.author?.name || 'Unknown'}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 