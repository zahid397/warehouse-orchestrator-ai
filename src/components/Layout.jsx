import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaRobot,
  FaChartBar,
  FaBox,
  FaTasks,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaBell,
  FaQuestionCircle
} from 'react-icons/fa'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/robot-control', label: 'Robot Control', icon: <FaRobot /> },
    { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { path: '/inventory', label: 'Inventory', icon: <FaBox /> },
    { path: '/task-manager', label: 'Task Manager', icon: <FaTasks /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-900 text-white">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-2xl text-primary-400" />
              <span className="text-xl font-bold">Warehouse AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <FaUser />
              </div>
              <div className="flex-1">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-400">System Administrator</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-2xl text-primary-400" />
                <span className="text-xl font-bold">Warehouse AI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={24} />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <FaBars size={20} />
              </button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <FaQuestionCircle size={20} />
              </button>
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
