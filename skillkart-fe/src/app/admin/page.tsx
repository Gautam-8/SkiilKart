'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EnhancedRoadmapModal } from '@/components/roadmap/enhanced-roadmap-modal'
import { Plus, BookOpen, Users, Activity, Settings, ExternalLink, Trash2, Video, FileText, HelpCircle, User, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface Roadmap {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  skills: string[]
  steps: RoadmapStep[]
}

interface RoadmapStep {
  id: number
  title: string
  roadmapId: number
  type: string
  description?: string
  estimatedHours?: number
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
  const [allRoadmaps, setAllRoadmaps] = useState<Roadmap[]>([])
  
  // Modal state
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [showRoadmapModal, setShowRoadmapModal] = useState(false)
  const [selectedRoadmapForView, setSelectedRoadmapForView] = useState<Roadmap | null>(null)
  const [loadingRoadmapDetails, setLoadingRoadmapDetails] = useState(false)
  
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
  const [deletingResourceId, setDeletingResourceId] = useState<number | null>(null)
  
  // Confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null)
  
  // Roadmap modal state
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0)
  
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
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

      // Load all roadmaps for display
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const roadmapsData = await response.json()
          setAllRoadmaps(roadmapsData)
        }
      } catch (error) {
        console.error('Error loading roadmaps:', error)
        toast.error('Failed to load roadmaps')
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
        toast.success('Resource added successfully!')
        setResourceTitle('')
        setResourceUrl('')
        // Reload resources for the current step
        handleStepChange(selectedStepId)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to add resource')
      }
    } catch (error) {
      console.error('Error adding resource:', error)
      toast.error('Failed to add resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resource: Resource) => {
    setResourceToDelete(resource)
    setShowDeleteDialog(true)
  }

  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return
    
    setDeletingResourceId(resourceToDelete.id)
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success('Resource deleted successfully!')
        // Reload resources for the current step
        handleStepChange(selectedStepId)
      } else {
        toast.error('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    } finally {
      setDeletingResourceId(null)
      setShowDeleteDialog(false)
      setResourceToDelete(null)
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
    toast.info('Resource manager opened successfully')
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

  const handleViewRoadmapDetails = async (roadmap: Roadmap) => {
    setSelectedRoadmapForView(roadmap)
    setShowRoadmapModal(true)
    setLoadingRoadmapDetails(true)
    toast.info('Loading roadmap details...')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${roadmap.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const roadmapData = await response.json()
        setSelectedRoadmapForView({ ...roadmap, steps: roadmapData.steps })
      }
    } catch (error) {
      console.error('Error loading roadmap details:', error)
      toast.error('Failed to load roadmap details')
    } finally {
      setLoadingRoadmapDetails(false)
    }
  }

  const handleCloseRoadmapModal = () => {
    setShowRoadmapModal(false)
    setSelectedRoadmapForView(null)
    setSelectedStepIndex(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading Admin Dashboard</div>
          <div className="text-gray-400 text-sm mt-2">Please wait while we prepare your workspace</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header - Same as learner dashboard */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SkillKart</h1>
                <p className="text-gray-400 text-sm">Welcome, {user.name}! 👨‍💼</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name} (Admin)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Admin Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
              <Settings className="h-5 w-5 text-blue-400" />
            </div>
            Admin Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                    Create New Roadmap
                  </CardTitle>
                  <Plus className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Design new learning paths for different skills and expertise levels
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  onClick={() => router.push('/admin/roadmap/create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Roadmap
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 hover:border-green-500/50 transition-all duration-300 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-green-400" />
                    Manage Resources
                  </CardTitle>
                  <Video className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Add videos, blogs, and quizzes to roadmap steps for enhanced learning
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  onClick={handleOpenResourceModal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Roadmaps Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <div className="w-8 h-8 bg-gray-600/20 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            All Roadmaps ({allRoadmaps.length})
          </h2>
          {allRoadmaps.length === 0 ? (
            <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No roadmaps created yet</p>
                <Button 
                  onClick={() => router.push('/admin/roadmap/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Roadmap
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {allRoadmaps.map((roadmap) => (
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
                        <div className="text-sm text-gray-400 font-medium">
                          {roadmap.steps?.length || 0} steps
                        </div>
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
                        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Skills covered</p>
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
                       onClick={() => handleViewRoadmapDetails(roadmap)}
                       className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200 py-3 font-medium"
                     >
                       <ChevronRight className="h-4 w-4 mr-2" />
                       View Roadmap Details
                     </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resource Management Modal */}
      <Dialog open={showResourceModal} onOpenChange={setShowResourceModal}>
                  <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-modern">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Resource Manager</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {modalLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-gray-400 text-lg">Loading roadmaps...</div>
                <div className="text-gray-500 text-sm mt-2">Please wait while we fetch the available roadmaps</div>
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
                      <div className="flex items-center space-x-2 mt-2 p-3 bg-gray-800/50 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        <div className="text-gray-400 text-sm">Loading steps...</div>
                      </div>
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
                      <div className="flex items-center space-x-2 mt-2 p-3 bg-gray-800/50 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                        <div className="text-gray-400 text-sm">Loading resources...</div>
                      </div>
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
                                      onClick={() => handleDeleteResource(resource)}
                                      disabled={deletingResourceId === resource.id}
                                      className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
                                    >
                                      {deletingResourceId === resource.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
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
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Adding Resource...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Resource
                                </>
                              )}
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

      {/* Enhanced Roadmap Details Modal */}
      <EnhancedRoadmapModal 
        open={showRoadmapModal}
        onClose={handleCloseRoadmapModal}
        roadmap={selectedRoadmapForView}
        loading={loadingRoadmapDetails}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogContent className="bg-gray-900 border-gray-700 max-w-md scrollbar-modern">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this resource?
            </p>
            {resourceToDelete && (
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  {getResourceIcon(resourceToDelete.type)}
                  <div>
                    <p className="text-white font-medium">{resourceToDelete.title}</p>
                    <p className="text-gray-400 text-sm">{resourceToDelete.type}</p>
                  </div>
                </div>
              </div>
            )}
            <p className="text-red-400 text-sm">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deletingResourceId !== null}
              className="text-gray-300 border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteResource}
              disabled={deletingResourceId !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingResourceId !== null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Resource
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 