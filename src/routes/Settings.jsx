import { useState, useEffect } from 'react'
import {
  FaCog,
  FaRobot,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaNetworkWired,
  FaUser,
  FaCloud,
  FaEye,
  FaEyeSlash,
  FaUndo,
  FaSave,
  FaInfoCircle
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
    
    // Communication (Added missing state)
    heartbeatInterval: 5,
    timeoutPeriod: 30,
    diagnosticsEnabled: true,

    // Robot Settings
    maxRobots: 50,
    autoAssignment: true,
    collisionAvoidance: true,
    batteryThreshold: 20,
    maintenanceInterval: 168, 
    speedLimit: 2.5, 

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    alertSounds: true,
    criticalAlerts: true,
    performanceReports: false,
    maintenanceAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
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
      toast.dismiss() // Ensure loading toast is removed on error
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
      toast.dismiss()
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your warehouse system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetSettings}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
          >
            <FaUndo />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaSave />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Site Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
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
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interface</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
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
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Communication</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heartbeat Interval (seconds)</label>
                    <input
                      type="number"
                      value={settings.heartbeatInterval}
                      onChange={(e) => handleSettingChange('heartbeatInterval', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeout Period (seconds)</label>
                    <input
                      type="number"
                      value={settings.timeoutPeriod}
                      onChange={(e) => handleSettingChange('timeoutPeriod', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="10"
                      max="300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Enable Diagnostics</label>
                      <p className="text-sm text-gray-500">Collect diagnostic data</p>
                    </div>
                    <Toggle
                      checked={settings.diagnosticsEnabled}
                      onChange={(checked) => handleSettingChange('diagnosticsEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Robots Settings */}
        {activeTab === 'robots' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Robot Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Robots</label>
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
                    <label className="block text-sm font-medium text-gray-700">Auto Task Assignment</label>
                    <p className="text-sm text-gray-500">Automatically assign tasks to robots</p>
                  </div>
                  <Toggle
                    checked={settings.autoAssignment}
                    onChange={(checked) => handleSettingChange('autoAssignment', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Collision Avoidance</label>
                    <p className="text-sm text-gray-500">Enable collision detection</p>
                  </div>
                  <Toggle
                    checked={settings.collisionAvoidance}
                    onChange={(checked) => handleSettingChange('collisionAvoidance', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Safety Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery Threshold (%)</label>
                  <input
                    type="range"
                    value={settings.batteryThreshold}
                    onChange={(e) => handleSettingChange('batteryThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    min="10"
                    max="50"
                    step="5"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>10%</span>
                    <span className="font-bold text-primary-600">{settings.batteryThreshold}%</span>
                    <span>50%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speed Limit (m/s)</label>
                  <input
                    type="range"
                    value={settings.speedLimit}
                    onChange={(e) => handleSettingChange('speedLimit', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    min="0.5"
                    max="5"
                    step="0.5"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>0.5 m/s</span>
                    <span className="font-bold text-primary-600">{settings.speedLimit} m/s</span>
                    <span>5 m/s</span>
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Interval (hours)</label>
                    <input
                      type="number"
                      value={settings.maintenanceInterval}
                      onChange={(e) => handleSettingChange('maintenanceInterval', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Channels</h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <Toggle checked={settings.emailNotifications} onChange={(c) => handleSettingChange('emailNotifications', c)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-sm text-gray-500">Receive alerts via browser push</p>
                  </div>
                  <Toggle checked={settings.pushNotifications} onChange={(c) => handleSettingChange('pushNotifications', c)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alert Sounds</label>
                    <p className="text-sm text-gray-500">Play sounds for critical events</p>
                  </div>
                  <Toggle checked={settings.alertSounds} onChange={(c) => handleSettingChange('alertSounds', c)} />
                </div>
                
                <hr className="border-gray-100" />
                
                <h4 className="text-sm font-bold text-gray-900">Subscription Types</h4>
                <div className="flex items-center justify-between">
                    <div><label className="block text-sm text-gray-700">Critical Alerts</label></div>
                    <Toggle checked={settings.criticalAlerts} onChange={(c) => handleSettingChange('criticalAlerts', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <div><label className="block text-sm text-gray-700">Maintenance Alerts</label></div>
                    <Toggle checked={settings.maintenanceAlerts} onChange={(c) => handleSettingChange('maintenanceAlerts', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <div><label className="block text-sm text-gray-700">Performance Reports</label></div>
                    <Toggle checked={settings.performanceReports} onChange={(c) => handleSettingChange('performanceReports', c)} />
                </div>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Security Policies</h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                        <p className="text-sm text-gray-500">Require 2FA for all logins</p>
                    </div>
                    <Toggle checked={settings.twoFactorAuth} onChange={(c) => handleSettingChange('twoFactorAuth', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Audit Logging</label>
                        <p className="text-sm text-gray-500">Record all user actions</p>
                    </div>
                    <Toggle checked={settings.auditLogging} onChange={(c) => handleSettingChange('auditLogging', c)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <input 
                        type="number" 
                        value={settings.sessionTimeout} 
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
                    <select 
                        value={settings.passwordPolicy} 
                        onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="standard">Standard (8+ chars)</option>
                        <option value="strong">Strong (Symbols + Numbers)</option>
                        <option value="strict">Strict (Rotation required)</option>
                    </select>
                </div>
            </div>
          </div>
        )}

        {/* System */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention (days)</label>
                        <input 
                            type="number" 
                            value={settings.dataRetention} 
                            onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                        <select 
                            value={settings.backupFrequency} 
                            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="never">Never</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cache Enabled</label>
                            <p className="text-sm text-gray-500">Improve load times</p>
                        </div>
                        <Toggle checked={settings.cacheEnabled} onChange={(c) => handleSettingChange('cacheEnabled', c)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Auto Updates</label>
                            <p className="text-sm text-gray-500">Install security patches automatically</p>
                        </div>
                        <Toggle checked={settings.autoUpdates} onChange={(c) => handleSettingChange('autoUpdates', c)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Rate Limit (req/min)</label>
                        <input 
                            type="number" 
                            value={settings.apiRateLimit} 
                            onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* AI Settings */}
        {activeTab === 'ai' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Artificial Intelligence</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">AI Optimization</label>
                        <p className="text-sm text-gray-500">Allow AI to optimize pathfinding</p>
                    </div>
                    <Toggle checked={settings.aiOptimization} onChange={(c) => handleSettingChange('aiOptimization', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Continuous Learning</label>
                        <p className="text-sm text-gray-500">Improve models based on historical data</p>
                    </div>
                    <Toggle checked={settings.learningEnabled} onChange={(c) => handleSettingChange('learningEnabled', c)} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prediction Accuracy Target</label>
                    <select 
                        value={settings.predictionAccuracy} 
                        onChange={(e) => handleSettingChange('predictionAccuracy', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="standard">Standard (Performance Balanced)</option>
                        <option value="high">High (Computation Heavy)</option>
                        <option value="max">Maximum (Real-time)</option>
                    </select>
                </div>
             </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">External Connections</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enable External API</label>
                            <p className="text-sm text-gray-500">Allow 3rd party connections</p>
                        </div>
                        <Toggle checked={settings.apiEnabled} onChange={(c) => handleSettingChange('apiEnabled', c)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                        <input 
                            type="text" 
                            placeholder="https://..."
                            value={settings.webhookUrl} 
                            onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MQTT Broker Address</label>
                        <input 
                            type="text" 
                            value={settings.mqttBroker} 
                            onChange={(e) => handleSettingChange('mqttBroker', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Admin User"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue="admin@warehouse.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-3">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          toast.error('Account deletion is disabled in demo mode')
                        }
                      }}
                      className="w-full py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 font-medium bg-white"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaInfoCircle />
            <span>Your changes will be applied after saving</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
