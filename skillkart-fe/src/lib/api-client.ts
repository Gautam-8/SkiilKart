'use client'

import { toast } from 'sonner'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token')
    const baseHeaders = { 'Content-Type': 'application/json' }
    return token ? { ...baseHeaders, 'Authorization': `Bearer ${token}` } : baseHeaders
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('Session expired. Please login again.')
      window.location.href = '/'
      return null
    }

    if (response.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
      throw new Error('Forbidden')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      toast.error(error.message || 'Request failed')
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()

// Usage examples:
// const roadmaps = await apiClient.get('/roadmaps')
// const newResource = await apiClient.post('/resources', resourceData)
// await apiClient.delete(`/resources/${id}`) 