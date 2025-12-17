# Real-time Synchronization System

## Overview

This document describes the real-time synchronization system implemented to fix the reflection issues between different user roles in the CDPTA application. The system ensures that:

1. **Application Synchronization**: New applications submitted by applicants are immediately reflected in the admin's approval list
2. **Staff-Fellow Synchronization**: Updates to assignments, quizzes, modules, and lectures by staff are immediately reflected in fellow screens
3. **Notification Integration**: All real-time events trigger appropriate notifications

## Architecture

### Core Components

1. **RealtimeService** (`src/services/realtimeService.ts`)
   - Central service managing WebSocket connections and event broadcasting
   - Handles event subscription and emission
   - Creates notifications from realtime events
   - Supports reconnection logic for robust connectivity

2. **Realtime Hooks** (`src/hooks/useRealtime.ts`)
   - React hooks for subscribing to realtime events
   - Role-specific hooks for different user types
   - Automatic connection management and cleanup

3. **Enhanced Services**
   - `assignmentService.ts`: Emits events when assignments/quizzes are created
   - `courseService.ts`: Emits events when modules/lectures are created
   - `useApplicationForm.ts`: Emits events when applications are submitted

## Event Types

The system supports the following realtime event types:

- `application_submitted`: New application submitted
- `application_status_changed`: Application status updated
- `assignment_created`: New assignment created
- `assignment_updated`: Assignment modified
- `quiz_created`: New quiz created
- `quiz_updated`: Quiz modified
- `module_created`: New module created
- `module_updated`: Module modified
- `lecture_created`: New lecture scheduled
- `lecture_updated`: Lecture modified
- `course_updated`: Course information updated

## Usage

### For Admins

Admins automatically receive notifications when:
- New applications are submitted
- Application statuses change

```typescript
// In admin components
import { useAdminRealtime } from '@/hooks/useRealtime';

const MyAdminComponent = () => {
  const handleRealtimeEvent = (event: RealtimeEvent) => {
    if (event.type === 'application_submitted') {
      // Handle new application
      updateApplicationList(event.data);
    }
  };

  useAdminRealtime(handleRealtimeEvent);
  
  // Component code...
};
```

### For Fellows

Fellows automatically receive notifications when:
- New assignments are created
- New quizzes are available
- New modules are added
- New lectures are scheduled

```typescript
// In fellow components
import { useFellowRealtime } from '@/hooks/useRealtime';

const MyFellowComponent = () => {
  const handleRealtimeEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'assignment_created':
        // Handle new assignment
        break;
      case 'quiz_created':
        // Handle new quiz
        break;
      // ... other cases
    }
  };

  useFellowRealtime(handleRealtimeEvent);
  
  // Component code...
};
```

### For Staff

Staff can use the same system to receive updates about their content:

```typescript
// In staff components
import { useStaffRealtime } from '@/hooks/useRealtime';

const MyStaffComponent = () => {
  useStaffRealtime((event) => {
    // Handle staff-relevant events
  });
  
  // Component code...
};
```

## Implementation Details

### Event Flow

1. **Event Trigger**: User action (submit application, create assignment, etc.)
2. **Service Call**: Appropriate service method is called
3. **API Call**: Service makes API call (or mock call)
4. **Event Emission**: Service emits realtime event via `realtimeService`
5. **Event Broadcasting**: RealtimeService broadcasts to all subscribers
6. **Event Handling**: Components with subscriptions receive and handle events
7. **UI Updates**: Components update their state and UI
8. **Notifications**: System creates appropriate notifications

### Subscription Management

The realtime hooks automatically manage subscriptions:
- Connect when component mounts
- Subscribe to relevant event types based on user role
- Disconnect when component unmounts
- Handle reconnection on connection loss

### Error Handling

The system includes robust error handling:
- Connection failures trigger automatic reconnection
- Failed event emissions are logged but don't break the UI
- Subscription errors are caught and logged

## Testing

### Demo Component

A `RealtimeDemo` component is included in both admin and fellow dashboards to test the synchronization:

1. **Simulate Application**: Creates a mock application submission
2. **Create Assignment**: Creates a mock assignment
3. **Create Quiz**: Creates a mock quiz
4. **Create Module**: Creates a mock module
5. **Schedule Lecture**: Creates a mock lecture

### How to Test

1. **Open Multiple Browser Windows**:
   - One logged in as Admin
   - One logged in as Fellow

2. **Navigate to Dashboards**:
   - Admin: Go to Admin Dashboard
   - Fellow: Go to Fellow Dashboard

3. **Test Application Sync**:
   - In Fellow window, submit an application (or use demo button)
   - In Admin window, check Application Review page for new application

4. **Test Assignment/Quiz Sync**:
   - In Admin/Staff window, create assignment/quiz (or use demo button)
   - In Fellow window, check for toast notifications and dashboard updates

5. **Test Notifications**:
   - All events should trigger notifications
   - Check the notification bell for new notifications

## Configuration

### WebSocket Connection

In production, configure the WebSocket URL in your environment variables:

```env
VITE_WEBSOCKET_URL=ws://your-websocket-server.com
```

### Event Types

Add new event types in `src/services/realtimeService.ts`:

```typescript
export type RealtimeEventType = 
  | 'existing_events'
  | 'your_new_event_type';
```

### Notification Templates

Customize notification templates in the notification service for different event types.

## Benefits

1. **Real-time Updates**: No need to refresh pages to see new content
2. **Better User Experience**: Immediate feedback and notifications
3. **Reduced Server Load**: No polling required
4. **Scalable Architecture**: Event-driven system can handle multiple subscribers
5. **Role-based Events**: Users only receive relevant events
6. **Offline Resilience**: Automatic reconnection when connection is restored

## Future Enhancements

1. **Persistent Connections**: Implement server-side WebSocket management
2. **Event History**: Store and replay missed events for offline users
3. **Batch Events**: Group related events to reduce notification noise
4. **User Preferences**: Allow users to customize which events they receive
5. **Analytics**: Track event patterns and user engagement

## Troubleshooting

### Common Issues

1. **Events Not Received**:
   - Check browser console for connection errors
   - Verify user role matches event subscription
   - Ensure component is properly mounted

2. **Multiple Notifications**:
   - Check for duplicate subscriptions
   - Verify component cleanup on unmount

3. **Connection Issues**:
   - Check WebSocket server availability
   - Verify network connectivity
   - Check browser WebSocket support

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('debug-realtime', 'true');
```

This will log all realtime events and connection status to the browser console.
