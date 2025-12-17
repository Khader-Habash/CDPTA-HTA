import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Archive, Trash2, Filter, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationType, NotificationPriority, NotificationStatus } from '@/types/notification';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const { state, actions } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const filteredNotifications = state.notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {state.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.unreadCount > 99 ? '99+' : state.unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>
                {state.unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3">
              {[
                { key: 'all', label: 'All', count: state.notifications.length },
                { key: 'unread', label: 'Unread', count: state.unreadCount },
                { key: 'read', label: 'Read', count: state.notifications.length - state.unreadCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {state.isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <RefreshCw className="animate-spin mx-auto mb-2" size={20} />
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleArchiveNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              title="Archive"
                            >
                              <Archive size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {notification.actionUrl && notification.actionText && (
                          <div className="mt-3">
                            <a
                              href={notification.actionUrl}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              {notification.actionText}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <a
                href="/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;






























