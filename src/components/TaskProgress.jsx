import { FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'

const TaskProgress = ({ progress, status, estimatedDuration, started }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'in-progress': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-600" />
      case 'failed': return <FaExclamationTriangle className="text-red-600" />
      default: return <FaClock className="text-yellow-600" />
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-gray-700">
            {status === 'in-progress' ? 'In Progress' : 
             status === 'completed' ? 'Completed' :
             status === 'failed' ? 'Failed' : 'Pending'}
          </span>
        </div>
        <span className="font-bold text-gray-900">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {started && status === 'in-progress' && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Started {formatDistanceToNow(new Date(started), { addSuffix: true })}</span>
          <span>Est. duration: {estimatedDuration} minutes</span>
        </div>
      )}
    </div>
  )
}

export default TaskProgress
