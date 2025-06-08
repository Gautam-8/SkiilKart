'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface RoadmapStep {
  title: string
  description: string
  type: 'Videos' | 'Blogs' | 'Quizzes'
  estimatedHours: number
  learningObjectives: string
}

export default function CreateRoadmap() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Roadmap form data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [steps, setSteps] = useState<RoadmapStep[]>([])

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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const addStep = () => {
    const newStep: RoadmapStep = {
      title: '',
      description: '',
      type: 'Videos',
      estimatedHours: 5,
      learningObjectives: ''
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (index: number, field: keyof RoadmapStep, value: string | number) => {
    const updatedSteps = [...steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setSteps(updatedSteps)
  }

  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index)
    setSteps(updatedSteps)
  }

  const getTotalHours = () => {
    return steps.reduce((total, step) => total + (step.estimatedHours || 0), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      
      // Create roadmap first
      const roadmapResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          skills
        })
      })

      if (!roadmapResponse.ok) {
        throw new Error('Failed to create roadmap')
      }

      const roadmap = await roadmapResponse.json()

      // Create steps for the roadmap
      for (const step of steps) {
        const stepResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${roadmap.id}/steps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...step,
            roadmapId: roadmap.id
          })
        })

        if (!stepResponse.ok) {
          throw new Error(`Failed to create step: ${step.title}`)
        }
      }

      toast.success('Roadmap created successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error creating roadmap:', error)
      toast.error('Failed to create roadmap')
    } finally {
      setSaving(false)
    }
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
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold">Create New Roadmap</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Roadmap Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-gray-300">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Describe what learners will achieve..."
                  rows={3}
                  required
                />
              </div>

              {/* Skills Section */}
              <div>
                <Label className="text-gray-300">Skills Covered</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Add a skill (e.g., HTML, CSS, JavaScript)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-blue-700 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Roadmap Steps */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gray-300">Roadmap Steps</CardTitle>
                {steps.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    Total estimated time: {getTotalHours()} hours
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={addStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {steps.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No steps added yet. Click "Add Step" to create your first step.
                </p>
              ) : (
                steps.map((step, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-300">Step {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Step Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="e.g., HTML & CSS Fundamentals"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Step Type</Label>
                        <Select value={step.type} onValueChange={(value: 'Videos' | 'Blogs' | 'Quizzes') => updateStep(index, 'type', value)}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="Videos">📹 Videos</SelectItem>
                            <SelectItem value="Blogs">📝 Blogs</SelectItem>
                            <SelectItem value="Quizzes">🧩 Quizzes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Estimated Hours</Label>
                        <Input
                          type="number"
                          value={step.estimatedHours}
                          onChange={(e) => updateStep(index, 'estimatedHours', parseInt(e.target.value) || 0)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="5"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={step.description}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Describe what learners will do in this step..."
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Learning Objectives</Label>
                      <Textarea
                        value={step.learningObjectives}
                        onChange={(e) => updateStep(index, 'learningObjectives', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="What will learners achieve by completing this step?"
                        rows={2}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || !title || !description || skills.length === 0 || steps.length === 0}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Roadmap ({getTotalHours()}h total)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 