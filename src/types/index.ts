// Re-export all types for easy importing
export * from './auth';
export * from './admin';
export * from './course';
export * from './application';
export * from './courseManagement';
export * from './announcement';
export * from './htaProgram';

// Import UserRole for use in this file
import { UserRole } from './auth';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation and UI types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavItem[];
  requiredRole?: UserRole;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Form and validation types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, unknown>;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalUsers: number;
  activeApplications: number;
  currentFellows: number;
  completedProjects: number;
}

// Content management types

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  attachments?: Document[];
  order: number;
  duration?: number;
  isCompleted?: boolean;
}

// Calendar and scheduling types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'meeting' | 'deadline' | 'workshop' | 'presentation';
  attendees: string[];
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
}
