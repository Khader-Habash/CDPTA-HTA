import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  Home,
  User,
  Users,
  BookOpen,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  GraduationCap,
  Briefcase,
  Shield,
  Calendar,
  UserCheck,
  Award,
  Bell,
  MessageCircle,
  Megaphone,
  Activity,
  UserPlus,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  // Common navigation
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.APPLICANT, UserRole.FELLOW, UserRole.PRECEPTOR, UserRole.ADMIN],
  },
  
  // Applicant-specific
  {
    label: 'My Application',
    href: '/applicant/application',
    icon: FileText,
    roles: [UserRole.APPLICANT],
  },
  {
    label: 'Program Information',
    href: '/applicant/program-info',
    icon: BookOpen,
    roles: [UserRole.APPLICANT],
  },
  {
    label: 'Application Status',
    href: '/applicant/status',
    icon: BarChart3,
    roles: [UserRole.APPLICANT],
  },
  
  // Fellow-specific
  {
    label: 'Learning Modules',
    href: '/fellow/modules',
    icon: BookOpen,
    roles: [UserRole.FELLOW],
  },
  // {
  //   label: 'Quizzes',
  //   href: '/fellow/quizzes',
  //   icon: Award,
  //   roles: [UserRole.FELLOW],
  // },
  // {
  //   label: 'Assignments',
  //   href: '/fellow/assignments',
  //   icon: FileText,
  //   roles: [UserRole.FELLOW],
  // },
  // {
  //   label: 'Calendar',
  //   href: '/fellow/calendar',
  //   icon: Calendar,
  //   roles: [UserRole.FELLOW],
  // },
  // {
  //   label: 'Notifications',
  //   href: '/fellow/notifications',
  //   icon: Bell,
  //   roles: [UserRole.FELLOW],
  // },
  // {
  //   label: 'Messages',
  //   href: '/fellow/messages',
  //   icon: MessageCircle,
  //   roles: [UserRole.FELLOW],
  // },
  {
    label: 'My Projects',
    href: '/fellow/projects',
    icon: Briefcase,
    roles: [UserRole.FELLOW],
  },
  {
    label: 'Courses',
    href: '/fellow/courses',
    icon: GraduationCap,
    roles: [UserRole.FELLOW],
  },
  {
    label: 'Assignments',
    href: '/fellow/assignments',
    icon: FileText,
    roles: [UserRole.FELLOW],
  },
  {
    label: 'Quizzes',
    href: '/fellow/quizzes',
    icon: CheckSquare,
    roles: [UserRole.FELLOW],
  },
  
  // Preceptor-specific
  {
    label: 'Course Management',
    href: '/preceptor/courses',
    icon: BookOpen,
    roles: [UserRole.PRECEPTOR],
  },
  {
    label: 'Manage Fellows',
    href: '/preceptor/fellows',
    icon: GraduationCap,
    roles: [UserRole.PRECEPTOR],
  },
  {
    label: 'Fellow Monitoring',
    href: '/preceptor/monitoring',
    icon: Activity,
    roles: [UserRole.PRECEPTOR],
  },
  
  // Admin-specific
  {
    label: 'Announcements',
    href: '/admin/announcements',
    icon: Megaphone,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Application Review',
    href: '/admin/applications',
    icon: FileText,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Preceptor Assignments',
    href: '/admin/preceptor-assignments',
    icon: UserPlus,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Shield,
    roles: [UserRole.ADMIN],
  },
  
  // Common bottom items
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    roles: [UserRole.APPLICANT, UserRole.FELLOW, UserRole.PRECEPTOR, UserRole.ADMIN],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [UserRole.APPLICANT, UserRole.FELLOW, UserRole.PRECEPTOR, UserRole.ADMIN],
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Filter navigation items based on user role
  const visibleItems = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard' || 
             location.pathname.includes(`/${user?.role}/dashboard`);
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-dark-900 shadow-lg flex flex-col">
      {/* Logo and branding */}
      <div className="p-6 border-b border-dark-700">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="text-dark-900" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">CDPTA</h1>
            <p className="text-xs text-gray-400">Drug Policy & Technology Assessment</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-0 space-y-0">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors border-l-4',
                active
                  ? 'bg-accent-700 text-white border-accent-400'
                  : 'text-gray-300 hover:bg-dark-800 hover:text-white border-transparent'
              )}
            >
              <Icon
                size={18}
                className={active ? 'text-white' : 'text-gray-400'}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;





