import { Link } from 'react-router-dom'
import { FaArrowRight, FaRobot, FaBoxOpen, FaChartLine, FaCogs } from 'react-icons/fa'
import RobotCard from '../components/RobotCard'

const Home = () => {
  const quickStats = [
    { label: 'Active Robots', value: '24', change: '+2', icon: <FaRobot className="text-primary-600" />, color: 'primary' },
    { label: 'Pending Orders', value: '156', change: '-12', icon: <FaBoxOpen className="text-success-600" />, color: 'success' },
    { label: 'Daily Throughput', value: '2.4K', change: '+8%', icon: <FaChartLine className="text-warning-600" />, color: 'warning' },
    { label: 'System Health', value: '98%', change: '+2%', icon: <FaCogs className="text-danger-600" />, color: 'danger' },
  ]

  const robots = [
    { id: 1, name: 'Alpha-01', status: 'active', battery: 85, task: 'Picking', location: 'Zone A' },
    { id: 2, name: 'Beta-02', status: 'idle', battery: 92, task: 'Standby', location: 'Charging Bay' },
    { id: 3, name: 'Gamma-03', status: 'maintenance', battery: 45, task: 'Maintenance', location: 'Service Bay' },
    { id: 4, name: 'Delta-04', status: 'active', battery: 78, task: 'Sorting', location: 'Zone B' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-bg rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Warehouse Orchestrator AI</h1>
        <p className="text-xl opacity-90 mb-8">
          Intelligent automation for your warehouse operations. Monitor, control, and optimize in real-time.
        </p>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Go to Dashboard
            <FaArrowRight className="inline ml-2" />
          </Link>
          <Link to="/robot-control" className="btn-secondary bg-white/20 text-white hover:bg-white/30">
            Control Robots
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-success-600' : 'text-danger-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Robot Status */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Robot Fleet Status</h2>
            <Link to="/robot-control" className="text-primary-600 hover:text-primary-800 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {robots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} compact />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'New Order', icon: '📦', color: 'bg-blue-100 text-blue-700' },
              { title: 'Schedule Pick', icon: '🤖', color: 'bg-green-100 text-green-700' },
              { title: 'Run Report', icon: '📊', color: 'bg-purple-100 text-purple-700' },
              { title: 'System Check', icon: '⚙️', color: 'bg-orange-100 text-orange-700' },
            ].map((action, index) => (
              <button
                key={index}
                className="p-6 rounded-xl text-center transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center text-2xl mx-auto mb-3`}>
                  {action.icon}
                </div>
                <span className="font-medium text-gray-900">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
