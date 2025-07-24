import React, { useState } from 'react'
import { Settings, User, Phone, Mail, ChevronRight, LogOut, Bell, Shield, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom' // 1. Import useNavigate

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth()
  const navigate = useNavigate() // 2. Initialize navigate

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    location: user?.location || '',
    phoneNumber: user?.phoneNumber || '',
    contactMethod: user?.contactMethod || 'email',
    languages: user?.languages || []
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [privateProfileEnabled, setPrivateProfileEnabled] = useState(false)
  const [languageInput, setLanguageInput] = useState('')

  if (!user) return null

  // 3. Define menuItems WITH the 'icon' property
  const menuItems = [
    {
      id: 1,
      title: 'Emergency Contacts',
      icon: Phone, // Use the icon component directly
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      action: () => navigate('/settings/emergency-contacts')
    },
    {
      id: 2,
      title: 'Notification Settings',
      icon: Bell, // Use the icon component directly
      color: 'text-accent',
      bgColor: 'bg-accent/20',
      action: () => navigate('/settings/notifications')
    },
    {
      id: 3,
      title: 'App Settings',
      icon: Settings, // Use the icon component directly
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      action: () => navigate('/settings/app')
    },
  ]

  const getUserTypeLabel = (userType?: string) => {
    const types: Record<string, string> = {
      individual: 'Individual',
      school_admin: 'School Administrator',
      community_leader: 'Community Leader',
      disaster_coordinator: 'Disaster Coordinator'
    }
    return types[userType || ''] || 'User'
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      location: user?.location || '',
      phoneNumber: user?.phoneNumber || '',
      contactMethod: user?.contactMethod || 'email',
      languages: user?.languages || []
    })
    setEditing(false)
  }

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }))
      setLanguageInput('')
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }))
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Use navigate for SPA navigation instead of full page reload
      navigate('/signin')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-primary" size={32} />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {user.fullName}
          </h2>
          <p className="text-sm text-text-secondary mb-1">{user.email}</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
              <Shield className="mr-1" size={12} />
              {getUserTypeLabel(user.userType)}
            </span>
            {user.location && (
              <div className="flex items-center text-text-secondary text-sm">
                <MapPin size={14} className="mr-1" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="btn-primary"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Personal Information */}
      <div className="card p-4">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Personal Information
        </h3>

        {editing ? (
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Preferred Contact Method
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value as 'email' | 'sms' }))}
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
                    checked={formData.contactMethod === 'sms'}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value as 'email' | 'sms' }))}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <Phone className="mr-1" size={16} />
                  <span className="text-text-primary">SMS</span>
                </label>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/20 text-primary"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-2 text-primary hover:text-primary-dark"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a language"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Full Name
                </label>
                <p className="text-text-primary">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email
                </label>
                <p className="text-text-primary">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Location
                </label>
                <p className="text-text-primary">{user.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Phone Number
                </label>
                <p className="text-text-primary">{user.phoneNumber || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Contact Method
                </label>
                <p className="text-text-primary capitalize">{user.contactMethod || 'Email'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Languages
                </label>
                <div className="flex flex-wrap gap-1">
                  {user.languages && user.languages.length > 0 ? (
                    user.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 rounded-full text-xs bg-primary/20 text-primary"
                      >
                        {language}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-primary">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card p-4">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Settings
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-divider">
            <span className="text-text-primary">Push Notifications</span>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                notificationsEnabled ? 'bg-primary' : 'bg-border'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-text-primary">Private Profile</span>
            <button
              onClick={() => setPrivateProfileEnabled(!privateProfileEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                privateProfileEnabled ? 'bg-primary' : 'bg-border'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  privateProfileEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card p-4">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Quick Access
        </h3>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon // Now this works because item.icon is defined
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center py-3 border-b border-divider last:border-b-0 hover:bg-surface/50 transition-colors duration-200 rounded-lg px-2"
              >
                <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center mr-3`}>
                  <Icon size={20} className={item.color} />
                </div>
                <span className="flex-1 text-left text-text-primary">
                  {item.title}
                </span>
                <ChevronRight size={20} className="text-text-tertiary" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full card p-4 flex items-center justify-center hover:bg-surface transition-colors duration-200"
      >
        <LogOut size={20} className="text-error mr-2" />
        <span className="font-medium text-error">Sign Out</span>
      </button>

      {/* Version */}
      <p className="text-center text-sm text-text-tertiary">
        Disaster Shield v1.0.0
      </p>
    </div>
  )
}

export default Profile