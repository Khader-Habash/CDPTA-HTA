import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification, NotificationStats, NotificationFilter, NotificationType, NotificationPriority, NotificationChannel, CreateNotificationData } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationState {
  notifications: Notification[];
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
  filter: NotificationFilter;
  unreadCount: number;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_STATS'; payload: NotificationStats }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'SET_FILTER'; payload: NotificationFilter }
  | { type: 'SET_UNREAD_COUNT'; payload: number };

interface NotificationContextType {
  state: NotificationState;
  actions: {
    fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
    fetchStats: () => Promise<void>;
    createNotification: (data: CreateNotificationData) => Promise<Notification>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    archiveNotification: (notificationId: string) => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    setFilter: (filter: NotificationFilter) => void;
    refreshNotifications: () => Promise<void>;
  };
}

const initialState: NotificationState = {
  notifications: [],
  stats: null,
  isLoading: false,
  error: null,
  filter: {},
  unreadCount: 0,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.isRead ? 0 : 1)
      };
    
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload.id ? action.payload : n
        ),
        unreadCount: state.notifications.reduce((count, n) => 
          count + (n.id === action.payload.id ? (action.payload.isRead ? 0 : 1) : (n.isRead ? 0 : 1)), 0
        )
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: state.notifications.filter(n => n.id !== action.payload && !n.isRead).length
      };
    
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
        unreadCount: 0
      };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = async (filter?: NotificationFilter) => {
    if (!user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const notifications = await notificationService.mockGetUserNotifications(user.id, filter);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch notification stats
  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      const stats = await notificationService.mockGetNotificationStats(user.id);
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  // Create notification
  const createNotification = async (data: CreateNotificationData): Promise<Notification> => {
    try {
      const notification = await notificationService.mockCreateNotification(data);
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      return notification;
    } catch (error) {
      throw error;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.mockMarkAsRead(notificationId);
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationService.mockMarkAllAsRead(user.id);
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      throw error;
    }
  };

  // Archive notification
  const archiveNotification = async (notificationId: string) => {
    try {
      // In a real app, you would call the API here
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      // In a real app, you would call the API here
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      throw error;
    }
  };

  // Set filter
  const setFilter = (filter: NotificationFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchNotifications(state.filter);
  };

  // Load notifications when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      fetchStats();
    }
  }, [user?.id]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications(state.filter);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user?.id, state.filter]);

  const contextValue: NotificationContextType = {
    state,
    actions: {
      fetchNotifications,
      fetchStats,
      createNotification,
      markAsRead,
      markAllAsRead,
      archiveNotification,
      deleteNotification,
      setFilter,
      refreshNotifications,
    },
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Hook for creating notifications with common patterns
export const useNotificationCreator = () => {
  const { actions } = useNotifications();

  const createCourseNotification = (
    userId: string,
    type: NotificationType,
    courseName: string,
    assignmentName?: string,
    quizName?: string,
    actionUrl?: string
  ) => {
    const title = type === NotificationType.COURSE_ASSIGNMENT 
      ? `New Assignment: ${assignmentName}`
      : type === NotificationType.QUIZ_DUE
      ? `Quiz Due: ${quizName}`
      : 'Course Update';

    const message = type === NotificationType.COURSE_ASSIGNMENT
      ? `A new assignment "${assignmentName}" has been added to "${courseName}".`
      : type === NotificationType.QUIZ_DUE
      ? `Your quiz "${quizName}" in "${courseName}" is due soon.`
      : `There's an update in your course "${courseName}".`;

    return actions.createNotification({
      userId,
      type,
      title,
      message,
      priority: NotificationPriority.MEDIUM,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      actionUrl,
      actionText: type === NotificationType.COURSE_ASSIGNMENT ? 'View Assignment' : 'View Course',
    });
  };

  const createAssignmentNotification = (
    userId: string,
    assignmentName: string,
    courseName: string,
    dueDate?: string,
    grade?: number,
    feedback?: string
  ) => {
    const isGraded = grade !== undefined;
    const type = isGraded ? NotificationType.ASSIGNMENT_GRADED : NotificationType.ASSIGNMENT_DUE;
    
    const title = isGraded 
      ? `Assignment Graded: ${assignmentName}`
      : `Assignment Due: ${assignmentName}`;
    
    const message = isGraded
      ? `Your assignment "${assignmentName}" in "${courseName}" has been graded. Grade: ${grade}/100`
      : `Your assignment "${assignmentName}" in "${courseName}" is due ${dueDate ? `on ${dueDate}` : 'soon'}.`;

    return actions.createNotification({
      userId,
      type,
      title,
      message,
      priority: isGraded ? NotificationPriority.MEDIUM : NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      actionUrl: `/courses/${courseName}/assignments/${assignmentName}`,
      actionText: isGraded ? 'View Feedback' : 'Submit Assignment',
      metadata: { grade, feedback, dueDate },
    });
  };

  const createSystemNotification = (
    userId: string,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ) => {
    return actions.createNotification({
      userId,
      type: NotificationType.ANNOUNCEMENT,
      title,
      message,
      priority,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    });
  };

  return {
    createCourseNotification,
    createAssignmentNotification,
    createSystemNotification,
  };
};






























