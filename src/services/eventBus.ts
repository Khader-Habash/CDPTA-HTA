// Simple Event Bus for real-time synchronization
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  // Subscribe to an event
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit an event
  emit(event: string, data?: any): void {
    console.log(`🔥 EventBus: Emitting ${event}`, data);
    
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  // Remove all listeners for an event
  off(event: string): void {
    this.events.delete(event);
  }

  // Clear all events
  clear(): void {
    this.events.clear();
  }
}

// Create a global event bus instance
export const eventBus = new EventBus();

// Event types
export const EVENTS = {
  // Application events
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_APPROVED: 'application_approved',
  APPLICATION_REJECTED: 'application_rejected',
  
  // Course content events
  ASSIGNMENT_CREATED: 'assignment_created',
  QUIZ_CREATED: 'quiz_created',
  MODULE_CREATED: 'module_created',
  LECTURE_CREATED: 'lecture_created',
  
  // User events
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
} as const;

// Helper functions for common events
export const emitApplicationSubmitted = (data: {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
}) => {
  eventBus.emit(EVENTS.APPLICATION_SUBMITTED, data);
};

export const emitAssignmentCreated = (data: {
  assignmentId: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
}) => {
  eventBus.emit(EVENTS.ASSIGNMENT_CREATED, data);
};

export const emitQuizCreated = (data: {
  quizId: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
}) => {
  eventBus.emit(EVENTS.QUIZ_CREATED, data);
};

export const emitModuleCreated = (data: {
  moduleId: string;
  title: string;
  courseId: string;
  courseName: string;
}) => {
  eventBus.emit(EVENTS.MODULE_CREATED, data);
};

export const emitLectureCreated = (data: {
  lectureId: string;
  title: string;
  courseId: string;
  courseName: string;
  scheduledAt: string;
}) => {
  eventBus.emit(EVENTS.LECTURE_CREATED, data);
};
