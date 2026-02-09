import { useState } from 'react'
import { Bell, Search, User, Menu, X } from 'react-icons/fa'
import { FaRobot, FaBell, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
                <FaRobot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Warehouse Orchestrator AI</h1>
                <p className="text-sm text-gray-600">Smart Warehouse Management System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6 hidden lg:block">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search robots, orders, analytics..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FaSearch size={20} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="mt-4 lg:hidden animate-slide-in">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
