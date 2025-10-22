import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon, Users, Bell, Save, Plus, Trash2, Phone, Mail, AlertTriangle, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useAccount } from '../hooks/useAccount'

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
}

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const { deleteAccount, exportUserData, loading: accountLoading, error: accountError } = useAccount()
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'notifications'>('general')
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  // Emergency Contacts State
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'John Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com'
    },
    {
      id: '2',
      name: 'Emergency Services',
      relationship: 'Local Emergency',
      phone: '911',
      email: 'emergency@local.gov'
    }
  ])
  
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  })
  
  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    method: user?.contactMethod || 'email',
    weatherAlerts: true,
    emergencyAlerts: true,
    communityUpdates: true,
    assessmentReminders: false
  })

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        ...newContact
      }
      setContacts([...contacts, contact])
      setNewContact({ name: '', relationship: '', phone: '', email: '' })
    }
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Update contact method in Auth context/backend
      await updateProfile({
        contactMethod: notificationPrefs.method as 'email' | 'sms'
      })
      
      setTimeout(() => {
        setLoading(false)
        alert('Settings saved successfully!')
      }, 1000)
      
    } catch (error) {
      setLoading(false)
      alert('Failed to save settings')
    }
  }

  const handleDeleteAccount = async () => {
    const result = await deleteAccount()
    
    if (result.success) {
      alert('Your account has been successfully deleted.')
    } else {
      alert(`Failed to delete account: ${result.error}`)
    }
    
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }

  const handleExportData = async () => {
    const result = await exportUserData()
    
    if (result.success) {
      alert('Your data has been exported and downloaded.')
    } else {
      alert(`Failed to export data: ${result.error}`)
    }
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="btn-primary"
        >
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'contacts', label: 'Emergency Contacts', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">General Settings</h3>
              
              <div className="space-y-4">
                {/* Account Type Display */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Account Type
                  </label>
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="font-medium text-text-primary">
                      {user?.userType === 'individual' ? 'Individual' :
                       user?.userType === 'community_leader' ? 'Community Leader' :
                       user?.userType === 'school_admin' ? 'School Administrator' :
                       user?.userType === 'disaster_coordinator' ? 'Disaster Coordinator' : 'User'}
                    </span>
                  </div>
                </div>

                {/* Location Display */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Location
                  </label>
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-text-primary">{user?.location || 'Not specified'}</span>
                  </div>
                </div>

                {/* Data Export */}
                <div className="border-t border-border pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                      <Download size={20} className="mr-2" />
                      Export Your Data
                    </h4>
                    <p className="text-blue-700 text-sm mb-4">
                      Download a copy of all your data including profile, progress, alerts, and drills.
                    </p>
                    <button
                      onClick={handleExportData}
                      disabled={accountLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {accountLoading ? 'Exporting...' : 'Export Data'}
                    </button>
                  </div>
                </div>

                {/* Danger Zone - Delete Account */}
                <div className="border-t border-error/20 pt-6">
                  <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                    <h4 className="font-bold text-error mb-2 flex items-center">
                      <AlertTriangle size={20} className="mr-2" />
                      Danger Zone
                    </h4>
                    <p className="text-text-secondary text-sm mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    {accountError && (
                      <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded text-error text-sm">
                        {accountError}
                      </div>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={accountLoading}
                      className="bg-error hover:bg-error/90 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {accountLoading ? 'Processing...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">Emergency Contacts</h3>
              
              {/* Existing Contacts */}
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-4 bg-surface rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{contact.name}</h4>
                        <p className="text-sm text-text-secondary">{contact.relationship}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                          <div className="flex items-center">
                            <Phone size={14} className="mr-1" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center">
                              <Mail size={14} className="mr-1" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Contact Form */}
              <div className="border-t border-border pt-6">
                <h4 className="font-medium text-text-primary mb-4">Add New Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                    className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  />
                </div>
                <button
                  onClick={addContact}
                  className="mt-4 btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add Contact
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">Notification Preferences</h3>
              
              <div className="space-y-4">
                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={notificationPrefs.method === 'email'}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, method: e.target.value})}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <Mail className="mr-1" size={16} />
                      <span className="text-text-primary">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="sms"
                        checked={notificationPrefs.method === 'sms'}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, method: e.target.value})}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <Phone className="mr-1" size={16} />
                      <span className="text-text-primary">SMS</span>
                    </label>
                  </div>
                </div>

                {/* Alert Types */}
                <div className="space-y-3">
                  <h4 className="font-medium text-text-primary">Alert Types</h4>
                  
                  {[
                    { key: 'weatherAlerts', label: 'Weather Alerts', description: 'Severe weather warnings and updates' },
                    { key: 'emergencyAlerts', label: 'Emergency Alerts', description: 'Critical emergency notifications' },
                    { key: 'communityUpdates', label: 'Community Updates', description: 'Community events and preparedness tips' },
                    { key: 'assessmentReminders', label: 'Assessment Reminders', description: 'Reminders to update your readiness assessment' }
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-3 border-b border-divider">
                      <div>
                        <h5 className="font-medium text-text-primary">{pref.label}</h5>
                        <p className="text-sm text-text-secondary">{pref.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationPrefs({
                          ...notificationPrefs,
                          [pref.key]: !notificationPrefs[pref.key as keyof typeof notificationPrefs]
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          notificationPrefs[pref.key as keyof typeof notificationPrefs] ? 'bg-primary' : 'bg-border'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            notificationPrefs[pref.key as keyof typeof notificationPrefs] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Same as before, but with the fix for async deleting) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-error mb-4">Delete Account</h3>
            <div className="space-y-4">
              <p className="text-text-secondary">
                This will permanently delete your account and all associated data including:
              </p>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 ml-4">
                <li>Profile information and settings</li>
                <li>Emergency preparedness assessments</li>
                <li>Emergency kit data</li>
                <li>Progress tracking history</li>
                <li>All personal data and preferences</li>
              </ul>
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error font-medium">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Type "DELETE" to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-error border border-border"
                  placeholder="DELETE"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                disabled={accountLoading}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || accountLoading}
                className="flex-1 bg-error hover:bg-error/90 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {accountLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
