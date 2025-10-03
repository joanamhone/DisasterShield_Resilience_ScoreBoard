import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Settings, LogOut, ChevronDown, MapPin, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await signOut()
      // Navigate to sign-in with user info
      window.location.href = '/signin'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('.profile-dropdown')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const getUserTypeLabel = (userType?: string) => {
    const types: Record<string, string> = {
      individual: 'Individual',
      school_admin: 'School Admin',
      community_leader: 'Community Leader',
      disaster_coordinator: 'Disaster Coordinator'
    }
    return types[userType || ''] || 'User'
  }

  return (
    <div className="relative profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-surface rounded-lg transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-primary" size={16} />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-text-primary truncate max-w-32">
            {user.fullName}
          </p>
          <p className="text-xs text-text-secondary">
            {getUserTypeLabel(user.userType)}
          </p>
        </div>
        <ChevronDown size={16} className={`text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div 
            className="fixed inset-0 z-40 lg:hidden" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
            {/* User Info Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-primary" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-text-secondary truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                      <Shield className="mr-1" size={12} />
                      {getUserTypeLabel(user.userType)}
                    </span>
                  </div>
                </div>
              </div>
              
              {user.location && (
                <div className="flex items-center mt-3 text-sm text-text-secondary">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => {
                  setIsOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors"
              >
                <User className="mr-3" size={16} />
                View Profile
              </Link>
              
              <Link
                to="/profile"
                onClick={() => {
                  setIsOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors"
              >
                <Settings className="mr-3" size={16} />
                Account Settings
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t border-border py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className="mr-3" size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileDropdown