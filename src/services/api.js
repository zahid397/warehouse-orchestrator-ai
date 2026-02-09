import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const apiService = {
  // Dashboard endpoints
  getDashboardStats: () => axios.get(`${API_BASE_URL}/dashboard/stats`),
  getRobots: () => axios.get(`${API_BASE_URL}/robots`),
  getOrders: () => axios.get(`${API_BASE_URL}/orders`),
  getAnalytics: (timeRange = 'today') => axios.get(`${API_BASE_URL}/analytics?range=${timeRange}`),

  // Robot control endpoints
  getTelemetry: (robotId) => axios.get(`${API_BASE_URL}/robots/${robotId}/telemetry`),
  sendCommand: (robotId, command) => axios.post(`${API_BASE_URL}/robots/${robotId}/command`, { command }),
  startMission: (robotId, waypoints) => axios.post(`${API_BASE_URL}/robots/${robotId}/mission`, { waypoints }),
  emergencyStop: (robotId) => axios.post(`${API_BASE_URL}/robots/${robotId}/emergency-stop`),

  // Inventory endpoints
  getInventory: (filters = {}) => axios.get(`${API_BASE_URL}/inventory`, { params: filters }),
  createItem: (itemData) => axios.post(`${API_BASE_URL}/inventory`, itemData),
  updateItem: (itemId, itemData) => axios.put(`${API_BASE_URL}/inventory/${itemId}`, itemData),
  deleteItem: (itemId) => axios.delete(`${API_BASE_URL}/inventory/${itemId}`),

  // Task management endpoints
  getTasks: (filters = {}) => axios.get(`${API_BASE_URL}/tasks`, { params: filters }),
  createTask: (taskData) => axios.post(`${API_BASE_URL}/tasks`, taskData),
  updateTask: (taskId, taskData) => axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => axios.delete(`${API_BASE_URL}/tasks/${taskId}`),

  // Settings endpoints
  getSettings: () => axios.get(`${API_BASE_URL}/settings`),
  updateSettings: (settings) => axios.put(`${API_BASE_URL}/settings`, settings),
  changePassword: (currentPassword, newPassword) => axios.post(`${API_BASE_URL}/auth/change-password`, { currentPassword, newPassword }),

  // AI endpoints
  getAIPrediction: (query) => axios.post(`${API_BASE_URL}/ai/predict`, { query }),
  getAIOptimization: () => axios.get(`${API_BASE_URL}/ai/optimize`),

  // Mock data for development
  getMockData: (endpoint) => {
    const mockData = {
      '/dashboard/stats': {
        data: {
          activeRobots: 12,
          pendingOrders: 45,
          throughput: 2450,
          systemHealth: 98,
          energyConsumption: 1245,
          completionRate: 95.7
        }
      },
      '/robots': {
        data: Array.from({ length: 6 }, (_, i) => ({
          id: `robot-${i + 1}`,
          name: `Robot ${String.fromCharCode(65 + i)}-${(i + 1).toString().padStart(2, '0')}`,
          status: ['active', 'idle', 'maintenance', 'charging'][Math.floor(Math.random() * 4)],
          battery: Math.floor(Math.random() * 50) + 50,
          location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
          currentTask: `Task ${Math.floor(Math.random() * 1000)}`,
          efficiency: Math.floor(Math.random() * 30) + 70
        }))
      },
      // Add more mock data as needed
    }
    
    return Promise.resolve(mockData[endpoint] || { data: {} })
  }
}

// Interceptor for mock data in development
if (import.meta.env.DEV) {
  const originalGet = apiService.getRobots
  apiService.getRobots = () => apiService.getMockData('/robots')
  
  const originalGetStats = apiService.getDashboardStats
  apiService.getDashboardStats = () => apiService.getMockData('/dashboard/stats')
}

export { apiService }
