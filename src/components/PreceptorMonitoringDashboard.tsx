import React, { useState, useEffect } from 'react';
import { 
  PreceptorAssignment, 
  ProgressReport, 
  MonitoringDashboardData,
  MonitoringAlert,
  AssignmentStats
} from '@/types/preceptorAssignment';
import { preceptorAssignmentService } from '@/services/preceptorAssignmentService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toaster';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  MessageCircle,
  FileText,
  BarChart3,
  Activity,
  Target,
  Award,
  Eye,
  Plus,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';

const PreceptorMonitoringDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [dashboardData, setDashboardData] = useState<MonitoringDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<PreceptorAssignment | null>(null);
  const [showFellowDetails, setShowFellowDetails] = useState(false);
  const [showProgressReportModal, setShowProgressReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'fellows' | 'reports' | 'alerts'>('overview');

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        console.warn('No user ID available for loading dashboard data');
        setDashboardData({
          assignments: [],
          stats: {
            totalAssignments: 0,
            activeAssignments: 0,
            completedAssignments: 0,
            overdueReports: 0
          },
          recentReports: [],
          upcomingMilestones: [],
          alerts: []
        });
        return;
      }
      
      const data = await preceptorAssignmentService.getMonitoringDashboardData(user.id);
      
      // Get fellow details for each assignment
      const assignmentsWithFellowDetails = await Promise.all(
        data.assignments.map(async (assignment) => {
          try {
            const fellowDetails = await preceptorAssignmentService.getAvailableFellows();
            const fellow = fellowDetails.find(f => f.id === assignment.fellowId);
            return {
              ...assignment,
              fellowName: fellow ? `${fellow.firstName} ${fellow.lastName}` : assignment.fellowId,
              fellowEmail: fellow?.email || 'Unknown',
              fellowCohort: fellow?.cohort || assignment.cohort
            };
          } catch (error) {
            console.error('Error fetching fellow details:', error);
            return assignment;
          }
        })
      );
      
      setDashboardData({
        ...data,
        assignments: assignmentsWithFellowDetails
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data'
      });
      
      // Set empty data to prevent crashes
      setDashboardData({
        assignments: [],
        stats: {
          totalAssignments: 0,
          activeAssignments: 0,
          completedAssignments: 0,
          overdueReports: 0
        },
        recentReports: [],
        upcomingMilestones: [],
        alerts: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await preceptorAssignmentService.acknowledgeAlert(alertId, user?.id || '');
      addToast({
        type: 'success',
        title: 'Alert Acknowledged',
        message: 'Alert has been marked as acknowledged'
      });
      loadDashboardData();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to acknowledge alert'
      });
    }
  };

  // Get severity badge styling
  const getSeverityBadge = (severity: MonitoringAlert['severity']) => {
    const styles = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return styles[severity];
  };

  // Get status badge styling
  const getStatusBadge = (status: PreceptorAssignment['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return styles[status];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Unable to load monitoring dashboard data.</p>
      </div>
    );
  }

  const { assignments, stats, recentReports, alerts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h1>
          <p className="text-gray-600">Track and monitor your assigned fellows' progress</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowProgressReportModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Report
          </Button>
          <Button
            variant="outline"
            onClick={loadDashboardData}
            className="flex items-center gap-2"
          >
            <Activity size={20} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Fellows</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeAssignments || 0}</p>
                <p className="text-xs text-green-600">+{(stats?.totalAssignments || 0) - (stats?.activeAssignments || 0)} total</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats?.completedAssignments || 0}</p>
                <p className="text-xs text-gray-500">This period</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{alerts.filter(a => !a.acknowledged).length}</p>
                <p className="text-xs text-gray-500">Require attention</p>
              </div>
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Interaction</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.averageInteractionFrequency || 0}</p>
                <p className="text-xs text-gray-500">Days between</p>
              </div>
              <Clock className="text-blue-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'fellows', label: 'Fellows', icon: Users },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'alerts', label: 'Alerts', icon: AlertCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} />
                Recent Activity
              </h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {recentReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Progress report submitted
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(report.reportDate).toLocaleDateString()} • {report.overallProgress}% complete
                      </p>
                    </div>
                  </div>
                ))}
                {recentReports.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Assignment Types */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target size={20} />
                Assignment Types
              </h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {Object.entries(stats?.byType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    <span className="text-sm text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === 'fellows' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users size={20} />
              Assigned Fellows
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fellow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Interaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {(assignment as any).fellowName || assignment.fellowId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {(assignment as any).fellowEmail || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {(assignment as any).fellowCohort || assignment.cohort}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {assignment.assignmentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getStatusBadge(assignment.status)
                        )}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">75%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.lastInteraction 
                          ? new Date(assignment.lastInteraction).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowFellowDetails(true);
                            }}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Navigate to course management for this fellow
                              window.location.href = `/preceptor/courses?fellow=${assignment.fellowId}`;
                            }}
                          >
                            <BookOpen size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Progress Reports
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)} Report
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${report.overallProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{report.overallProgress}% complete</span>
                  </div>
                  {report.feedback && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {report.feedback}
                    </p>
                  )}
                </div>
              ))}
              {recentReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
                  <p className="text-gray-600">Progress reports will appear here once submitted.</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'alerts' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle size={20} />
              Monitoring Alerts
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={clsx(
                  'border rounded-lg p-4',
                  alert.acknowledged ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getSeverityBadge(alert.severity)
                        )}>
                          {alert.severity}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleDateString()} at {new Date(alert.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="ml-4"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No alerts requiring attention.</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Fellow Details Modal */}
      {showFellowDetails && selectedAssignment && (
        <FellowDetailsModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowFellowDetails(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Progress Report Modal */}
      {showProgressReportModal && (
        <ProgressReportModal
          assignments={assignments}
          onClose={() => setShowProgressReportModal(false)}
          onSubmit={() => {
            setShowProgressReportModal(false);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};

// Fellow Details Modal Component
const FellowDetailsModal: React.FC<{
  assignment: PreceptorAssignment;
  onClose: () => void;
}> = ({ assignment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Fellow Details</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Fellow</label>
                <p className="text-gray-900">{assignment.fellowId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cohort</label>
                <p className="text-gray-900">{assignment.cohort}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assignment Type</label>
                <p className="text-gray-900 capitalize">{assignment.assignmentType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Workload</label>
                <p className="text-gray-900 capitalize">{assignment.workload}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900 capitalize">{assignment.status}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">{new Date(assignment.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="text-gray-900">
                  {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Interaction</label>
                <p className="text-gray-900">
                  {assignment.lastInteraction 
                    ? new Date(assignment.lastInteraction).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interaction Count</label>
                <p className="text-gray-900">{assignment.interactionCount}</p>
              </div>
            </div>
          </div>
        </div>

        {assignment.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{assignment.notes}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Progress Report Modal Component
const ProgressReportModal: React.FC<{
  assignments: PreceptorAssignment[];
  onClose: () => void;
  onSubmit: () => void;
}> = ({ assignments, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    assignmentId: '',
    reportType: 'weekly' as const,
    overallProgress: 0,
    challenges: '',
    achievements: '',
    nextSteps: '',
    feedback: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Progress Report</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fellow Assignment *
            </label>
            <select
              required
              value={formData.assignmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, assignmentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Fellow</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.fellowId} - {assignment.cohort}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type *
            </label>
            <select
              required
              value={formData.reportType}
              onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Progress (%) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={formData.overallProgress}
              onChange={(e) => setFormData(prev => ({ ...prev, overallProgress: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challenges
            </label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe any challenges faced..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Achievements
            </label>
            <textarea
              value={formData.achievements}
              onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Highlight key achievements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Steps
            </label>
            <textarea
              value={formData.nextSteps}
              onChange={(e) => setFormData(prev => ({ ...prev, nextSteps: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Outline next steps and goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide feedback and recommendations..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreceptorMonitoringDashboard;
