import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaTachometerAlt, 
  FaRobot, 
  FaClipboardList, 
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt
} from 'react-icons/fa'

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/robot-control', icon: <FaRobot />, label: 'Robot Control' },
    { path: '/orders', icon: <FaClipboardList />, label: 'Orders' },
    { path: '/analytics', icon: <FaChartBar />, label: 'Analytics' },
  ]

  const secondaryItems = [
    { icon: <FaCog />, label: 'Settings' },
    { icon: <FaQuestionCircle />, label: 'Help & Support' },
    { icon: <FaSignOutAlt />, label: 'Logout' },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
      <div className="p-6">
        {/* Navigation Items */}
        <nav className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span className={`text-lg ${({ isActive }) => isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-12">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            System
          </p>
          {secondaryItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 w-full text-left transition-all duration-200"
            >
              <span className="text-lg text-gray-500">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-12 p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl text-white">
          <h3 className="font-semibold mb-2">System Status</h3>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">All Systems Operational</span>
          </div>
          <p className="text-xs opacity-90">Last updated: 2 minutes ago</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
