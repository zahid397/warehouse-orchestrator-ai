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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
            <select
              value={robotFilter}
              onChange={(e) => setRobotFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Robots</option>
              {robots.map(robot => (
                <option key={robot} value={robot}>{robot}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="created">Sort by Created</option>
              <option value="priority">Sort by Priority</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${getStatusColor(task.status)}-100 text-${getStatusColor(task.status)}-800`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <FaRobot className="text-gray-400" />
                      <span className="text-gray-700">Robot: <strong>{task.assignedTo}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-gray-700">Location: <strong>{task.location}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaBox className="text-gray-400" />
                      <span className="text-gray-700">Items: <strong>{task.items}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaClock className="text-gray-400" />
                      <span className="text-gray-700">Duration: <strong>{task.estimatedDuration}m</strong></span>
                    </div>
                  </div>

                  <TaskProgress 
                    progress={task.progress} 
                    status={task.status}
                    estimatedDuration={task.estimatedDuration}
                    started={task.started}
                  />
                </div>

                <div className="flex flex-col space-y-2 min-w-[200px]">
                  <div className="text-sm text-gray-600">
                    Created: {formatDistanceToNow(new Date(task.created), { addSuffix: true })}
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleTaskAction(task.id, 'start')}
                        className="flex-1 btn-primary py-1.5 text-sm"
                      >
                        <FaPlay className="inline mr-1" /> Start
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => handleTaskAction(task.id, 'pause')}
                          className="flex-1 btn-secondary py-1.5 text-sm"
                        >
                          <FaPause className="inline mr-1" /> Pause
                        </button>
                        <button
                          onClick={() => handleTaskAction(task.id, 'complete')}
                          className="flex-1 btn-success py-1.5 text-sm"
                        >
                          <FaCheckCircle className="inline mr-1" /> Complete
                        </button>
                      </>
                    )}
                    {(task.status === 'pending' || task.status === 'in-progress') && (
                      <button
                        onClick={() => handleTaskAction(task.id, 'cancel')}
                        className="flex-1 btn-danger py-1.5 text-sm"
                      >
                        <FaStop className="inline mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-1.5 text-primary-600 hover:text-primary-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="p-1.5 text-gray-600 hover:text-gray-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <FaBox className="mx-auto text-gray-400 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Task Status Distribution</h2>
          <div className="space-y-4">
            {statuses.map((status) => {
              const count = tasks.filter(t => t.status === status.value).length
              const percentage = tasks.length > 0 ? (count / tasks.length * 100).toFixed(1) : 0
              
              return (
                <div key={status.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded bg-${status.color}-100`}>
                        {status.icon}
                      </div>
                      <span className="font-medium text-gray-900">{status.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${status.color}-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Task Types</h2>
          <div className="space-y-3">
            {taskTypes.map((type) => {
              const count = tasks.filter(t => t.type === type).length
              if (count === 0) return null
              
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{type}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm font-medium">
                    {count} tasks
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Robot Workload</h2>
          <div className="space-y-4">
            {robots.map((robot) => {
              const robotTasks = tasks.filter(t => t.assignedTo === robot)
              const activeTasks = robotTasks.filter(t => t.status === 'in-progress').length
              const totalTasks = robotTasks.length
              
              return (
                <div key={robot} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaRobot className="text-gray-400" />
                      <span className="font-medium text-gray-900">{robot}</span>
                    </div>
                    <span className="font-bold text-gray-900">{activeTasks}/{totalTasks} active</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(activeTasks / Math.max(totalTasks, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              defaultValue={selectedTask?.title || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              defaultValue={selectedTask?.description || ''}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <select
                defaultValue={selectedTask?.type || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                {taskTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                defaultValue={selectedTask?.priority || 'medium'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Robot
              </label>
              <select
                defaultValue={selectedTask?.assignedTo || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select robot</option>
                {robots.map(robot => (
                  <option key={robot} value={robot}>{robot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                defaultValue={selectedTask?.location || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue={selectedTask?.estimatedDuration || 30}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Items
              </label>
              <input
                type="number"
                defaultValue={selectedTask?.items || 10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {selectedTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskManager
