import { Link } from 'react-router-dom'
import { FaHome, FaRobot } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary-100 text-primary-600">
          <FaRobot className="text-3xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            <FaHome className="mr-2" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
