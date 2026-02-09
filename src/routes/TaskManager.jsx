import { useState, useEffect } from 'react'
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaPlay,
  FaPause,
  FaStop,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRobot,
  FaBox,
  FaMapMarkerAlt,
  FaSort,
  FaDownload,
  FaSync,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser
} from 'react-icons/fa'
import { format, formatDistanceToNow } from 'date-fns'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import TaskProgress from '../components/TaskProgress'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const TaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [robotFilter, setRobotFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('created')

  const statuses = [
    { label: 'Pending', value: 'pending', color: 'yellow', icon: <FaClock /> },
    { label: 'In Progress', value: 'in-progress', color: 'blue', icon: <FaPlay /> },
    { label: 'Completed', value: 'completed', color: 'green', icon: <FaCheckCircle /> },
    { label: 'Failed', value: 'failed', color: 'red', icon: <FaExclamationTriangle /> },
    { label: 'Cancelled', value: 'cancelled', color: 'gray', icon: <FaStop /> }
  ]

  const priorities = [
    { label: 'High', value: 'high', color: 'red' },
    { label: 'Medium', value: 'medium', color: 'yellow' },
    { label: 'Low', value: 'low', color: 'green' }
  ]

  const taskTypes = [
    'Order Picking',
    'Inventory Restock',
    'Quality Check',
    'Package Sorting',
    'Zone Transfer',
    'Maintenance',
    'Inventory Scan',
    'Cleaning'
  ]

  const robots = ['Alpha-01', 'Beta-02', 'Gamma-03', 'Delta-04', 'Epsilon-05']

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter, robotFilter, sortBy])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      // Mock data for demonstration
      const mockTasks = Array.from({ length: 30 }, (_, i) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)].value
        const priority = priorities[Math.floor(Math.random() * priorities.length)].value
        const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7)
        
        return {
          id: `TASK-${1000 + i}`,
          title: `${taskTypes[Math.floor(Math.random() * taskTypes.length)]} #${i + 1}`,
          description: `Task description for task ${i + 1}`,
          type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
          status,
          priority,
          assignedTo: robots[Math.floor(Math.random() * robots.length)],
          created: createdAt,
          started: status !== 'pending' ? new Date(createdAt.getTime() + 60000) : null,
          completed: status === 'completed' ? new Date(createdAt.getTime() + Math.random() * 3600000) : null,
          estimatedDuration: Math.floor(Math.random() * 60) + 10, // minutes
          progress: status === 'completed' ? 100 : status === 'pending' ? 0 : Math.floor(Math.random() * 100),
          location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
          items: Math.floor(Math.random() * 50) + 5
        }
      })
      setTasks(mockTasks)
      setFilteredTasks(mockTasks)
    } catch (error) {
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Robot filter
    if (robotFilter !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === robotFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.created) - new Date(a.created)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'progress':
          return b.progress - a.progress
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        toast.loading('Deleting task...')
        await apiService.deleteTask(taskId)
        toast.dismiss()
        toast.success('Task deleted successfully')
        fetchTasks()
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleTaskAction = async (taskId, action) => {
    try {
      toast.loading(`Performing ${action}...`)
      await apiService.updateTask(taskId, { action })
      toast.dismiss()
      toast.success(`Task ${action} successfully`)
      fetchTasks()
    } catch (error) {
      toast.error(`Failed to ${action} task`)
    }
  }

  const taskStats = [
    { label: 'Total Tasks', value: tasks.length, icon: <FaBox />, color: 'blue' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: <FaPlay />, color: 'green' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: <FaClock />, color: 'yellow' },
    { label: 'Completed Today', value: tasks.filter(t => 
      t.status === 'completed' && 
      format(new Date(t.completed), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length, icon: <FaCheckCircle />, color: 'purple' }
  ]

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj ? statusObj.color : 'gray'
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj ? priorityObj.color : 'gray'
  }

  if (isLoading) {
    return <Loader message="Loading tasks..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600">Manage and monitor warehouse tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTasks}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleCreateTask}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {taskStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="stat-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4
