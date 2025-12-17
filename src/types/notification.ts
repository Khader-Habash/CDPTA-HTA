export enum NotificationType {
  // Application related
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_APPROVED = 'application_approved',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_REVIEW = 'application_review',
  
  // Course related
  COURSE_ENROLLED = 'course_enrolled',
  COURSE_STARTED = 'course_started',
  COURSE_COMPLETED = 'course_completed',
  COURSE_DEADLINE = 'course_deadline',
  COURSE_ASSIGNMENT = 'course_assignment',
  COURSE_QUIZ = 'course_quiz',
  COURSE_GRADE = 'course_grade',
  
  // Assignment related
  ASSIGNMENT_CREATED = 'assignment_created',
  ASSIGNMENT_DUE = 'assignment_due',
  ASSIGNMENT_SUBMITTED = 'assignment_submitted',
  ASSIGNMENT_GRADED = 'assignment_graded',
  ASSIGNMENT_FEEDBACK = 'assignment_feedback',
  
  // Quiz related
  QUIZ_CREATED = 'quiz_created',
  QUIZ_AVAILABLE = 'quiz_available',
  QUIZ_DUE = 'quiz_due',
  QUIZ_COMPLETED = 'quiz_completed',
  QUIZ_RESULTS = 'quiz_results',
  
  // System related
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SYSTEM_UPDATE = 'system_update',
  SECURITY_ALERT = 'security_alert',
  
  // General
  ANNOUNCEMENT = 'announcement',
  REMINDER = 'reminder',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  COURSE_UPDATE = 'course_update',
  
  // Fellow specific
  FELLOW_ASSIGNMENT = 'fellow_assignment',
  FELLOW_PROGRESS = 'fellow_progress',
  FELLOW_MEETING = 'fellow_meeting',
  FELLOW_EVALUATION = 'fellow_evaluation',
  
  // Staff specific
  STAFF_TASK = 'staff_task',
  STAFF_REPORT = 'staff_report',
  STAFF_APPROVAL = 'staff_approval',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  content?: string; // Rich content for detailed notifications
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  isRead: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  
  // Action related
  actionUrl?: string; // URL to navigate when clicked
  actionText?: string; // Text for action button
  actionData?: Record<string, any>; // Additional data for actions
  
  // Related entities
  relatedEntityId?: string; // ID of related course, assignment, etc.
  relatedEntityType?: string; // Type of related entity
  
  // Timing
  scheduledAt?: string; // When to send (for scheduled notifications)
  sentAt?: string; // When it was actually sent
  readAt?: string; // When it was read
  expiresAt?: string; // When notification expires
  
  // Metadata
  metadata?: Record<string, any>;
  tags?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  subject: string; // Email subject
  title: string; // In-app title
  message: string; // In-app message
  emailTemplate: string; // HTML email template
  smsTemplate?: string; // SMS template
  pushTemplate?: string; // Push notification template
  
  // Template variables
  variables: string[]; // Available variables like {{userName}}, {{courseName}}
  
  // Default settings
  defaultPriority: NotificationPriority;
  defaultChannels: NotificationChannel[];
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  userId: string;
  
  // Channel preferences
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  
  // Type preferences
  typePreferences: Record<NotificationType, {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  }>;
  
  // Frequency preferences
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  
  // Language preferences
  language: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byStatus: Record<NotificationStatus, number>;
  recent: number; // Count from last 7 days
}

export interface EmailNotificationData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  template: string;
  variables: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: NotificationPriority;
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded content
  contentType: string;
  disposition?: 'attachment' | 'inline';
}

export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  channel?: NotificationChannel;
  dateFrom?: string;
  dateTo?: string;
  isRead?: boolean;
  isArchived?: boolean;
  search?: string;
  tags?: string[];
}

export interface BulkNotificationData {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  content?: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  actionUrl?: string;
  actionText?: string;
  scheduledAt?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

// Notification creation data
export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  content?: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  actionUrl?: string;
  actionText?: string;
  actionData?: Record<string, any>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  scheduledAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

// Email template variables
export interface EmailTemplateVariables {
  userName: string;
  userEmail: string;
  courseName?: string;
  assignmentName?: string;
  quizName?: string;
  grade?: number;
  dueDate?: string;
  submissionDate?: string;
  feedback?: string;
  applicationStatus?: string;
  fellowName?: string;
  staffName?: string;
  systemName?: string;
  loginUrl?: string;
  supportEmail?: string;
  [key: string]: any; // Allow additional variables
}





