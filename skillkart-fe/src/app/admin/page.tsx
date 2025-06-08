'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, BookOpen, Users, Activity, Settings, ExternalLink, Trash2, Video, FileText, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Roadmap {
  id: number
  title: string
  steps: RoadmapStep[]
}

interface RoadmapStep {
  id: number
  title: string
  roadmapId: number
  type: string
}

interface Resource {
  id: number
  stepId: number
  title: string
  type: 'Video' | 'Blog' | 'Quiz'
  url: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  
  // Form state
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('')
  const [selectedStepId, setSelectedStepId] = useState<string>('')
  const [stepResources, setStepResources] = useState<Resource[]>([])
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceType, setResourceType] = useState<string>('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Loading states
  const [loadingSteps, setLoadingSteps] = useState(false)
  const [loadingResources, setLoadingResources] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/dashboard')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'Admin') {
      toast.error('Access denied. Admin privileges required.')
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  // Load roadmaps when modal opens
  const loadRoadmaps = async () => {
    const token = localStorage.getItem('token')
    setModalLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const roadmapsData = await response.json()
        setRoadmaps(roadmapsData)
      } else {
        toast.error('Failed to load roadmaps')
      }
    } catch (error) {
      console.error('Error loading roadmaps:', error)
      toast.error('Failed to load roadmaps')
    } finally {
      setModalLoading(false)
    }
  }

  // Load steps when roadmap is selected
  const handleRoadmapChange = async (roadmapId: string) => {
    setSelectedRoadmapId(roadmapId)
    setSelectedStepId('')
    setStepResources([])
    
    if (!roadmapId) return
    
    setLoadingSteps(true)
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${roadmapId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const roadmapData = await response.json()
        const updatedRoadmaps = roadmaps.map(r => 
          r.id.toString() === roadmapId ? { ...r, steps: roadmapData.steps } : r
        )
        setRoadmaps(updatedRoadmaps)
      }
    } catch (error) {
      console.error('Error loading steps:', error)
      toast.error('Failed to load roadmap steps')
    } finally {
      setLoadingSteps(false)
    }
  }

  // Load resources when step is selected
  const handleStepChange = async (stepId: string) => {
    setSelectedStepId(stepId)
    setStepResources([])
    
    if (!stepId) {
      setResourceType('')
      return
    }
    
    // Auto-select resource type based on step type
    const selectedStep = getAvailableSteps().find(step => step.id.toString() === stepId)
    if (selectedStep) {
      // Map step types to resource types
      const typeMapping: { [key: string]: string } = {
        'Videos': 'Video',
        'Blogs': 'Blog', 
        'Quizzes': 'Quiz'
      }
      setResourceType(typeMapping[selectedStep.type] || '')
    }
    
    setLoadingResources(true)
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/by-step/${stepId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const resources = await response.json()
        setStepResources(resources)
      } else {
        // No resources found - this is fine
        setStepResources([])
      }
    } catch (error) {
      // No resources found - this is fine
      setStepResources([])
    } finally {
      setLoadingResources(false)
    }
  }

  const getAvailableSteps = () => {
    if (!selectedRoadmapId) return []
    const roadmap = roadmaps.find(r => r.id.toString() === selectedRoadmapId)
    return roadmap?.steps || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStepId || !resourceTitle || !resourceType || !resourceUrl) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stepId: parseInt(selectedStepId),
          title: resourceTitle,
          type: resourceType,
          url: resourceUrl
        })
      })

      if (response.ok) {
        toast.success('Resource created successfully!')
        // Reset form
        setResourceTitle('')
        setResourceType('')
        setResourceUrl('')
        // Reload resources for current step
        await handleStepChange(selectedStepId)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create resource')
      }
    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error('Failed to create resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resourceId: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success('Resource deleted successfully!')
        // Reload resources for current step
        await handleStepChange(selectedStepId)
      } else {
        toast.error('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="h-4 w-4 text-red-400" />
      case 'Blog': return <FileText className="h-4 w-4 text-blue-400" />
      case 'Quiz': return <HelpCircle className="h-4 w-4 text-green-400" />
      default: return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const handleOpenResourceModal = () => {
    setShowResourceModal(true)
    loadRoadmaps()
  }

  const handleCloseResourceModal = () => {
    setShowResourceModal(false)
    // Reset all form state
    setRoadmaps([])
    setSelectedRoadmapId('')
    setSelectedStepId('')
    setStepResources([])
    setResourceTitle('')
    setResourceType('')
    setResourceUrl('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Create New Roadmap
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/admin/roadmap/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Roadmap
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Manage Resources
              </CardTitle>
              <Settings className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleOpenResourceModal}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                View Analytics
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push('/admin/analytics')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Recent Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">No roadmaps created yet.</p>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => router.push('/admin/roadmap/create')}
                >
                  Create your first roadmap
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-300">System Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Roadmaps</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Learners</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resources</span>
                  <span className="text-white font-semibold">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resource Management Modal */}
      <Dialog open={showResourceModal} onOpenChange={setShowResourceModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Resource Manager</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {modalLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-400">Loading roadmaps...</div>
              </div>
            ) : (
              <>
                {/* Step 1: Select Roadmap */}
                <div>
                  <Label className="text-gray-300 text-base font-medium">1. Select Roadmap</Label>
                  <Select value={selectedRoadmapId} onValueChange={handleRoadmapChange}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
                      <SelectValue placeholder="Choose a roadmap" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {roadmaps.map((roadmap) => (
                        <SelectItem key={roadmap.id} value={roadmap.id.toString()} className="text-white">
                          {roadmap.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Select Step */}
                {selectedRoadmapId && (
                  <div>
                    <Label className="text-gray-300 text-base font-medium">2. Select Roadmap Step</Label>
                    {loadingSteps ? (
                      <div className="text-gray-400 text-sm mt-2">Loading steps...</div>
                    ) : (
                      <Select value={selectedStepId} onValueChange={handleStepChange}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
                          <SelectValue placeholder="Choose a step" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {getAvailableSteps().map((step) => (
                            <SelectItem key={step.id} value={step.id.toString()} className="text-white">
                              <div className="flex items-center space-x-2">
                                {step.type === 'Videos' && <Video className="h-4 w-4 text-red-400" />}
                                {step.type === 'Blogs' && <FileText className="h-4 w-4 text-blue-400" />}
                                {step.type === 'Quizzes' && <HelpCircle className="h-4 w-4 text-green-400" />}
                                <span>{step.title}</span>
                                <span className="text-gray-400 text-xs">({step.type})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {/* Step 3: View/Manage Resources */}
                {selectedStepId && (
                  <div>
                    <Label className="text-gray-300 text-base font-medium">3. Manage Resources for This Step</Label>
                    
                    {loadingResources ? (
                      <div className="text-gray-400 text-sm mt-2">Loading resources...</div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {/* Existing Resources */}
                        {stepResources.length > 0 && (
                          <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-3">Existing Resources ({stepResources.length})</h4>
                            <div className="space-y-2">
                              {stepResources.map((resource) => (
                                <div key={resource.id} className="bg-gray-700 rounded p-3 flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    {getResourceIcon(resource.type)}
                                    <div>
                                      <div className="text-white font-medium">{resource.title}</div>
                                      <div className="text-gray-400 text-sm">{resource.type}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteResource(resource.id)}
                                      className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add New Resource Form */}
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3">Add New Resource</h4>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label className="text-gray-300">Resource Title</Label>
                              <Input
                                value={resourceTitle}
                                onChange={(e) => setResourceTitle(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white mt-2"
                                placeholder="Enter resource title"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-gray-300">Resource URL</Label>
                              <Input
                                type="url"
                                value={resourceUrl}
                                onChange={(e) => setResourceUrl(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="https://example.com/resource"
                              />
                            </div>

                            <Button 
                              type="submit" 
                              disabled={submitting}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {submitting ? 'Adding...' : 'Add Resource'}
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={handleCloseResourceModal} className="text-gray-300 border-gray-600">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 