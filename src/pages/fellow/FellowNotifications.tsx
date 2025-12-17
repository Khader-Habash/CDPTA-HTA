import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementType, AnnouncementPriority } from '@/types/announcement';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Clock,
  Calendar,
  FileText,
  Users,
  Award,
  TrendingUp,
  Shield,
  Activity,
  Calculator,
  Target,
  ChevronRight,
  Filter,
  Search,
  Trash2,
  Settings,
  Eye,
  ExternalLink,
  Download,
  Archive,
} from 'lucide-react';
import { clsx } from 'clsx';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  category: 'assignment' | 'quiz' | 'deadline' | 'announcement' | 'system' | 'grade';
  relatedId?: string;
}

interface NotificationFilter {
  type: Notification['type'] | 'all';
  priority: Notification['priority'] | 'all';
  status: 'all' | 'unread' | 'read';
  category: Notification['category'] | 'all';
}

const FellowNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<NotificationFilter>({
    type: 'all',
    priority: 'all',
    status: 'all',
    category: 'all'
  });
  const [viewMode, setViewMode] = useState<'all' | 'unread' | 'important'>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'New Assignment Available',
      message: 'Formulary Management Case Studies assignment is now available. Due date: February 15, 2024.',
      type: 'info',
      priority: 'medium',
      isRead: false,
      isImportant: true,
      createdAt: '2024-02-10T09:00:00Z',
      expiresAt: '2024-02-15T23:59:59Z',
      actionUrl: '/fellow/assignments',
      actionText: 'View Assignment',
      category: 'assignment',
      relatedId: 'assignment-1'
    },
    {
      id: 'notif-2',
      title: 'Quiz Grade Available',
      message: 'Your Biostatistics Quiz has been graded. Score: 85/100. Click to view detailed feedback.',
      type: 'success',
      priority: 'medium',
      isRead: false,
      isImportant: false,
      createdAt: '2024-02-12T14:30:00Z',
      actionUrl: '/fellow/quizzes',
      actionText: 'View Results',
      category: 'grade',
      relatedId: 'quiz-3'
    },
    {
      id: 'notif-3',
      title: 'Upcoming Deadline',
      message: 'Clinical Trial Appraisal assignment is due in 3 days. Don\'t forget to submit your work!',
      type: 'warning',
      priority: 'high',
      isRead: false,
      isImportant: true,
      createdAt: '2024-02-13T08:00:00Z',
      expiresAt: '2024-02-25T23:59:59Z',
      actionUrl: '/fellow/assignments',
      actionText: 'Submit Now',
      category: 'deadline',
      relatedId: 'assignment-3'
    },
    {
      id: 'notif-4',
      title: 'HTA Program Update',
      message: 'New module materials have been uploaded for Decision Analytical Modeling. Check your learning modules.',
      type: 'announcement',
      priority: 'low',
      isRead: true,
      isImportant: false,
      createdAt: '2024-02-11T16:00:00Z',
      actionUrl: '/fellow/modules',
      actionText: 'View Modules',
      category: 'announcement',
      relatedId: 'rotation-6'
    },
    {
      id: 'notif-5',
      title: 'Workshop Reminder',
      message: 'Decision Modeling Workshop starts tomorrow at 9:00 AM. Location: Training Center.',
      type: 'info',
      priority: 'medium',
      isRead: true,
      isImportant: true,
      createdAt: '2024-02-14T10:00:00Z',
      expiresAt: '2024-03-01T09:00:00Z',
      actionUrl: '/fellow/calendar',
      actionText: 'View Calendar',
      category: 'system',
      relatedId: 'event-6'
    },
    {
      id: 'notif-6',
      title: 'System Maintenance',
      message: 'The platform will undergo scheduled maintenance on Sunday, February 18, 2024 from 2:00 AM to 4:00 AM.',
      type: 'warning',
      priority: 'medium',
      isRead: true,
      isImportant: false,
      createdAt: '2024-02-12T12:00:00Z',
      expiresAt: '2024-02-18T04:00:00Z',
      category: 'system'
    },
    {
      id: 'notif-7',
      title: 'Assignment Feedback',
      message: 'Your Literature Search Strategy Report has been reviewed. Overall grade: 92/100. Excellent work!',
      type: 'success',
      priority: 'medium',
      isRead: false,
      isImportant: false,
      createdAt: '2024-02-15T11:20:00Z',
      actionUrl: '/fellow/assignments',
      actionText: 'View Feedback',
      category: 'grade',
      relatedId: 'assignment-2'
    },
    {
      id: 'notif-8',
      title: 'Journal Club Session',
      message: 'Tomorrow\'s Journal Club session has been moved to Conference Room B due to maintenance in Room A.',
      type: 'info',
      priority: 'high',
      isRead: false,
      isImportant: true,
      createdAt: '2024-02-15T15:45:00Z',
      expiresAt: '2024-02-22T12:00:00Z',
      actionUrl: '/fellow/calendar',
      actionText: 'Update Calendar',
      category: 'system',
      relatedId: 'event-5'
    }
  ];

  const notificationTypes = [
    { value: 'all', label: 'All Types', color: 'bg-gray-100 text-gray-800' },
    { value: 'info', label: 'Information', color: 'bg-blue-100 text-blue-800' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-800' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'announcement', label: 'Announcement', color: 'bg-purple-100 text-purple-800' },
  ];

  const priorityLevels = [
    { value: 'all', label: 'All Priorities', color: 'bg-gray-100 text-gray-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: Bell },
    { value: 'assignment', label: 'Assignments', icon: FileText },
    { value: 'quiz', label: 'Quizzes', icon: Award },
    { value: 'deadline', label: 'Deadlines', icon: Clock },
    { value: 'announcement', label: 'Announcements', icon: Users },
    { value: 'system', label: 'System', icon: Settings },
    { value: 'grade', label: 'Grades', icon: TrendingUp },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="text-blue-600" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'announcement':
        return <Users className="text-purple-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    const categoryInfo = categories.find(c => c.value === category);
    if (!categoryInfo) return <Bell className="text-gray-600" size={16} />;
    return <categoryInfo.icon className="text-gray-600" size={16} />;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter.type === 'all' || notification.type === filter.type;
    const matchesPriority = filter.priority === 'all' || notification.priority === filter.priority;
    const matchesStatus = filter.status === 'all' || 
                         (filter.status === 'unread' && !notification.isRead) ||
                         (filter.status === 'read' && notification.isRead);
    const matchesCategory = filter.category === 'all' || notification.category === filter.category;
    
    switch (viewMode) {
      case 'unread':
        return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCategory && !notification.isRead;
      case 'important':
        return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCategory && notification.isImportant;
      default:
        return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCategory;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant && !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    setIsLoading(true);
    try {
      // Simulate marking as read
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      // Simulate marking all as read
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setIsLoading(true);
    try {
      // Simulate deleting notification
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotificationList = () => (
    <div className="space-y-4">
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p>No notifications match your current filters.</p>
        </div>
      ) : (
        filteredNotifications.map(notification => (
          <Card
            key={notification.id}
            className={clsx(
              'cursor-pointer hover:shadow-md transition-shadow',
              !notification.isRead && 'border-l-4 border-l-primary-500 bg-primary-50',
              notification.isImportant && 'ring-2 ring-yellow-200'
            )}
            onClick={() => setSelectedNotification(notification)}
          >
            <Card.Content className="p-4">
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={clsx(
                        'font-medium text-gray-900',
                        !notification.isRead && 'font-semibold'
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.isImportant && (
                        <Star className="text-yellow-500" size={16} />
                      )}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getCategoryIcon(notification.category)}
                        <span>{notification.category}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <MarkAsRead size={14} />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))
      )}
    </div>
  );

  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getNotificationIcon(selectedNotification.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h2>
                  <p className="text-gray-600">
                    {getTimeAgo(selectedNotification.createdAt)} • {selectedNotification.category}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!selectedNotification.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedNotification.id)}
                  >
                    <MarkAsRead size={16} className="mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedNotification(null)}>
                  ← Back
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{selectedNotification.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-600" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedNotification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedNotification.priority)}`}>
                    {selectedNotification.priority} Priority
                  </span>
                  {selectedNotification.isImportant && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Important
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(selectedNotification.category)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Category</p>
                    <p className="text-sm text-gray-600 capitalize">{selectedNotification.category}</p>
                  </div>
                </div>
                
                {selectedNotification.expiresAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-gray-600" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Expires</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedNotification.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedNotification.actionUrl && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Button>
                    <ExternalLink size={16} className="mr-2" />
                    {selectedNotification.actionText || 'Take Action'}
                  </Button>
                  <Button variant="outline">
                    <Download size={16} className="mr-2" />
                    Save Notification
                  </Button>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important announcements and updates</p>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead} disabled={isLoading}>
              <MarkAsRead size={16} className="mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Important</p>
              <p className="text-2xl font-bold text-gray-900">{importantCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('all')}
                className="rounded-r-none"
              >
                All
              </Button>
              <Button
                variant={viewMode === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('unread')}
                className="rounded-l-none rounded-r-none"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={viewMode === 'important' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('important')}
                className="rounded-l-none"
              >
                Important ({importantCount})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as Notification['type'] | 'all' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as Notification['priority'] | 'all' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priorityLevels.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as 'all' | 'unread' | 'read' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as Notification['category'] | 'all' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {selectedNotification ? renderNotificationDetails() : renderNotificationList()}
        </>
      )}
    </div>
  );
};

export default FellowNotifications;
