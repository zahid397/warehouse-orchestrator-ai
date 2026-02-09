import axios from 'axios'
import toast from 'react-hot-toast'

// For demo purposes, we'll use mock data
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
    return Promise.reject(error)
  }
)

// Mock data for demo
const mockRobots = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Robot-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'idle', 'maintenance'][Math.floor(Math.random() * 3)],
  battery: Math.floor(Math.random() * 50) + 50,
  task: ['Picking', 'Sorting', 'Packaging', 'Transporting'][Math.floor(Math.random() * 4)],
  location: `Zone-${String.fromCharCode(65 + (i % 4))}`,
  lastUpdate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
}))

const mockOrders = Array.from({ length: 12 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, '0')}`,
  customer: `Customer ${i + 1}`,
  status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
  items: Math.floor(Math.random() * 20) + 1,
  total: (Math.random() * 1000 + 100).toFixed(2),
  createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}))

// API Functions
export const apiService = {
  // Robots
  getRobots: async () => {
    // For demo, return mock data
    return { data: mockRobots }
  },

  getRobot: async (id) => {
    const robot = mockRobots.find(r => r.id === id)
    return { data: robot }
  },

  updateRobot: async (id, data) => {
    toast.success(`Robot ${id} updated successfully`)
    return { data: { ...data, id } }
  },

  // Orders
  getOrders: async () => {
    return { data: mockOrders }
  },

  createOrder: async (orderData) => {
    const newOrder = {
      id: `ORD-${String(mockOrders.length + 1).padStart(4, '0')}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    mockOrders.unshift(newOrder)
    toast.success('Order created successfully')
    return { data: newOrder }
  },

  updateOrder: async (id, data) => {
    toast.success(`Order ${id} updated successfully`)
    return { data: { id, ...data } }
  },

  // Analytics
  getAnalytics: async () => {
    const now = new Date()
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    }).reverse()

    return {
      data: {
        throughput: days.map(() => Math.floor(Math.random() * 500) + 1000),
        efficiency: days.map(() => Math.floor(Math.random() * 20) + 80),
        errors: days.map(() => Math.floor(Math.random() * 10)),
        revenue: days.map(() => Math.floor(Math.random() * 10000) + 50000),
        labels: days,
      }
    }
  },

  // AI Service
  getAIPrediction: async (prompt) => {
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = [
      "Based on current patterns, I recommend optimizing robot paths in Zone B to reduce travel time by 15%.",
      "Inventory analysis suggests restocking items A-123 and B-456 within 24 hours to prevent stockouts.",
      "Energy consumption can be reduced by 20% by scheduling non-essential tasks during off-peak hours.",
      "Predictive maintenance alert: Robot-07 shows signs of wear. Schedule maintenance within 48 hours."
    ]
    
    return { 
      data: { 
        prediction: responses[Math.floor(Math.random() * responses.length)],
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2)
      }
    }
  }
}

export default api
