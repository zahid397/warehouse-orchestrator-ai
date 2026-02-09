import { useState, useEffect } from 'react'
import {
  FaRobot,
  FaPlay,
  FaPause,
  FaStop,
  FaUndo,
  FaMapMarkedAlt,
  FaRoute,
  FaBatteryFull,
  FaWifi,
  FaCogs,
  FaExclamationTriangle,
  FaChartBar,
  FaHistory,
  FaCog,
  FaTools
} from 'react-icons/fa'
import RobotMap from '../components/RobotMap'
import ControlPanel from '../components/ControlPanel'
import TelemetryDisplay from '../components/TelemetryDisplay'
import TaskHistory from '../components/TaskHistory'
import Loader from '../components/Loader'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const RobotControl = () => {
  const [selectedRobot, setSelectedRobot] = useState(null)
  const [robots, setRobots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('control')
  const [telemetryData, setTelemetryData] = useState(null)
  const [waypoints, setWaypoints] = useState([])
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    fetchRobots()
    const interval = setInterval(fetchRobots, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedRobot) {
      fetchTelemetry(selectedRobot.id)
      const telemetryInterval = setInterval(() => {
        fetchTelemetry(selectedRobot.id)
      }, 2000)
      return () => clearInterval(telemetryInterval)
    }
  }, [selectedRobot])

  const fetchRobots = async () => {
    try {
      const response = await apiService.getRobots()
      setRobots(response.data)
      if (!selectedRobot && response.data.length > 0) {
        setSelectedRobot(response.data[0])
      }
    } catch (error) {
      toast.error('Failed to load robots')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTelemetry = async (robotId) => {
    try {
      const response = await apiService.getTelemetry(robotId)
      setTelemetryData(response.data)
    } catch (error) {
      console.error('Failed to fetch telemetry:', error)
    }
  }

  const handleRobotSelect = (robot) => {
    setSelectedRobot(robot)
    toast.success(`Selected ${robot.name}`)
  }

  const handleCommand = async (command) => {
    if (!selectedRobot) {
      toast.error('Please select a robot first')
      return
    }

    try {
      toast.loading(`Sending ${command} command...`)
      const response = await apiService.sendCommand(selectedRobot.id, command)
      toast.dismiss()
      toast.success(`Command sent: ${command}`)
      
      // Update local state
      setRobots(prev => prev.map(robot => 
        robot.id === selectedRobot.id 
          ? { ...robot, status: command === 'stop' ? 'idle' : command }
          : robot
      ))
    } catch (error) {
      toast.error('Failed to send command')
    }
  }

  const handleWaypointAdd = (waypoint) => {
    setWaypoints([...waypoints, waypoint])
    toast.success('Waypoint added')
  }

  const handleMissionStart = async () => {
    if (waypoints.length === 0) {
      toast.error('Please add waypoints first')
      return
    }

    try {
      setIsSimulating(true)
      toast.loading('Starting mission...')
      const response = await apiService.startMission(selectedRobot.id, waypoints)
      toast.dismiss()
      toast.success('Mission started!')
      setSelectedRobot(prev => ({ ...prev, status: 'active' }))
    } catch (error) {
      toast.error('Failed to start mission')
    } finally {
      setIsSimulating(false)
    }
  }

  const handleEmergencyStop = async () => {
    if (!selectedRobot) return

    try {
      toast.loading('Emergency stopping...')
      await apiService.emergencyStop(selectedRobot.id)
      toast.dismiss()
      toast.success('Emergency stop activated')
      setSelectedRobot(prev => ({ ...prev, status: 'emergency' }))
    } catch (error) {
      toast.error('Emergency stop failed')
    }
  }

  const robotStats = [
    { label: 'Total Robots', value: robots.length, icon: <FaRobot />, color: 'blue' },
    { label: 'Active', value: robots.filter(r => r.status === 'active').length, icon: <FaPlay />, color: 'green' },
    { label: 'Idle', value: robots.filter(r => r.status === 'idle').length, icon: <FaPause />, color: 'yellow' },
    { label: 'Maintenance', value: robots.filter(r => r.status === 'maintenance').length, icon: <FaTools />, color: 'red' }
  ]

  if (isLoading) {
    return <Loader message="Loading robot control interface..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Robot Control Center</h1>
          <p className="text-gray-600">Real-time control and monitoring of warehouse robots</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchRobots()}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaUndo />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleEmergencyStop}
            className="btn-danger flex items-center space-x-2"
            disabled={!selectedRobot}
          >
            <FaStop />
            <span>Emergency Stop</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {robotStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Robot List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="stat-card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Robot Fleet</h2>
            <div className="space-y-3">
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  onClick={() => handleRobotSelect(robot)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRobot?.id === robot.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        robot.status === 'active' ? 'bg-green-100 text-green-600' :
                        robot.status === 'idle' ? 'bg-yellow-100 text-yellow-600' :
                        robot.status === 'maintenance' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <FaRobot />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{robot.name}</h3>
                        <p className="text-sm text-gray-600">ID: {robot.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      robot.status === 'active' ? 'bg-green-100 text-green-800' :
                      robot.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                      robot.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <FaBatteryFull className="text-gray-500" />
                      <span>{robot.battery || 85}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaWifi className="text-gray-500" />
                      <span>{robot.signal || 'Strong'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCogs className="text-gray-500" />
                      <span>{robot.tasks || 0} tasks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div className="stat-card">
            <ControlPanel
              selectedRobot={selectedRobot}
              onCommand={handleCommand}
              onMissionStart={handleMissionStart}
              isSimulating={isSimulating}
            />
          </div>
        </div>

        {/* Middle Panel: Map & Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Warehouse Map</h2>
              <div className="flex items-center space-x-2">
                <button className="btn-secondary flex items-center space-x-2">
                  <FaMapMarkedAlt />
                  <span>Add Waypoint</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <FaRoute />
                  <span>Plan Route</span>
                </button>
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
              <RobotMap
                selectedRobot={selectedRobot}
                robots={robots}
                waypoints={waypoints}
                onWaypointAdd={handleWaypointAdd}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telemetry Display */}
            <div className="stat-card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Real-time Telemetry</h2>
              {selectedRobot ? (
                <TelemetryDisplay
                  robot={selectedRobot}
                  telemetry={telemetryData}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a robot to view telemetry
                </div>
              )}
            </div>

            {/* Task History */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  View All
                </button>
              </div>
              <TaskHistory robotId={selectedRobot?.id} />
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Advanced Controls</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FaCog className="text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FaChartBar className="text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FaHistory className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleCommand('calibrate')}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium"
              >
                Calibrate Sensors
              </button>
              <button
                onClick={() => handleCommand('diagnostics')}
                className="p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-700 font-medium"
              >
                Run Diagnostics
              </button>
              <button
                onClick={() => handleCommand('update')}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium"
              >
                Firmware Update
              </button>
              <button
                onClick={() => handleCommand('reset')}
                className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-700 font-medium"
              >
                Factory Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="stat-card border-red-200 bg-red-50">
        <div className="flex items-center space-x-3 mb-4">
          <FaExclamationTriangle className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-red-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Low Battery: Robot Delta-04</h4>
                <p className="text-sm text-gray-600">Battery level at 12%, recommend charging</p>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                Resolve
              </button>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Navigation Error: Robot Gamma-03</h4>
                <p className="text-sm text-gray-600">GPS signal unstable in Zone C</p>
              </div>
              <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700">
                Recalibrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RobotControl
