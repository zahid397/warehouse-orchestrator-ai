import { useState, useEffect } from 'react'
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaWarehouse,
  FaExclamationTriangle,
  FaChartBar,
  FaDownload,
  FaSync,
  FaSort,
  FaEye,
  FaTags,
  FaBarcode,
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
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Hardware',
    'Pharmaceuticals',
    'Automotive',
    'Furniture',
    'Other'
  ]

  const statuses = [
    { label: 'In Stock', value: 'in-stock', color: 'green' },
    { label: 'Low Stock', value: 'low-stock', color: 'yellow' },
    { label: 'Out of Stock', value: 'out-of-stock', color: 'red' },
    { label: 'Backorder', value: 'backorder', color: 'purple' },
    { label: 'Discontinued', value: 'discontinued', color: 'gray' }
  ]

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    filterInventory()
  }, [inventory, searchTerm, categoryFilter, statusFilter, sortBy])

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      // Mock data for demonstration
      const mockInventory = Array.from({ length: 50 }, (_, i) => ({
        id: `SKU-${1000 + i}`,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        quantity: Math.floor(Math.random() * 500),
        minQuantity: 50,
        maxQuantity: 400,
        status: statuses[Math.floor(Math.random() * statuses.length)].value,
        location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 100)}`,
        lastUpdated: format(new Date(Date.now() - Math.random() * 86400000 * 30), 'yyyy-MM-dd'),
        value: Math.floor(Math.random() * 1000) + 100
      }))
      setInventory(mockInventory)
      setFilteredInventory(mockInventory)
    } catch (error) {
      toast.error('Failed to load inventory')
    } finally {
      setIsLoading(false)
    }
  }

  const filterInventory = () => {
    let filtered = [...inventory]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'quantity':
          return b.quantity - a.quantity
        case 'value':
          return b.value - a.value
        default:
          return 0
      }
    })

    setFilteredInventory(filtered)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        toast.loading('Deleting item...')
        await apiService.deleteItem(itemId)
        toast.dismiss()
        toast.success('Item deleted successfully')
        fetchInventory()
      } catch (error) {
        toast.error('Failed to delete item')
      }
    }
  }

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleSaveItem = async (itemData) => {
    try {
      if (selectedItem) {
        // Update
        toast.loading('Updating item...')
        await apiService.updateItem(selectedItem.id, itemData)
        toast.dismiss()
        toast.success('Item updated successfully')
      } else {
        // Create
        toast.loading('Creating item...')
        await apiService.createItem(itemData)
        toast.dismiss()
        toast.success('Item created successfully')
      }
      setIsModalOpen(false)
      fetchInventory()
    } catch (error) {
      toast.error('Failed to save item')
    }
  }

  const inventoryStats = [
    { label: 'Total SKUs', value: inventory.length, icon: <FaBarcode />, color: 'blue' },
    { label: 'In Stock', value: inventory.filter(i => i.status === 'in-stock').length, icon: <FaBox />, color: 'green' },
    { label: 'Low Stock', value: inventory.filter(i => i.status === 'low-stock').length, icon: <FaExclamationTriangle />, color: 'yellow' },
    { label: 'Out of Stock', value: inventory.filter(i => i.status === 'out-of-stock').length, icon: <FaBox />, color: 'red' }
  ]

  const categoryDistribution = categories.map(category => ({
    name: category,
    value: inventory.filter(item => item.category === category).length
  }))

  const stockLevelData = [
    { range: '0-50', count: inventory.filter(item => item.quantity <= 50).length },
    { range: '51-100', count: inventory.filter(item => item.quantity > 50 && item.quantity <= 100).length },
    { range: '101-200', count: inventory.filter(item => item.quantity > 100 && item.quantity <= 200).length },
    { range: '201-500', count: inventory.filter(item => item.quantity > 200).length }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  if (isLoading) {
    return <Loader message="Loading inventory data..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage warehouse inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInventory}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleAddItem}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {inventoryStats.map((stat, index) => (
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
                placeholder="Search by SKU, name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="value">Sort by Value</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.slice(0, 12).map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                    item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {statuses.find(s => s.value === item.status)?.label}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{item.quantity} units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium flex items-center space-x-1">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">${item.value}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">Value: ${item.value}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.quantity} units</div>
                        <div className="text-xs text-gray-500">Min: {item.minQuantity}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                        item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {statuses.find(s => s.value === item.status)?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaMapMarkerAlt />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-primary-600 hover:text-primary-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="mx-auto text-gray-400 text-4xl mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Category Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stock Level Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="stat-card border-yellow-200 bg-yellow-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="text-yellow-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
          </div>
          <button className="text-yellow-700 hover:text-yellow-800 font-medium text-sm">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {inventory
            .filter(item => item.status === 'low-stock')
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>SKU: {item.id}</span>
                      <span>Current: {item.quantity} units</span>
                      <span>Minimum: {item.minQuantity} units</span>
                      <span>Location: {item.location}</span>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              defaultValue={selectedItem?.id || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              defaultValue={selectedItem?.name || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                defaultValue={selectedItem?.category || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                defaultValue={selectedItem?.quantity || 0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                defaultValue={selectedItem?.location || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue={selectedItem?.value || 0}
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
              onClick={() => handleSaveItem({})}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Inventory
