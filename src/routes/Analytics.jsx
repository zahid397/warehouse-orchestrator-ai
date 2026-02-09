import { useState, useEffect } from 'react'
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaRobot,
  FaBox,
  FaClock,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaTable
} from 'react-icons/fa'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import Loader from '../components/Loader'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [selectedMetric, setSelectedMetric] = useState('throughput')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getAnalytics(timeRange)
      setMetrics(response.data)
    } catch (error) {
      toast.error('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for demonstration
  const throughputData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    throughput: Math.floor(Math.random() * 500) + 1500,
    efficiency: Math.floor(Math.random() * 15) + 85,
    errors: Math.floor(Math.random() * 20)
  }))

  const robotPerformanceData = [
    { robot: 'Alpha-01', tasks: 245, success: 98.2, avgTime: '12.4m' },
    { robot: 'Beta-02', tasks: 198, success: 96.8, avgTime: '15.2m' },
    { robot: 'Gamma-03', tasks: 312, success: 99.1, avgTime: '10.8m' },
    { robot: 'Delta-04', tasks: 178, success: 95.4, avgTime: '18.6m' },
    { robot: 'Epsilon-05', tasks: 267, success: 97.9, avgTime: '13.2m' }
  ]

  const zoneEfficiencyData = [
    { zone: 'A', efficiency: 94, utilization: 78, avgDwell: '6.4m' },
    { zone: 'B', efficiency: 88, utilization: 92, avgDwell: '12.8m' },
    { zone: 'C', efficiency: 96, utilization: 65, avgDwell: '5.2m' },
    { zone: 'D', efficiency: 91, utilization: 84, avgDwell: '9.7m' },
    { zone: 'E', efficiency: 85, utilization: 71, avgDwell: '15.3m' }
  ]

  const costAnalysisData = [
    { category: 'Energy', cost: 12500, trend: -5, color: '#3b82f6' },
    { category: 'Maintenance', cost: 8400, trend: 12, color: '#ef4444' },
    { category: 'Labor', cost: 32500, trend: -8, color: '#10b981' },
    { category: 'Infrastructure', cost: 15600, trend: 2, color: '#f59e0b' },
    { category: 'Software', cost: 7800, trend: 0, color: '#8b5cf6' }
  ]

  const kpiCards = [
    {
      title: 'Total Throughput',
      value: '45.8K',
      change: '+12.5%',
      isPositive: true,
      icon: <FaChartLine className="text-blue-600" />,
      description: 'Units processed this month'
    },
    {
      title: 'Avg Efficiency',
      value: '94.2%',
      change: '+2.8%',
      isPositive: true,
      icon: <FaChartBar className="text-green-600" />,
      description: 'Compared to last month'
    },
    {
      title: 'Robot Utilization',
      value: '82.7%',
      change: '-1.3%',
      isPositive: false,
      icon: <FaRobot className="text-purple-600" />,
      description: 'Active time ratio'
    },
    {
      title: 'Cost per Unit',
      value: '$2.45',
      change: '-8.2%',
      isPositive: true,
      icon: <FaDollarSign className="text-red-600" />,
      description: 'Operational efficiency'
    }
  ]

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: 'Quarter' },
    { id: 'ytd', label: 'Year to Date' }
  ]

  if (isLoading) {
    return <Loader message="Loading analytics data..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <FaDownload />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <FaEye />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-50 rounded-lg">
                {card.icon}
              </div>
              <span className={`flex items-center space-x-1 text-sm font-semibold ${
                card.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                <span>{card.change}</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="font-medium text-gray-900 mb-1">{card.title}</p>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput Trend */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Throughput Trend</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>Last 30 days</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Throughput (units)"
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Efficiency %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Robot Performance */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Robot Performance</h2>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View Details
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={robotPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="robot" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="tasks" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Tasks Completed"
                />
                <Bar 
                  dataKey="success" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  name="Success Rate %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone Efficiency Radar */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Zone Efficiency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={zoneEfficiencyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="zone" />
                <PolarRadiusAxis />
                <Radar
                  name="Efficiency"
                  dataKey="efficiency"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Utilization"
                  dataKey="utilization"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cost Analysis</h2>
          <div className="space-y-4">
            {costAnalysisData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <span className="font-bold text-gray-900">${item.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(item.cost / 50000) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${item.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.trend >= 0 ? '+' : ''}{item.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Order Accuracy</span>
                <span className="font-bold text-gray-900">99.4%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '99.4%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Robot Uptime</span>
                <span className="font-bold text-gray-900">98.7%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Energy Efficiency</span>
                <span className="font-bold text-gray-900">92.3%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '92.3%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-bold text-gray-900">2.8s</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Detailed Performance</h2>
          <button className="btn-secondary flex items-center space-x-2">
            <FaTable />
            <span>Full Table</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Robot</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Tasks</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Success Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Avg Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Energy Used</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {robotPerformanceData.map((robot, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <FaRobot className="text-gray-400" />
                      <span className="font-medium text-gray-900">{robot.robot}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{robot.tasks}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{robot.success}%</span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{robot.avgTime}</td>
                  <td className="py-3 px-4 text-gray-900">
                    {Math.floor(Math.random() * 200) + 400} kWh
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      robot.success > 97 ? 'bg-green-100 text-green-800' :
                      robot.success > 95 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {robot.success > 97 ? 'Excellent' : robot.success > 95 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="stat-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📊 AI Insights & Recommendations</h2>
          <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            Powered by Gemini AI
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <h4 className="font-bold text-gray-900 mb-2">Optimization Opportunity</h4>
            <p className="text-sm text-gray-700">
              Zone B shows 15% lower efficiency. Consider reconfiguring storage layout to reduce travel distance by 28%.
            </p>
          </div>
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <h4 className="font-bold text-gray-900 mb-2">Cost Reduction</h4>
            <p className="text-sm text-gray-700">
              Shift 30% of operations to off-peak hours to save $2,400/month on energy costs.
            </p>
          </div>
          <div className="p-4 bg-white/80 rounded-lg border border-white/50">
            <h4 className="font-bold text-gray-900 mb-2">Predictive Maintenance</h4>
            <p className="text-sm text-gray-700">
              Schedule maintenance for Robot Delta-04 within 72 hours to prevent potential downtime.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-200">
          <div className="text-sm text-gray-600">
            Last analysis: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
