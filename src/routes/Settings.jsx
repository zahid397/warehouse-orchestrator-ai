import { useState, useEffect } from 'react'
import {
  FaCog,
  FaRobot,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaNetworkWired,
  FaUser,
  FaKey,
  FaCloud,
  FaPalette,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaQuestionCircle
} from 'react-icons/fa'
import Loader from '../components/Loader'
import Toggle from '../components/Toggle'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Warehouse Orchestrator AI',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    
    // Robot Settings
    maxRobots: 50,
    autoAssignment: true,
    collisionAvoidance: true,
    batteryThreshold: 20,
    maintenanceInterval: 168, // hours
    speedLimit: 2.5, // m/s
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    alertSounds: true,
    criticalAlerts: true,
    performanceReports: true,
    maintenanceAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    auditLogging: true,
    passwordPolicy: 'strong',
    
    // System Settings
    dataRetention: 365,
    backupFrequency: 'daily',
    autoUpdates: true,
    apiRateLimit: 100,
    cacheEnabled: true,
    
    // AI Settings
    aiOptimization: true,
    predictionAccuracy: 'high',
    learningEnabled: true,
    autoDecision: false,
    
    // Integration Settings
    apiEnabled: true,
    webhookUrl: '',
    mqttBroker: 'localhost:1883',
    databaseSync: true
  })

  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      toast.loading('Saving settings...')
      await apiService.updateSettings(settings)
      toast.dismiss()
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      fetchSettings()
      toast.success('Settings reset to default')
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      toast.loading('Changing password...')
      await apiService.changePassword(currentPassword, newPassword)
      toast.dismiss()
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'robots', label: 'Robots', icon: <FaRobot /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'system', label: 'System', icon: <FaDatabase /> },
    { id: 'ai', label: 'AI Settings', icon: <FaCloud /> },
    { id: 'integrations', label: 'Integrations', icon: <FaNetworkWired /> },
    { id: 'account', label: 'Account', icon: <FaUser /> }
  ]

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
  ]

  if (isLoading) {
    return <Loader message="Loading settings..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your warehouse system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetSettings}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaUndo />
            <span>Reset to Default</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="btn-primary flex items-center space-x-2"
          >
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Site Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Format
                      </label>
                      <select
                        value={settings.timeFormat}
                        onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="12h">12-hour</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interface</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dark Mode
                      </label>
                      <p className="text-sm text-gray-500">Enable dark theme</p>
                    </div>
                    <Toggle
                      checked={false}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Animations
                      </label>
                      <p className="text-sm text-gray-500">Enable UI animations</p>
                    </div>
                    <Toggle
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Data & Privacy</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Retention Period (days)
                    </label>
                    <input
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                      max="3650"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto Backup
                      </label>
                      <p className="text-sm text-gray-500">Automatically backup data</p>
                    </div>
                    <Toggle
                      checked={settings.backupFrequency !== 'never'}
                      onChange={(checked) => handleSettingChange('backupFrequency', checked ? 'daily' : 'never')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Frequency
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={settings.backupFrequency === 'never'}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Enable Caching
                      </label>
                      <p className="text-sm text-gray-500">Cache data for faster loading</p>
                    </div>
                    <Toggle
                      checked={settings.cacheEnabled}
                      onChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="10"
                      max="1000"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto Updates
                      </label>
                      <p className="text-sm text-gray-500">Automatically update system</p>
                    </div>
                    <Toggle
                      checked={settings.autoUpdates}
                      onChange={(checked) => handleSettingChange('autoUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Robot Settings */}
        {activeTab === 'robots' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Robot Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Robots
                    </label>
                    <input
                      type="number"
                      value={settings.maxRobots}
                      onChange={(e) => handleSettingChange('maxRobots', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto Task Assignment
                      </label>
                      <p className="text-sm text-gray-500">Automatically assign tasks to robots</p>
                    </div>
                    <Toggle
                      checked={settings.autoAssignment}
                      onChange={(checked) => handleSettingChange('autoAssignment', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Collision Avoidance
                      </label>
                      <p className="text-sm text-gray-500">Enable collision detection</p>
                    </div>
                    <Toggle
                      checked={settings.collisionAvoidance}
                      onChange={(checked) => handleSettingChange('collisionAvoidance', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Safety Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Threshold (%)
                    </label>
                    <input
                      type="range"
                      value={settings.batteryThreshold}
                      onChange={(e) => handleSettingChange('batteryThreshold', parseInt(e.target.value))}
                      className="w-full"
                      min="10"
                      max="50"
                      step="5"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>10%</span>
                      <span className="font-medium">{settings.batteryThreshold}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed Limit (m/s)
                    </label>
                    <input
                      type="range"
                      value={settings.speedLimit}
                      onChange={(e) => handleSettingChange('speedLimit', parseFloat(e.target.value))}
                      className="w-full"
                      min="0.5"
                      max="5"
                      step="0.5"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0.5 m/s</span>
                      <span className="font-medium">{settings.speedLimit} m/s</span>
                      <span>5 m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="stat-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Maintenance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Interval (hours)
                    </label>
                    <input
                      type="number"
                      value={settings.maintenanceInterval}
                      onChange={(e) => handleSettingChange('maintenanceInterval', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="24"
                      max="720"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Robots will be scheduled for maintenance after this many hours of operation
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto Maintenance Scheduling
                      </label>
                      <p className="text-sm text-gray-500">Automatically schedule maintenance</p>
                    </div>
                    <Toggle
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Require Approval
                      </label>
                      <p className="text-sm text-gray-500">Requ
