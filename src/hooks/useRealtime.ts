import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { realtimeService, RealtimeEvent, RealtimeEventType } from '@/services/realtimeService';

export interface UseRealtimeOptions {
  eventTypes: RealtimeEventType[];
  onEvent?: (event: RealtimeEvent) => void;
  autoConnect?: boolean;
}

export const useRealtime = (options: UseRealtimeOptions) => {
  const { user } = useAuth();
  const { actions: notificationActions } = useNotifications();
  const subscriptionId = useRef<string | null>(null);
  const { eventTypes, onEvent, autoConnect = true } = options;

  // Handle realtime events
  const handleRealtimeEvent = useCallback((event: RealtimeEvent) => {
    console.log('Received realtime event:', event);

    // Call custom event handler if provided
    if (onEvent) {
      onEvent(event);
    }

    // Handle common event types with default behavior
    switch (event.type) {
      case 'application_submitted':
        // Refresh notifications to show new application
        notificationActions.refreshNotifications();
        break;
        
      case 'assignment_created':
      case 'quiz_created':
        // Refresh notifications to show new assignment/quiz
        notificationActions.refreshNotifications();
        break;
        
      case 'module_created':
      case 'lecture_created':
        // Refresh notifications to show new module/lecture
        notificationActions.refreshNotifications();
        break;
        
      default:
        break;
    }
  }, [onEvent, notificationActions]);

  // Connect to realtime service
  const connect = useCallback(async () => {
    if (!user?.id) return;

    try {
      await realtimeService.connect(user.id);
      
      // Subscribe to events
      subscriptionId.current = realtimeService.subscribe(
        user.id,
        eventTypes,
        handleRealtimeEvent
      );
      
      console.log(`Connected to realtime service with subscription: ${subscriptionId.current}`);
    } catch (error) {
      console.error('Failed to connect to realtime service:', error);
    }
  }, [user?.id, eventTypes, handleRealtimeEvent]);

  // Disconnect from realtime service
  const disconnect = useCallback(() => {
    if (subscriptionId.current) {
      realtimeService.unsubscribe(subscriptionId.current);
      subscriptionId.current = null;
    }
  }, []);

  // Auto-connect when user is available
  useEffect(() => {
    if (autoConnect && user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, user?.id, connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected: subscriptionId.current !== null,
  };
};

// Specialized hooks for different user roles
export const useAdminRealtime = (onEvent?: (event: RealtimeEvent) => void) => {
  return useRealtime({
    eventTypes: [
      'application_submitted',
      'application_status_changed',
      'user_status_changed',
    ],
    onEvent,
  });
};

export const useFellowRealtime = (onEvent?: (event: RealtimeEvent) => void) => {
  return useRealtime({
    eventTypes: [
      'assignment_created',
      'assignment_updated',
      'quiz_created',
      'quiz_updated',
      'module_created',
      'module_updated',
      'lecture_created',
      'lecture_updated',
      'course_updated',
    ],
    onEvent,
  });
};

export const useStaffRealtime = (onEvent?: (event: RealtimeEvent) => void) => {
  return useRealtime({
    eventTypes: [
      'assignment_created',
      'assignment_updated',
      'quiz_created',
      'quiz_updated',
      'module_created',
      'module_updated',
      'course_updated',
    ],
    onEvent,
  });
};
