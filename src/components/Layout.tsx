import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
    Home, 
    AlertTriangle, 
    Clipboard, 
    User, 
    Menu, 
    X, 
    Bell, 
    TrendingUp, 
    Package, 
    BookOpen, 
    Settings as SettingsIcon,
    Map,
    Users,
    PieChart
} from 'lucide-react'
import { clsx } from 'clsx'
import NotificationCenter from './notifications/NotificationCenter'
import ProfileDropdown from './ProfileDropdown'
import { useNotifications } from '../hooks/useNotifications'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  
  const getDashboardPath = () => {
    switch (user?.userType) {
      case 'disaster_coordinator':
        return '/';
      case 'school_admin':
        return '/school-dashboard';
      case 'community_leader':
        return '/community-dashboard';
      default:
        return '/';
    }
  };

  const navigation = React.useMemo(() => {
    const homeTitle = user?.userType && user.userType !== 'individual' ? 'Dashboard' : 'Home'
    
    const menuItems = [
      { name: homeTitle, href: getDashboardPath(), icon: Home },
      { name: 'Risk Assessment', href: '/assessment', icon: AlertTriangle },
      { name: 'Readiness Check', href: '/readiness', icon: Clipboard },
      { name: 'Track Progress', href: '/progress', icon: TrendingUp },
      { name: 'Emergency Kit', href: '/emergency-kit', icon: Package },
      { name: 'Communities', href: '/communities', icon: Users },
    ];

    if (user?.userType === 'community_leader') {
      menuItems.push({ name: 'Learning', href: '/learning', icon: BookOpen });
    }

    if (user?.userType === 'disaster_coordinator') {
      menuItems.push(
        { name: 'Reporting Center', href: '/reporting-center', icon: PieChart }
      );
    }

    menuItems.push(
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'Settings', href: '/settings', icon: SettingsIcon }
    );
    
    return menuItems;
  }, [user])

  const getPageTitle = () => {
    const isDashboardPath = [
      "/",
      "/community-dashboard",
      "/school-dashboard",
    ].includes(location.pathname);

    if (isDashboardPath) {
      switch (user?.userType) {
        case "disaster_coordinator":
          return "Disaster Coordinator Dashboard";
        case "school_admin":
          return "School Dashboard";
        case "community_leader":
          return "Community Dashboard";
        default:
          return "Home Dashboard";
      }
    }

    switch (location.pathname) {
      case '/assessment':
        return 'Disaster Risk Assessment';
      case '/readiness':
        return 'Emergency Readiness';
      case '/progress':
        return 'Track Progress';
      case '/emergency-kit':
        return 'Emergency Kit';
      case '/learning':
        return 'Learning Center';
      case '/communities':
        return 'Communities';
      case '/reporting-center':
        return 'Reporting Center';
      case '/profile':
        return 'Profile Settings';
      case '/settings':
        return 'Settings';
      default:
        // Handle dynamic paths like /community/:id
        if (location.pathname.startsWith('/community/')) {
          return 'Community Chat';
        }
        if (location.pathname.startsWith('/manage-requests')) {
          return 'Manage Join Requests';
        }
        return 'Disaster Shield';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r border-divider">
          <div className="flex items-center h-16 px-6 border-b border-divider">
            <h1 className="text-xl font-bold text-primary">Disaster Shield</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (location.pathname === "/" && item.href === getDashboardPath());

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="px-6 py-4 border-t border-divider">
            <p className="text-xs text-text-tertiary">Disaster Shield v1.0.0</p>
            <p className="text-xs text-text-tertiary">Climate Preparedness</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-col bg-card">
            <div className="flex h-16 items-center justify-between px-6 border-b border-divider">
              <h1 className="text-xl font-bold text-primary">
                Disaster Shield
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-surface rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  (location.pathname === "/" &&
                    item.href === getDashboardPath());

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    )}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
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

            <div className="flex items-center space-x-4">
              <div className="relative notification-center">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-surface rounded-lg relative transition-colors duration-200 flex items-center justify-center"
                >
                  <Bell size={20} className="text-text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium min-w-[20px]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationCenter
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>

              <ProfileDropdown />
            </div>
          </div>
        </header> {/* <-- THE FIX IS HERE. It was missing the final '>' */}

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
