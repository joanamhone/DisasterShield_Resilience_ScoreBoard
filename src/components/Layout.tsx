import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, AlertTriangle, Clipboard, User, Map, Menu, X, Bell, TrendingUp, Package, Users } from 'lucide-react'
import { clsx } from 'clsx'
import NotificationCenter from './notifications/NotificationCenter'
import ProfileDropdown from './ProfileDropdown'
import { useNotifications } from '../hooks/useNotifications'
import { useRoleAccess } from '../hooks/useRoleAccess'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const { unreadCount } = useNotifications()
  const { canAccessCommunityFeatures, canAccessSchoolFeatures, canAccessCoordinatorFeatures } = useRoleAccess()

  const baseNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Risk Assessment', href: '/assessment', icon: AlertTriangle },
    { name: 'Readiness Check', href: '/readiness', icon: Clipboard },
    { name: 'Track Progress', href: '/progress', icon: TrendingUp },
    { name: 'Flood Risk Areas', href: '/floodriskmap', icon: Map },
    { name: 'Emergency Kit', href: '/emergency-kit', icon: Package },
  ]

  // Add role-specific navigation items
  const navigation = React.useMemo(() => {
    let nav = [...baseNavigation]
    
    // Add role-specific dashboard items
    if (canAccessCoordinatorFeatures()) {
      nav.push({ name: 'Coordinator Dashboard', href: '/coordinator-dashboard', icon: AlertTriangle })
    }
    
    if (canAccessSchoolFeatures()) {
      nav.push({ name: 'School Dashboard', href: '/school-dashboard', icon: Users })
    }
    
    if (canAccessCommunityFeatures()) {
      nav.push({ name: 'Community Dashboard', href: '/community-dashboard', icon: Users })
    }
    
    // Add profile at the end
    nav.push({ name: 'Profile', href: '/profile', icon: User })
    
    return nav
  }, [canAccessCommunityFeatures, canAccessSchoolFeatures, canAccessCoordinatorFeatures])

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/assessment':
        return 'Disaster Risk Assessment'
      case '/readiness':
        return 'Emergency Readiness'
      case '/progress':
        return 'Track Progress'
         case '/floodriskmap':
        return 'Flood Risk Map Viewer'
      case '/emergency-kit':
        return 'Emergency Kit'
      case '/community-dashboard':
        return 'Community Dashboard'
      case '/school-dashboard':
        return 'School Dashboard'
      case '/coordinator-dashboard':
        return 'Disaster Coordinator Dashboard'
      case '/profile':
        return 'Profile Settings'
      default:
        return 'Disaster Shield'
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r border-divider">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-divider">
            <h1 className="text-xl font-bold text-primary">Disaster Shield</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-divider">
            <p className="text-xs text-text-tertiary">Disaster Shield v1.0.0</p>
            <p className="text-xs text-text-tertiary">Climate Preparedness</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-card">
            <div className="flex h-16 items-center justify-between px-6 border-b border-divider">
              <h1 className="text-xl font-bold text-primary">Disaster Shield</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-surface rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    )}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.name}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Top header */}
        <header className="bg-card border-b border-divider sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-surface rounded-lg lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="ml-2 lg:ml-0 text-xl font-bold text-text-primary">
                {getPageTitle()}
              </h1>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative notification-center">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-surface rounded-lg relative transition-colors duration-200 flex items-center justify-center"
                >
                  <Bell size={20} className="text-text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium min-w-[20px]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationCenter 
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>
              
              {/* Profile Dropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout