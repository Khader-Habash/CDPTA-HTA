import { User, UserRole } from './auth';

export interface AdminUser extends User {
  lastLogin?: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  loginCount: number;
  lastActivity?: string;
  enrolledCourses?: number;
  department?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserFilter {
  role?: UserRole | 'all';
  status?: AdminUser['status'] | 'all';
  department?: string | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: 'name' | 'email' | 'role' | 'status' | 'lastLogin' | 'registrationDate';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkAction {
  type: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'changeRole' | 'sendEmail' | 'export';
  userIds: string[];
  data?: {
    newRole?: UserRole;
    message?: string;
    subject?: string;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pending: number;
  byRole: {
    [key in UserRole]: number;
  };
  recentRegistrations: number;
  recentLogins: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'profile_update' | 'password_change' | 'course_enrollment' | 'assignment_submission';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment?: string;
  userCount: number;
  isActive: boolean;
}

export interface UserManagementSettings {
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  defaultRole: UserRole;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  enableTwoFactor: boolean;
  allowRoleChange: boolean;
  enableUserNotes: boolean;
}

export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    email: string;
    warning: string;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields: string[];
  filters?: UserFilter;
  includeInactive: boolean;
  includePersonalData: boolean;
}
