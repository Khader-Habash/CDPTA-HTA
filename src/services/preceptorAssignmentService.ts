import { 
  PreceptorAssignment, 
  AssignmentCreationData, 
  AssignmentUpdateData, 
  AssignmentFilter, 
  AssignmentStats,
  ProgressReport,
  MonitoringDashboardData,
  MonitoringAlert,
  PreceptorWithAssignments,
  FellowWithPreceptor
} from '@/types/preceptorAssignment';
import { UserRole } from '@/types/auth';
import { userService } from './userService';

// Mock data for development
const mockAssignments: PreceptorAssignment[] = [
  {
    id: '1',
    preceptorId: 'user-khader-preceptor',
    fellowId: 'fellow-1',
    assignedBy: 'admin-1',
    assignedAt: '2024-01-15T10:00:00Z',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    notes: 'Primary preceptor assignment for clinical rotation',
    department: 'Internal Medicine',
    cohort: '2024A',
    assignmentType: 'primary',
    workload: 'full',
    lastInteraction: '2024-01-20T14:30:00Z',
    interactionCount: 5,
    progressReports: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    preceptorId: 'user-khader-preceptor',
    fellowId: 'fellow-2',
    assignedBy: 'admin-1',
    assignedAt: '2024-01-16T09:00:00Z',
    status: 'active',
    startDate: '2024-01-16',
    endDate: '2024-06-16',
    notes: 'Secondary mentor for research project',
    department: 'Cardiology',
    cohort: '2024A',
    assignmentType: 'secondary',
    workload: 'partial',
    lastInteraction: '2024-01-18T11:00:00Z',
    interactionCount: 3,
    progressReports: [],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  }
];

const mockProgressReports: ProgressReport[] = [
  {
    id: '1',
    assignmentId: '1',
    reportDate: '2024-01-20T14:30:00Z',
    reportType: 'weekly',
    submittedBy: 'preceptor',
    overallProgress: 75,
    milestones: [],
    challenges: ['Complex case management', 'Time management'],
    achievements: ['Completed first rotation', 'Improved patient communication'],
    nextSteps: ['Focus on diagnostic skills', 'Complete research proposal'],
    preceptorRating: 4,
    fellowRating: 5,
    feedback: 'Excellent progress, showing strong clinical skills',
    status: 'reviewed',
    reviewedBy: 'admin-1',
    reviewedAt: '2024-01-21T10:00:00Z'
  }
];

const mockAlerts: MonitoringAlert[] = [
  {
    id: '1',
    type: 'overdue_report',
    severity: 'medium',
    title: 'Weekly Report Overdue',
    message: 'Fellow John Doe has not submitted weekly report for 3 days',
    assignmentId: '1',
    fellowId: 'fellow-1',
    preceptorId: 'user-khader-preceptor',
    createdAt: '2024-01-23T09:00:00Z',
    acknowledged: false
  },
  {
    id: '2',
    type: 'milestone_overdue',
    severity: 'high',
    title: 'Milestone Overdue',
    message: 'Research proposal milestone is 5 days overdue',
    assignmentId: '2',
    fellowId: 'fellow-2',
    preceptorId: 'user-khader-preceptor',
    createdAt: '2024-01-22T14:00:00Z',
    acknowledged: false
  }
];

