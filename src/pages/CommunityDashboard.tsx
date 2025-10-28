import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ReadinessScore from '../components/home/ReadinessScore'
import RecentAlerts from '../components/home/RecentAlerts'
import RiskSummary from '../components/home/RiskSummary'
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Activity,
  Bell,
  Megaphone,
  Send,
  MapPin,
  Phone,
  MessageSquare,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Filter,
  Download,
  X,
  Shield,
  Loader2 // Used for button loading states
} from 'lucide-react'

// --- Component Definition ---

const CommunityDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // --- STATE AND DATA ---
  
  // Modals State (Note: showDrillModal removed)
  const [activeProgressTab, setActiveProgressTab] = useState<'community' | 'personal'>('community')
  const [activeActivityTab, setActiveActivityTab] = useState<'drills' | 'alerts' | 'workshops'>('drills')
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageType, setMessageType] = useState<'sms' | 'push' | 'call'>('sms')
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  // Community Stats (Merged & Expanded)
  const communityStats = {
    totalMembers: 2475,
    averageReadiness: 72,
    activeAlerts: 3,
    upcomingDrills: 2,
    vulnerableHouseholds: 15, // New stat used in grid
    completedDrills: 8,
    workshopsHeld: 5,
    alertsSent: 23
  }
  
  const topStats = [
    { label: 'Community Members', value: communityStats.totalMembers, icon: Users, color: 'text-primary' },
    { label: 'Average Readiness', value: `${communityStats.averageReadiness}%`, icon: TrendingUp, color: 'text-success' },
    { label: 'Upcoming Drills', value: communityStats.upcomingDrills, icon: Calendar, color: 'text-accent' },
    { label: 'Active Alerts', value: communityStats.activeAlerts, icon: AlertTriangle, color: 'text-error' }
  ];


  // Readiness Distribution
  const readinessDistribution = [
    { label: 'Well Prepared (80-100%)', percentage: 75, color: 'bg-success' },
    { label: 'Moderately Prepared (60-79%)', percentage: 20, color: 'bg-warning' },
    { label: 'Needs Improvement (<60%)', percentage: 5, color: 'bg-error' }
  ]

  // Vulnerable Households (Rich data from the latter code)
  const vulnerableHouseholds = [
    { id: 1, name: 'Johnson Family', address: '123 Oak St', score: 25, risk: 'High', contact: '+1-555-0123', issues: ['No emergency kit', 'No evacuation plan'] },
    { id: 2, name: 'Martinez Household', address: '456 Pine Ave', score: 32, risk: 'High', contact: '+1-555-0456', issues: ['Limited water storage', 'No first aid supplies'] },
    { id: 3, name: 'Chen Family', address: '789 Elm Dr', score: 38, risk: 'Medium', contact: '+1-555-0789', issues: ['Outdated emergency plan'] }
  ]

  // Activity Data
  const completedDrills = [
    { id: 1, type: 'Flood Response', date: '2024-01-15', participants: 38, effectiveness: 85, feedback: 'Good coordination' },
    { id: 2, type: 'Severe Weather', date: '2024-01-08', participants: 42, effectiveness: 92, feedback: 'Excellent response time' }
  ]

  // Personal Progress Data
  const personalProgress = {
    coursesCompleted: 8,
    certificationsEarned: 3,
    drillsLed: 12,
    assessmentsConducted: 25,
    engagementScore: 94
  }

  // Learning Data
  const availableCourses = [
    { id: 1, title: 'Emergency Response Leadership', duration: '4 hours', certification: true, completed: true },
    { id: 2, title: 'Community Risk Assessment', duration: '3 hours', certification: true, completed: false },
    { id: 3, title: 'Crisis Communication', duration: '2 hours', certification: false, completed: false }
  ]

  // --- FUNCTIONS (scheduleDrill function removed) ---

  const handleContactHousehold = (household: any) => {
    setSelectedHousehold(household)
    setShowContactModal(true)
  }

  const openMessageComposer = (type: 'sms' | 'push' | 'call') => {
    setMessageType(type)
    setShowContactModal(false)
    setShowMessageModal(true)
    
    // Pre-fill message based on household issues
    if (selectedHousehold) {
      const issues = selectedHousehold.issues.join(', ')
      const defaultMessage = type === 'call' 
        ? `Calling ${selectedHousehold.name} regarding emergency preparedness concerns: ${issues}`
        : `Hi ${selectedHousehold.name.split(' ')[0]}, this is your community leader. We noticed some areas where we can help improve your emergency preparedness: ${issues}. Would you like assistance with these items?`
      setMessageContent(defaultMessage)
    }
  }

  const sendMessage = async () => {
    if (messageType !== 'call' && !messageContent.trim()) return
    
    setSendingMessage(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log(`Sending ${messageType} to ${selectedHousehold?.name}:`, messageContent)
      
      setShowMessageModal(false)
      setMessageContent('')
      setSelectedHousehold(null)
      
      alert(`${messageType.toUpperCase()} successful to ${selectedHousehold?.name}!`)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const sendAlert = (alertData: any) => {
    console.log('Sending alert:', alertData)
    setShowAlertModal(false)
    alert('Community Alert Sent (Simulated)')
  }
  
  // --- JSX RENDERING ---

  return (
    <div className="space-y-6">
      {/* 1. HEADER & QUICK ACTION BUTTONS (Alert & Schedule Drill) */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-primary/5 border-l-4 border-primary">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.fullName || 'Community Leader'} 👋
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            You’re managing <span className="font-semibold text-primary">{user?.location || 'Your Community'}</span> – stay proactive and keep your community safe.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-error hover:bg-error/90 text-white rounded-lg shadow-md transition-colors font-medium"
          >
            <Megaphone size={16} />
            Send Community Alert
          </button>
          <button
            onClick={() => navigate('/schedule-drill')}
            className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg shadow-md transition-colors font-medium"
          >
            <Calendar size={16} />
            Schedule Drill
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <div key={index} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-text-secondary text-sm">{stat.label}</h3>
                        <Icon className={stat.color} size={20} />
                    </div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                </div>
            )
        })}
      </div>

      {/* Core Dashboard Components (ReadinessScore, RecentAlerts, RiskSummary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore score={communityStats.averageReadiness} />
        <RecentAlerts />
        <RiskSummary />
      </div>

      {/* 3. QUICK ACTIONS & LEARNING CARD (Consolidated) */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions & Learning</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Action: View Risk Map */}
          <button
            onClick={() => navigate('/readiness')}
            className="p-4 bg-surface rounded-lg hover:bg-border transition-colors text-left border border-border"
          >
            <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
            <h3 className="font-medium text-text-primary mb-1">Take Assessment</h3>
            <p className="text-sm text-text-secondary">Evaluate your readiness and that of your community.</p>
          </button>
          
          {/* Action: Track Progress */}
          <button
            onClick={() => navigate('/progress')}
            className="p-4 bg-surface rounded-lg hover:bg-border transition-colors text-left border border-border"
          >
            <Activity className="h-6 w-6 text-green-500 mb-2" />
            <h3 className="font-medium text-text-primary mb-1">Track Progress</h3>
            <p className="text-sm text-text-secondary">View leadership progress.</p>
          </button>
          
          {/* Action: Emergency Kit Build */}
          <button
            onClick={() => navigate('/emergency-kit')}
            className="p-4 bg-surface rounded-lg hover:bg-border transition-colors text-left border border-border"
          >
            <Shield className="h-6 w-6 text-orange-500 mb-2" />
            <h3 className="font-medium text-text-primary mb-1">Emergency Kit Build</h3>
            <p className="text-sm text-text-secondary">Oversee essential kit completion.</p>
          </button>

          {/* LEARNING & CERTIFICATION */}
          <button
            onClick={() => navigate('/learning')}
            className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:shadow-lg transition-shadow text-left"
          >
            <BookOpen className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-primary mb-1">Learning Center</h3>
            <p className="text-sm text-text-secondary">Access training courses.</p>
          </button>
        </div>
      </div>
      
      {/* Community Readiness Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Community Readiness Distribution
        </h3>
        <div className="space-y-3">
          {readinessDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{item.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-border h-2 rounded-full">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-text-primary">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RECENT COMMUNITY ACTIVITIES (Tabbed View) */}
      <div className="card">
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="font-bold text-text-primary">Recent Community Activity</h3>
            <div className="flex bg-surface rounded-lg p-1">
              {[
                { id: 'drills', label: 'Completed Drills' },
                { id: 'alerts', label: 'Alerts Sent' },
                { id: 'workshops', label: 'Workshops' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveActivityTab(tab.id as any)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    activeActivityTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeActivityTab === 'drills' && (
            <div className="space-y-4">
              {completedDrills.map((drill) => (
                <div key={drill.id} className="p-4 bg-surface rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{drill.type}</h4>
                    <span className="text-sm text-text-secondary">{drill.date}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Participants:</span>
                      <div className="font-medium text-text-primary">{drill.participants}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Effectiveness:</span>
                      <div className="font-medium text-success">{drill.effectiveness}%</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Feedback:</span>
                      <div className="font-medium text-text-primary">{drill.feedback}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeActivityTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <h4 className="font-medium text-text-primary mb-2">Severe Weather Warning</h4>
                <div className="text-sm text-text-secondary mb-2">Sent to 247 members • 2 hours ago</div>
                <p className="text-sm text-text-primary">Heavy rainfall expected. Residents should avoid unnecessary travel.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <h4 className="font-medium text-text-primary mb-2">Air Quality Alert</h4>
                <div className="text-sm text-text-secondary mb-2">Sent to 156 members • 1 day ago</div>
                <p className="text-sm text-text-primary">Air quality improved to moderate levels. Outdoor activities can resume.</p>
              </div>
            </div>
          )}
          {activeActivityTab === 'workshops' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">Emergency Preparedness Workshop</h4>
                  <span className="text-sm text-success">Completed</span>
                </div>
                <div className="text-sm text-text-secondary">32 participants • January 15, 2024</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. VULNERABLE HOUSEHOLDS (Rich, Interactive List) */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary">Vulnerable Households ({vulnerableHouseholds.length} identified)</h3>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="btn-secondary text-sm">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {vulnerableHouseholds.map((household) => (
            <div key={household.id} className="p-4 bg-surface rounded-lg border border-warning/30 shadow-sm">
              <div className="flex items-start justify-between mb-3 flex-wrap">
                <div className="min-w-0 flex-1 mb-2 sm:mb-0">
                  <h4 className="font-medium text-text-primary truncate">{household.name}</h4>
                  <p className="text-sm text-text-secondary flex items-center">
                    <MapPin size={14} className="mr-1" /> {household.address}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    household.risk === 'High' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                  }`}>
                    {household.score}% Ready • {household.risk} Risk
                  </span>
                  <button 
                    onClick={() => handleContactHousehold(household)}
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    Contact Household
                  </button>
                </div>
              </div>
              <div className="text-sm text-text-secondary pt-2 border-t border-border/50">
                <strong>Issues:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {household.issues.map((issue, index) => (
                    <span key={index} className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* --- MODALS --- */}

      {/* Send Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Send Community Alert</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Alert Type</label>
                <select className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary">
                  <option>Weather Warning</option>
                  <option>Emergency Alert</option>
                  <option>Community Notice</option>
                  <option>Drill Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Recipients</label>
                <select className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary">
                  <option>All Community Members</option>
                  <option>Riverside Village</option>
                  <option>Downtown District</option>
                  <option>Hill Community</option>
                  <option>Vulnerable Households Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Delivery Method</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-text-primary">Push Notification</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-text-primary">SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-text-primary">Email</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                <textarea 
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 h-24 text-text-primary resize-none"
                  placeholder="Enter your alert message..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => sendAlert({})}
                className="flex-1 btn-primary bg-error hover:bg-error/90"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Schedule Drill Modal (REMOVED: Now navigates to page) */}

      {/* Contact Household Modal */}
      {showContactModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Contact {selectedHousehold.name}</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 bg-surface hover:bg-border rounded-lg transition-colors text-text-primary" onClick={() => openMessageComposer('sms')}>
                <MessageSquare className="mr-3" size={20} />
                <span>Send SMS</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 bg-surface hover:bg-border rounded-lg transition-colors text-text-primary" onClick={() => openMessageComposer('push')}>
                <Bell className="mr-3" size={20} />
                <span>Push Notification</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 bg-surface hover:bg-border rounded-lg transition-colors text-text-primary" onClick={() => openMessageComposer('call')}>
                <Phone className="mr-3" size={20} />
                <span>Call {selectedHousehold.contact}</span>
              </button>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full btn-secondary mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message Composition Modal */}
      {showMessageModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">
                {messageType === 'sms' ? 'Send SMS' : 
                 messageType === 'push' ? 'Send Push Notification' : 
                 'Initiate Phone Call'}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-1 hover:bg-surface rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Recipient Info */}
            <div className="p-3 bg-surface rounded-lg mb-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">{selectedHousehold.name}</h4>
                  <p className="text-sm text-text-secondary">{selectedHousehold.address}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedHousehold.risk === 'High' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                  }`}>
                    {selectedHousehold.score}% • {selectedHousehold.risk} Risk
                  </span>
                  <p className="text-xs text-text-tertiary mt-1">{selectedHousehold.contact}</p>
                </div>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="mb-4">
              <h5 className="font-medium text-text-secondary mb-2">Identified Issues:</h5>
              <div className="flex flex-wrap gap-2">
                {selectedHousehold.issues.map((issue: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-warning/20 text-warning rounded-full text-xs">
                    {issue}
                  </span>
                ))}
              </div>
            </div>

            {/* Message Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contact Method
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMessageType('sms')}
                  className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-colors ${
                    messageType === 'sms' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  <MessageSquare size={16} className="mr-2" />
                  SMS
                </button>
                <button
                  onClick={() => setMessageType('push')}
                  className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-colors ${
                    messageType === 'push' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  <Bell size={16} className="mr-2" />
                  Push
                </button>
                <button
                  onClick={() => setMessageType('call')}
                  className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-colors ${
                    messageType === 'call' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  <Phone size={16} className="mr-2" />
                  Call
                </button>
              </div>
            </div>

            {/* Message Composition */}
            {messageType !== 'call' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message Content
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 h-32 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder={`Type your ${messageType} message here...`}
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-tertiary">
                    {messageContent.length}/160 characters
                  </span>
                  <button
                    onClick={() => setMessageContent('')}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="text-accent mr-2" size={20} />
                  <h5 className="font-medium text-accent">Phone Call Notes</h5>
                </div>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 h-24 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Add notes about what to discuss during the call..."
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 btn-secondary"
                disabled={sendingMessage}
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={sendingMessage || (messageType !== 'call' && !messageContent.trim())}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    {messageType === 'call' ? 'Start Call' : 'Send Message'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityDashboard
