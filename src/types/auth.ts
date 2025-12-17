// User role definitions for the educational platform
export enum UserRole {
  APPLICANT = 'applicant',
  FELLOW = 'fellow',
  PRECEPTOR = 'preceptor',
  ADMIN = 'admin',
}

// User permissions based on role
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileData: UserProfileData;
}

// Role-specific profile data
export interface UserProfileData {
  // Common fields
  phone?: string;
  bio?: string;
  
  // Applicant-specific fields
  applicationStatus?: 'pending' | 'under_review' | 'accepted' | 'rejected';
  applicationDate?: string;
  documents?: Document[];
  
  // Fellow-specific fields
  cohort?: string;
  startDate?: string;
  endDate?: string;
  mentor?: string;
  projects?: Project[];
  
  // Preceptor-specific fields
  department?: string;
  position?: string;
  fellowsAssigned?: string[];
  
  // Admin-specific fields
  adminLevel?: 'super' | 'system' | 'content';
}

// Document interface for file uploads
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Project interface for Fellows
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate?: string;
  mentorId?: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login/Register form data
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  organization: string;
  position: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isKHCCStaff?: boolean;
  khccStaffId?: string;
  researchArea?: string;
  supervisor?: string;
  department?: string;
}

// API Response types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