class PreceptorAssignmentService {
  // Get all assignments with optional filtering
  async getAssignments(filter?: AssignmentFilter): Promise<PreceptorAssignment[]> {
    try {
      let assignments = [...mockAssignments];

      if (filter) {
        // Apply filters
        if (filter.preceptorId && filter.preceptorId !== 'all') {
          assignments = assignments.filter(a => a.preceptorId === filter.preceptorId);
        }
        if (filter.fellowId && filter.fellowId !== 'all') {
          assignments = assignments.filter(a => a.fellowId === filter.fellowId);
        }
        if (filter.status && filter.status !== 'all') {
          assignments = assignments.filter(a => a.status === filter.status);
        }
        if (filter.assignmentType && filter.assignmentType !== 'all') {
          assignments = assignments.filter(a => a.assignmentType === filter.assignmentType);
        }
        if (filter.department && filter.department !== 'all') {
          assignments = assignments.filter(a => a.department === filter.department);
        }
        if (filter.cohort && filter.cohort !== 'all') {
          assignments = assignments.filter(a => a.cohort === filter.cohort);
        }
        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          assignments = assignments.filter(a => 
            a.notes?.toLowerCase().includes(searchLower) ||
            a.department?.toLowerCase().includes(searchLower) ||
            a.cohort?.toLowerCase().includes(searchLower)
          );
        }
        if (filter.dateRange) {
          assignments = assignments.filter(a => {
            const assignedDate = new Date(a.assignedAt);
            return assignedDate >= new Date(filter.dateRange!.start) && 
                   assignedDate <= new Date(filter.dateRange!.end);
          });
        }

        // Apply sorting
        if (filter.sortBy) {
          assignments.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (filter.sortBy) {
              case 'assignedAt':
                aValue = new Date(a.assignedAt);
                bValue = new Date(b.assignedAt);
                break;
              case 'lastInteraction':
                aValue = new Date(a.lastInteraction || a.assignedAt);
                bValue = new Date(b.lastInteraction || b.assignedAt);
                break;
              case 'status':
                aValue = a.status;
                bValue = b.status;
                break;
              default:
                aValue = a.id;
                bValue = b.id;
            }

            if (filter.sortOrder === 'desc') {
              return bValue > aValue ? 1 : -1;
            }
            return aValue > bValue ? 1 : -1;
          });
        }
      }

      return assignments;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw new Error('Failed to fetch assignments');
    }
  }

  // Get assignment by ID
  async getAssignmentById(id: string): Promise<PreceptorAssignment | null> {
    try {
      const assignment = mockAssignments.find(a => a.id === id);
      return assignment || null;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw new Error('Failed to fetch assignment');
    }
  }

  // Create new assignment
  async createAssignment(data: AssignmentCreationData): Promise<PreceptorAssignment> {
    try {
      const newAssignment: PreceptorAssignment = {
        id: `assignment-${Date.now()}`,
        preceptorId: data.preceptorId,
        fellowId: data.fellowId,
        assignedBy: 'current-admin-id', // This would come from auth context
        assignedAt: new Date().toISOString(),
        status: 'active',
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        department: data.department,
        cohort: data.cohort,
        assignmentType: data.assignmentType,
        workload: data.workload,
        interactionCount: 0,
        progressReports: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAssignments.push(newAssignment);
      
      // Update Khader's profile to include the new fellow
      try {
        const { userService } = await import('./userService');
        const khaderUser = await userService.getUserById('user-khader-preceptor');
        if (khaderUser) {
          const fellowUser = await userService.getUserById(data.fellowId);
          if (fellowUser) {
            // Update Khader's profile to include the new fellow
            const updatedProfileData = {
              ...khaderUser.profileData,
              fellowsAssigned: [
                ...(khaderUser.profileData?.fellowsAssigned || []),
                {
                  id: fellowUser.id,
                  name: `${fellowUser.firstName} ${fellowUser.lastName}`,
                  email: fellowUser.email,
                  cohort: data.cohort || '2024A',
                  startDate: data.startDate,
                  status: 'active'
                }
              ]
            };
            
            await userService.updateUser('user-khader-preceptor', {
              profileData: updatedProfileData
            });
            
            console.log('✅ Updated Khader\'s profile with new fellow:', {
              fellowName: `${fellowUser.firstName} ${fellowUser.lastName}`,
              fellowId: fellowUser.id
            });
          }
        }
      } catch (error) {
        console.error('❌ Failed to update Khader\'s profile:', error);
      }
      
      return newAssignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw new Error('Failed to create assignment');
    }
  }

  // Update assignment
  async updateAssignment(id: string, data: AssignmentUpdateData): Promise<PreceptorAssignment> {
    try {
      const assignmentIndex = mockAssignments.findIndex(a => a.id === id);
      if (assignmentIndex === -1) {
        throw new Error('Assignment not found');
      }

      const updatedAssignment = {
        ...mockAssignments[assignmentIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };

      mockAssignments[assignmentIndex] = updatedAssignment;
      return updatedAssignment;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw new Error('Failed to update assignment');
    }
  }

  // Delete assignment
  async deleteAssignment(id: string): Promise<void> {
    try {
      const assignmentIndex = mockAssignments.findIndex(a => a.id === id);
      if (assignmentIndex === -1) {
        throw new Error('Assignment not found');
      }

      mockAssignments.splice(assignmentIndex, 1);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw new Error('Failed to delete assignment');
    }
  }

  // Get assignments for a specific preceptor
  async getPreceptorAssignments(preceptorId: string): Promise<PreceptorAssignment[]> {
    try {
      return mockAssignments.filter(a => a.preceptorId === preceptorId);
    } catch (error) {
      console.error('Error fetching preceptor assignments:', error);
      throw new Error('Failed to fetch preceptor assignments');
    }
  }

  // Get assignment for a specific fellow
  async getFellowAssignment(fellowId: string): Promise<PreceptorAssignment | null> {
    try {
      return mockAssignments.find(a => a.fellowId === fellowId) || null;
    } catch (error) {
      console.error('Error fetching fellow assignment:', error);
      throw new Error('Failed to fetch fellow assignment');
    }
  }

  // Get assignment statistics
  async getAssignmentStats(): Promise<AssignmentStats> {
    try {
      const assignments = mockAssignments;
      
      const stats: AssignmentStats = {
        totalAssignments: assignments.length,
        activeAssignments: assignments.filter(a => a.status === 'active').length,
        completedAssignments: assignments.filter(a => a.status === 'completed').length,
        suspendedAssignments: assignments.filter(a => a.status === 'suspended').length,
        byType: {
          primary: assignments.filter(a => a.assignmentType === 'primary').length,
          secondary: assignments.filter(a => a.assignmentType === 'secondary').length,
          mentor: assignments.filter(a => a.assignmentType === 'mentor').length,
          supervisor: assignments.filter(a => a.assignmentType === 'supervisor').length,
        },
        byWorkload: {
          full: assignments.filter(a => a.workload === 'full').length,
          partial: assignments.filter(a => a.workload === 'partial').length,
          consultation: assignments.filter(a => a.workload === 'consultation').length,
        },
        averageInteractionFrequency: 7, // Mock value
        overdueReports: mockAlerts.filter(a => a.type === 'overdue_report').length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      throw new Error('Failed to fetch assignment statistics');
    }
  }

  // Get monitoring dashboard data
  async getMonitoringDashboardData(preceptorId?: string): Promise<MonitoringDashboardData> {
    try {
      const assignments = preceptorId 
        ? await this.getPreceptorAssignments(preceptorId)
        : await this.getAssignments();
      
      const stats = await this.getAssignmentStats();
      const recentReports = mockProgressReports.slice(0, 5);
      const upcomingMilestones: any[] = []; // Would be populated from milestone data
      const alerts = preceptorId 
        ? mockAlerts.filter(a => a.preceptorId === preceptorId)
        : mockAlerts;

      return {
        assignments,
        stats,
        recentReports,
        upcomingMilestones,
        alerts
      };
    } catch (error) {
      console.error('Error fetching monitoring dashboard data:', error);
      throw new Error('Failed to fetch monitoring dashboard data');
    }
  }

  // Add progress report
  async addProgressReport(assignmentId: string, report: Omit<ProgressReport, 'id'>): Promise<ProgressReport> {
    try {
      const newReport: ProgressReport = {
        ...report,
        id: `report-${Date.now()}`,
        status: 'submitted'
      };

      mockProgressReports.push(newReport);
      
      // Update assignment's last interaction
      const assignment = mockAssignments.find(a => a.id === assignmentId);
      if (assignment) {
        assignment.lastInteraction = newReport.reportDate;
        assignment.interactionCount += 1;
        assignment.progressReports.push(newReport);
      }

      return newReport;
    } catch (error) {
      console.error('Error adding progress report:', error);
      throw new Error('Failed to add progress report');
    }
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<void> {
    try {
      const alert = mockAlerts.find(a => a.id === alertId);
      if (alert) {
        alert.acknowledged = true;
        alert.acknowledgedBy = acknowledgedBy;
        alert.acknowledgedAt = new Date().toISOString();
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw new Error('Failed to acknowledge alert');
    }
  }

  // Get available preceptors (users with PRECEPTOR role)
  async getAvailablePreceptors(): Promise<any[]> {
    try {
      const users = await userService.getAllUsers();
      const preceptors = users.filter(user => user.role === UserRole.PRECEPTOR && user.isActive);
      
      return preceptors.map(preceptor => ({
        id: preceptor.id,
        firstName: preceptor.firstName,
        lastName: preceptor.lastName,
        email: preceptor.email,
        department: preceptor.profileData?.department || 'General Medicine'
      }));
    } catch (error) {
      console.error('Error fetching available preceptors:', error);
      throw new Error('Failed to fetch available preceptors');
    }
  }

  // Get available fellows (users with FELLOW role)
  async getAvailableFellows(): Promise<any[]> {
    try {
      const users = await userService.getAllUsers();
      const fellows = users.filter(user => user.role === UserRole.FELLOW && user.isActive);
      
      return fellows.map(fellow => ({
        id: fellow.id,
        firstName: fellow.firstName,
        lastName: fellow.lastName,
        email: fellow.email,
        cohort: fellow.profileData?.cohort || '2024A'
      }));
    } catch (error) {
      console.error('Error fetching available fellows:', error);
      throw new Error('Failed to fetch available fellows');
    }
  }

  // Get unassigned fellows (fellows without active assignments)
  async getUnassignedFellows(): Promise<any[]> {
    try {
      const fellows = await this.getAvailableFellows();
      const assignments = await this.getAssignments();
      const assignedFellowIds = assignments
        .filter(assignment => assignment.status === 'active')
        .map(assignment => assignment.fellowId);
      
      return fellows.filter(fellow => !assignedFellowIds.includes(fellow.id));
    } catch (error) {
      console.error('Error fetching unassigned fellows:', error);
      throw new Error('Failed to fetch unassigned fellows');
    }
  }

  // Get fellows assigned to a specific preceptor
  async getFellowsByPreceptor(preceptorId: string): Promise<any[]> {
    try {
      const assignments = await this.getAssignments();
      const preceptorAssignments = assignments.filter(
        assignment => assignment.preceptorId === preceptorId && assignment.status === 'active'
      );
      
      const fellows = await this.getAvailableFellows();
      return fellows.filter(fellow => 
        preceptorAssignments.some(assignment => assignment.fellowId === fellow.id)
      );
    } catch (error) {
      console.error('Error fetching fellows by preceptor:', error);
      throw new Error('Failed to fetch fellows by preceptor');
    }
  }
}

export const preceptorAssignmentService = new PreceptorAssignmentService();
