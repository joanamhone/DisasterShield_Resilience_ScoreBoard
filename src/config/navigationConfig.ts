import {
  Home,
  User,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  HeartHandshake,
  FileText,
  Users
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

export const navItems: NavItem[] = [
  // --- Shared Links ---
  {
    path: '/',
    label: 'Home',
    icon: Home,
    roles: ['individual', 'community_leader', 'school_admin', 'disaster_coordinator'],
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
    roles: ['individual', 'community_leader', 'school_admin', 'disaster_coordinator'],
  },
  
  // --- Individual User Links ---
  {
    path: '/readiness',
    label: 'My Readiness',
    icon: ShieldCheck,
    roles: ['individual'],
  },
  {
    path: '/emergency-kit',
    label: 'Emergency Kit',
    icon: ClipboardList,
    roles: ['individual'],
  },
  {
    path: '/communities',
    label: 'Communities',
    icon: Users,
    roles: ['individual'],
  },
  {
    path: '/progress',
    label: 'My Progress',
    icon: BarChart3,
    roles: ['individual'],
  },

  // --- Community Leader Links ---
  {
    path: '/community-dashboard',
    label: 'Community Hub',
    icon: HeartHandshake,
    roles: ['community_leader'],
  },
  {
    path: '/communities',
    label: 'Manage Community',
    icon: Users,
    roles: ['community_leader'],
  },

  // --- Disaster Coordinator Links ---
  {
    path: '/reporting-center',
    label: 'Reports',
    icon: FileText,
    roles: ['disaster_coordinator'],
  },

  /* // --- School Admin Links (Ready to be slotted in) ---
  {
    path: '/school-dashboard',
    label: 'School Dashboard',
    icon: Building,
    roles: ['school_admin'],
  },
  */
];