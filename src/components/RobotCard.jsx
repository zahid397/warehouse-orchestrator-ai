import { FaBatteryFull, FaMapMarkerAlt, FaPlay, FaPause, FaSync } from 'react-icons/fa'
import classNames from 'classnames'

const RobotCard = ({ robot, compact = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-500'
      case 'idle': return 'bg-warning-500'
      case 'maintenance': return 'bg-danger-500'
      case 'charging': return 'bg-primary-500'
      default: return 'bg-gray-500'
    }
  }

  const getBatteryColor = (level) => {
    if (level > 70) return 'text-success-600'
    if (level > 30) return 'text-warning-600'
    return 'text-danger-600'
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <FaRobot className="text-white text-xl" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(robot.status)}`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{robot.name}</h3>
            <p className="text-sm text-gray-600">{robot.task}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-semibold ${getBatteryColor(robot.battery)}`}>
            {robot.battery}%
          </div>
          <div className="text-sm text-gray-600">{robot.location}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
              <FaRobot className="text-white text-2xl" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(robot.status)} border-2 border-white`}></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{robot.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`badge ${robot.status === 'active' ? 'badge-success' : robot.status === 'idle' ? 'badge-warning' : 'badge-danger'}`}>
                {robot.status}
              </span>
              <span className="text-sm text-gray-600">ID: ROB-{robot.id.toString().padStart(3, '0')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FaPlay className="text-success-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FaPause className="text-warning-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FaSync className="text-primary-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <FaBatteryFull />
            <span className="text-sm">Battery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-full rounded-full ${getBatteryColor(robot.battery).replace('text-', 'bg-')}`}
                style={{ width: `${robot.battery}%` }}
              ></div>
            </div>
            <span className={`font-semibold ${getBatteryColor(robot.battery)}`}>
              {robot.battery}%
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <FaMapMarkerAlt />
            <span className="text-sm">Location</span>
          </div>
          <p className="font-medium">{robot.location}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Current Task</p>
            <p className="font-medium">{robot.task}</p>
          </div>
          <button className="btn-primary px-4 py-2 text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default RobotCard
