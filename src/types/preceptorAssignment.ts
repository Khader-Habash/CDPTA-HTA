import { User, UserRole } from './auth';

// Preceptor-Fellow Assignment Interface
export interface PreceptorAssignment {
  id: string;
  preceptorId: string;
  fellowId: string;
  assignedBy: string; // Admin who made the assignment
  assignedAt: string;
  status: 'active' | 'inactive' | 'completed' | 'suspended';
  startDate: string;
  endDate?: string;
  notes?: string;
  department?: string;
  cohort?: string;
  
  // Assignment details
  assignmentType: 'primary' | 'secondary' | 'mentor' | 'supervisor';
  workload: 'full' | 'partial' | 'consultation';
  
  // Monitoring data
  lastInteraction?: string;
  interactionCount: number;
  progressReports: ProgressReport[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Progress Report Interface
export interface ProgressReport {
  id: string;
  assignmentId: string;
  reportDate: string;
  reportType: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  submittedBy: 'preceptor' | 'fellow' | 'admin';
  
  // Progress metrics
  overallProgress: number; // percentage
  milestones: Milestone[];
  challenges: string[];
  achievements: string[];
  nextSteps: string[];
  
  // Ratings and feedback
  preceptorRating?: number; // 1-5 scale
  fellowRating?: number; // 1-5 scale
  feedback?: string;
  
  // Status
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  reviewedBy?: string;
  reviewedAt?: string;
}

// Milestone Interface
export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[]; // Other milestone IDs
}

// Assignment Filter Interface
export interface AssignmentFilter {
  preceptorId?: string;
  fellowId?: string;
  status?: PreceptorAssignment['status'] | 'all';
  assignmentType?: PreceptorAssignment['assignmentType'] | 'all';
  department?: string | 'all';
  cohort?: string | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: 'assignedAt' | 'lastInteraction' | 'preceptorName' | 'fellowName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Assignment Statistics Interface
export interface AssignmentStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  suspendedAssignments: number;
  byType: {
    primary: number;
    secondary: number;
    mentor: number;
    supervisor: number;
  };
  byWorkload: {
    full: number;
    partial: number;
    consultation: number;
  };
  averageInteractionFrequency: number; // days between interactions
  overdueReports: number;
}

// Assignment Creation Data Interface
export interface AssignmentCreationData {
  preceptorId: string;
  fellowId: string;
  assignmentType: PreceptorAssignment['assignmentType'];
  workload: PreceptorAssignment['workload'];
  startDate: string;
  endDate?: string;
  department?: string;
  cohort?: string;
  notes?: string;
}

// Assignment Update Data Interface
export interface AssignmentUpdateData {
  status?: PreceptorAssignment['status'];
  assignmentType?: PreceptorAssignment['assignmentType'];
  workload?: PreceptorAssignment['workload'];
  endDate?: string;
  notes?: string;
}

// Monitoring Dashboard Data Interface
export interface MonitoringDashboardData {
  assignments: PreceptorAssignment[];
  stats: AssignmentStats;
  recentReports: ProgressReport[];
  upcomingMilestones: Milestone[];
  alerts: MonitoringAlert[];
}

// Monitoring Alert Interface
export interface MonitoringAlert {
  id: string;
  type: 'overdue_report' | 'missed_interaction' | 'low_progress' | 'milestone_overdue' | 'assignment_expiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  assignmentId: string;
  fellowId: string;
  preceptorId: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// Extended User interfaces for assignment context
export interface PreceptorWithAssignments extends User {
  assignments: PreceptorAssignment[];
  stats: {
    totalFellows: number;
    activeAssignments: number;
    averageRating: number;
    lastInteraction: string;
  };
}

export interface FellowWithPreceptor extends User {
  preceptorAssignment?: PreceptorAssignment;
  progressData: {
    overallProgress: number;
    lastReportDate: string;
    upcomingMilestones: number;
    completedMilestones: number;
  };
}




