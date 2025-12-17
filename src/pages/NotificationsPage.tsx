import React, { useState, useEffect } from 'react';
import { Bell, Filter, Search, Archive, Trash2, Check, RefreshCw, Settings } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationType, NotificationPriority, NotificationStatus, NotificationFilter } from '@/types/notification';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDistanceToNow, format } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { state, actions } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    // Apply filters when they change
    const filter: NotificationFilter = {
      search: searchTerm || undefined,
      type: selectedType !== 'all' ? selectedType : undefined,
      priority: selectedPriority !== 'all' ? selectedPriority : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      isArchived: showArchived,
    };

    actions.fetchNotifications(filter);
  }, [searchTerm, selectedType, selectedPriority, selectedStatus, showArchived]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COURSE_ASSIGNMENT:
      case NotificationType.ASSIGNMENT_CREATED:
      case NotificationType.ASSIGNMENT_DUE:
      case NotificationType.ASSIGNMENT_SUBMITTED:
      case NotificationType.ASSIGNMENT_GRADED:
        return '📝';
      case NotificationType.QUIZ_CREATED:
      case NotificationType.QUIZ_AVAILABLE:
      case NotificationType.QUIZ_DUE:
      case NotificationType.QUIZ_COMPLETED:
      case NotificationType.QUIZ_RESULTS:
        return '🧪';
      case NotificationType.COURSE_ENROLLED:
      case NotificationType.COURSE_STARTED:
      case NotificationType.COURSE_COMPLETED:
        return '📚';
      case NotificationType.ANNOUNCEMENT:
        return '📢';
      case NotificationType.SYSTEM_MAINTENANCE:
      case NotificationType.SYSTEM_UPDATE:
        return '⚙️';
      case NotificationType.SECURITY_ALERT:
        return '🔒';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'text-red-600 bg-red-50 border-red-200';
      case NotificationPriority.HIGH:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case NotificationPriority.MEDIUM:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case NotificationPriority.LOW:
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.UNREAD:
        return 'text-blue-600 bg-blue-50';
      case NotificationStatus.READ:
        return 'text-gray-600 bg-gray-50';
      case NotificationStatus.ARCHIVED:
        return 'text-yellow-600 bg-yellow-50';
      case NotificationStatus.DELETED:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await actions.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await actions.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleArchiveNotification = async (notificationId: string) => {
    try {
      await actions.archiveNotification(notificationId);
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await actions.deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await actions.refreshNotifications();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: NotificationType.COURSE_ASSIGNMENT, label: 'Course Assignments' },
    { value: NotificationType.QUIZ_DUE, label: 'Quizzes' },
    { value: NotificationType.ASSIGNMENT_GRADED, label: 'Graded Assignments' },
    { value: NotificationType.ANNOUNCEMENT, label: 'Announcements' },
    { value: NotificationType.SYSTEM_MAINTENANCE, label: 'System Updates' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: NotificationPriority.URGENT, label: 'Urgent' },
    { value: NotificationPriority.HIGH, label: 'High' },
    { value: NotificationPriority.MEDIUM, label: 'Medium' },
    { value: NotificationPriority.LOW, label: 'Low' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: NotificationStatus.UNREAD, label: 'Unread' },
    { value: NotificationStatus.READ, label: 'Read' },
    { value: NotificationStatus.ARCHIVED, label: 'Archived' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage your notifications and stay updated</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={state.isLoading}>
            <RefreshCw size={16} className={`mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {state.unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              <Check size={16} className="mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <Card.Content className="p-4">
              <div className="flex items-center">
                <Bell className="text-blue-500" size={24} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{state.stats.total}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <div className="flex items-center">
                <Bell className="text-orange-500" size={24} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{state.stats.unread}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <div className="flex items-center">
                <Bell className="text-green-500" size={24} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{state.stats.recent}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <div className="flex items-center">
                <Bell className="text-purple-500" size={24} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Archived</p>
                  <p className="text-2xl font-bold text-gray-900">{state.stats.byStatus.archived || 0}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Filters</h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full input"
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="w-full input"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full input"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show archived</span>
            </label>
          </div>
        </Card.Content>
      </Card>

      {/* Notifications List */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">
            Notifications ({state.notifications.length})
          </h3>
        </Card.Header>
        <Card.Content>
          {state.isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : state.notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    !notification.isRead 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-lg font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          {notification.content && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">{notification.content}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-3 mt-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check size={14} className="mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveNotification(notification.id)}
                          >
                            <Archive size={14} className="mr-1" />
                            Archive
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && notification.actionText && (
                        <div className="mt-3">
                          <a
                            href={notification.actionUrl}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            {notification.actionText} →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default NotificationsPage;






























