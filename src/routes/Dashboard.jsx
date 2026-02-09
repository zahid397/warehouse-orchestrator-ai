import { useState, useEffect } from 'react'
import {
  FaRobot,
  FaBoxOpen,
  FaChartLine,
  FaCogs,
  FaBolt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaPlay,
  FaPause,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaWarehouse,
  FaMapMarkerAlt,
  FaThermometerHalf
} from 'react-icons/fa'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { format } from 'date-fns'
import RobotCard from '../components/RobotCard'
import TaskQueue from '../components/TaskQueue'
import HeatMap from '../components/HeatMap'
import Loader from '../components/Loader'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeRobots: 0,
    pendingOrders: 0,
    throughput: 0,
    systemHealth: 0,
    energyConsumption: 0,
    completionRate: 0
  })
  
  const [robots, setRobots] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [timeRange, setTimeRange] = useState('today')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [performanceData, setPerformanceData] = useState([])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      const [robotsData, ordersData, analyticsData] = await Promise.all([
        apiService.getRobots(),
        apiService.getOrders(),
        apiService.getAnalytics()
      ])
      
      // Calculate stats
      const activeRobots = robotsData.data.filter(r => r.status === 'active').length
      const pendingOrders = ordersData.data.filter(o => o.status === 'pending').length
      
      setStats({
        activeRobots,
        pendingOrders,
        throughput: Math.floor(Math.random() * 500) + 2000,
        systemHealth: 98,
        energyConsumption: 1245,
        completionRate: 95.7
      })
      
      setRobots(robotsData.data.slice(0, 6))
      setOrders(ordersData.data.slice(0, 5))
      setAnalytics(analyticsData.data)
      
      // Generate performance data
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00'
        return {
          hour,
          throughput: Math.floor(Math.random() * 200) + 800,
          efficiency: Math.floor(Math.random() * 20) + 80,
          energy: Math.floor(Math.random() * 100) + 200
        }
      })
      setPerformanceData(hours)
      
      // Generate recent tasks
      const tasks = [
        { id: 1, robot: 'Alpha-01', task: 'Order #4567 picking', status: 'completed', duration: '15m', priority: 'high' },
        { id: 2, robot: 'Beta-02', task: 'Restock Zone B', status: 'in-progress', duration: '25m', priority: 'medium' },
        { id: 3, robot: 'Gamma-03', task: 'Inventory scan', status: 'pending', duration: '30m', priority: 'low' },
        { id: 4, robot: 'Delta-04', task: 'Package sorting', status: 'completed', duration: '12m', priority: 'high' },
        { id: 5, robot: 'Epsilon-05', task: 'Quality check', status: 'failed', duration: '8m', priority: 'medium' },
      ]
      setRecentTasks(tasks)
      
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const quickStats = [
    {
      label: 'Active Robots',
      value: stats.activeRobots,
      change: '+2',
      icon: <FaRobot className="text-primary-600" size={20} />,
      color: 'primary',
      metric: '/ 24 total'
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      change: '-12',
      icon: <FaBoxOpen className="text-success-600" size={20} />,
      color: 'success',
      metric: 'orders'
    },
    {
      label: 'Throughput',
      value: `${(stats.throughput / 1000).toFixed(1)}K`,
      change: '+8%',
      icon: <FaChartLine className="text-warning-600" size={20} />,
      color: 'warning',
      metric: 'units/day'
    },
    {
      label: 'System Health',
      value: `${stats.systemHealth}%`,
      change: '+2%',
      icon: <FaCogs className="text-danger-600" size={20} />,
      color: 'danger',
      metric: 'uptime'
    },
    {
      label: 'Energy Usage',
      value: `${stats.energyConsumption}kWh`,
      change: '-5%',
      icon: <FaBolt className="text-purple-600" size={20} />,
      color: 'purple',
      metric: 'today'
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      change: '+1.2%',
      icon: <FaCheckCircle className="text-teal-600" size={20} />,
      color: 'teal',
      metric: 'success rate'
    }
  ]

  const robotStatusData = [
    { name: 'Active', value: stats.activeRobots, color: '#10b981' },
    { name: 'Idle', value: 6, color: '#f59e0b' },
    { name: 'Maintenance', value: 3, color: '#ef4444' },
    { name: 'Charging', value: 4, color: '#3b82f6' }
  ]

  const orderStatusData = [
    { name: 'Pending', value: 156, color: '#f59e0b' },
    { name: 'Processing', value: 89, color: '#3b82f6' },
    { name: 'Shipped', value: 245, color: '#10b981' },
    { name: 'Delivered', value: 567, color: '#8b5cf6' }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const handleRefresh = () => {
    fetchDashboardData()
    toast.success('Dashboard refreshed')
  }

  const handleRunOptimization = async () => {
    try {
      toast.loading('Running AI optimization...')
      const result = await apiService.getAIPrediction('Optimize warehouse operations')
      toast.dismiss()
      toast.success('Optimization complete! ' + result.data.prediction)
    } catch (error) {
      toast.error('Optimization failed')
    }
  }

  if (isLoading) {
    return <Loader message="Loading dashboard data..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleRunOptimization}
            className="btn-primary flex items-center space-x-2"
          >
            <FaChartLine />
            <span>AI Optimize</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-success-600' : 'text-danger-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <p className="text-xs text-gray-500">{stat.metric}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Robot Fleet Status */}
        <div className="xl:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Robot Fleet Status</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FaFilter className="text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FaDownload className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {robots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <button className="w-full py-3 text-primary-600 hover:text-primary-800 font-medium flex items-center justify-center space-x-2">
              <span>View All Robots</span>
              <FaPlay className="text-sm" />
            </button>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>Last 24 hours</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Throughput (units/hr)"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Efficiency %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Peak Throughput</div>
              <div className="text-lg font-bold text-gray-900">1,450/hr</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Avg Efficiency</div>
              <div className="text-lg font-bold text-gray-900">92.4%</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Energy Peak</div>
              <div className="text-lg font-bold text-gray-900">315 kWh</div>
            </div>
          </div>
        </div>

        {/* Task Queue */}
        <div className="stat-card">
          <TaskQueue tasks={recentTasks} />
        </div>

        {/* Robot Distribution */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Robot Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={robotStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {robotStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {robotStatusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{status.name}</span>
                </div>
                <span className="font-medium">{status.value} robots</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Orders Today</span>
              <span className="font-bold text-gray-900">1,057</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Processing Time</span>
              <span className="font-bold text-gray-900">24.5 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On-time Delivery</span>
              <span className="font-bold text-green-600">98.2%</span>
            </div>
          </div>
        </div>

        {/* Heat Map Section */}
        <div className="xl:col-span-3 stat-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Warehouse Heat Map</h2>
              <p className="text-sm text-gray-600">Activity concentration across zones</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High</span>
              </div>
            </div>
          </div>
          <HeatMap />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Most Active Zone</div>
              <div className="text-lg font-bold text-gray-900">Zone B</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Peak Activity Time</div>
              <div className="text-lg font-bold text-gray-900">14:00-15:00</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Avg Dwell Time</div>
              <div className="text-lg font-bold text-gray-900">8.4 min</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Space Utilization</div>
              <div className="text-lg font-bold text-gray-900">78%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
          <button className="text-primary-600 hover:text-primary-800 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="text-yellow-600" />
              <div>
                <h4 className="font-medium text-gray-900">Robot Beta-02 requires maintenance</h4>
                <p className="text-sm text-gray-600">Unusual vibration detected in motor assembly</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">10 min ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaThermometerHalf className="text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Temperature alert in Zone C</h4>
                <p className="text-sm text-gray-600">Ambient temperature exceeds 32°C</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">25 min ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Inventory low for SKU A-456</h4>
                <p className="text-sm text-gray-600">Stock level below minimum threshold</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="stat-card bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">🤖 AI Insights</h2>
          <span className="text-sm px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
            Live Analysis
          </span>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <p className="text-gray-800">
              <span className="font-semibold">Optimization Suggestion:</span> Consolidate picking routes 
              in Zone B to reduce travel time by 18%. AI predicts 15% energy savings during peak hours.
            </p>
          </div>
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <p className="text-gray-800">
              <span className="font-semibold">Predictive Maintenance:</span> Robot Gamma-03 shows signs 
              of motor wear. Schedule maintenance within 48 hours to prevent downtime.
            </p>
          </div>
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <p className="text-gray-800">
              <span className="font-semibold">Demand Forecast:</span> Increased order volume expected 
              tomorrow. Recommend activating 3 additional robots during 14:00-18:00 period.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </div>
          <button
            onClick={handleRunOptimization}
            className="btn-primary flex items-center space-x-2"
          >
            <FaChartLine />
            <span>Run AI Analysis</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
