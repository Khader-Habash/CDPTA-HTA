import React, { useState, useEffect } from 'react';
import { 
  PreceptorAssignment, 
  AssignmentCreationData, 
  AssignmentFilter, 
  AssignmentStats 
} from '@/types/preceptorAssignment';
import { preceptorAssignmentService } from '@/services/preceptorAssignmentService';
import { useToast } from '@/components/ui/Toaster';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';

const AdminPreceptorAssignment: React.FC = () => {
  const [assignments, setAssignments] = useState<PreceptorAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<PreceptorAssignment[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [unassignedFellows, setUnassignedFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUnassignedModal, setShowUnassignedModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<PreceptorAssignment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'unassigned'>('assignments');
  const { addToast } = useToast();

  const [filters, setFilters] = useState<AssignmentFilter>({
    status: 'all',
    assignmentType: 'all',
    department: 'all',
    cohort: 'all',
    searchTerm: '',
    sortBy: 'assignedAt',
    sortOrder: 'desc'
  });

  // Load assignments and stats
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [assignmentsData, statsData, unassignedData] = await Promise.all([
        preceptorAssignmentService.getAssignments(filters),
        preceptorAssignmentService.getAssignmentStats(),
        preceptorAssignmentService.getUnassignedFellows()
      ]);
      
      setAssignments(assignmentsData || []);
      setFilteredAssignments(assignmentsData || []);
      setStats(statsData || null);
      setUnassignedFellows(unassignedData || []);
    } catch (error) {
      console.error('Error loading assignment data:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load assignment data'
      });
      
      // Set empty data to prevent crashes
      setAssignments([]);
      setFilteredAssignments([]);
      setStats(null);
      setUnassignedFellows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof AssignmentFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle assignment creation
  const handleCreateAssignment = async (data: AssignmentCreationData) => {
    try {
      await preceptorAssignmentService.createAssignment(data);
      addToast({
        type: 'success',
        title: 'Assignment Created',
        message: 'Preceptor assignment has been created successfully'
      });
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create assignment'
      });
    }
  };

  // Handle assignment update
  const handleUpdateAssignment = async (id: string, data: any) => {
    try {
      await preceptorAssignmentService.updateAssignment(id, data);
      addToast({
        type: 'success',
        title: 'Assignment Updated',
        message: 'Assignment has been updated successfully'
      });
      loadData();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update assignment'
      });
    }
  };

  // Handle assignment deletion
  const handleDeleteAssignment = async (id: string) => {
    try {
      await preceptorAssignmentService.deleteAssignment(id);
      addToast({
        type: 'success',
        title: 'Assignment Deleted',
        message: 'Assignment has been deleted successfully'
      });
      loadData();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete assignment'
      });
    }
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

  // Get assignment type badge styling
  const getTypeBadge = (type: PreceptorAssignment['assignmentType']) => {
    const styles = {
      primary: 'bg-purple-100 text-purple-800',
      secondary: 'bg-blue-100 text-blue-800',
      mentor: 'bg-green-100 text-green-800',
      supervisor: 'bg-orange-100 text-orange-800'
    };
    return styles[type];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preceptor Assignments</h1>
          <p className="text-gray-600">Manage preceptor-fellow assignments and monitor progress</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowUnassignedModal(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users size={20} />
            Assign Unassigned ({unassignedFellows.length})
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={20} />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assignments')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'assignments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Current Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab('unassigned')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'unassigned'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Unassigned Fellows ({unassignedFellows.length})
          </button>
        </nav>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
                </div>
                <BarChart3 className="text-blue-600" size={24} />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAssignments}</p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedAssignments}</p>
                </div>
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Reports</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueReports}</p>
                </div>
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <Card.Content>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Type
                </label>
                <select
                  value={filters.assignmentType}
                  onChange={(e) => handleFilterChange('assignmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="mentor">Mentor</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cohort
                </label>
                <select
                  value={filters.cohort}
                  onChange={(e) => handleFilterChange('cohort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Cohorts</option>
                  <option value="2024A">2024A</option>
                  <option value="2024B">2024B</option>
                  <option value="2023A">2023A</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Tab Content */}
      {activeTab === 'assignments' && (
        <Card>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.length === filteredAssignments.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssignments(filteredAssignments.map(a => a.id));
                          } else {
                            setSelectedAssignments([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preceptor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fellow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
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
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAssignments.includes(assignment.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAssignments(prev => [...prev, assignment.id]);
                            } else {
                              setSelectedAssignments(prev => prev.filter(id => id !== assignment.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserCheck className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {assignment.preceptorId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.fellowId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.cohort}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getTypeBadge(assignment.assignmentType)
                        )}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.department}
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
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Handle edit
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAssignments.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600">Create a new assignment to get started.</p>
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      {activeTab === 'unassigned' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users size={20} />
              Unassigned Fellows ({unassignedFellows.length})
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedFellows.map((fellow) => (
                <div key={fellow.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {fellow.firstName} {fellow.lastName}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{fellow.email}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {fellow.cohort}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowCreateModal(true);
                      // Pre-fill the fellow selection
                    }}
                    className="w-full"
                  >
                    Assign to Preceptor
                  </Button>
                </div>
              ))}
            </div>

            {unassignedFellows.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Fellows Assigned!</h3>
                <p className="text-gray-600">All active fellows have been assigned to preceptors.</p>
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <AssignmentCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {/* Bulk Assignment Modal for Unassigned Fellows */}
      {showUnassignedModal && (
        <BulkAssignmentModal
          fellows={unassignedFellows}
          onClose={() => setShowUnassignedModal(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAssignment(null);
          }}
          onUpdate={handleUpdateAssignment}
        />
      )}
    </div>
  );
};

// Assignment Creation Modal Component
const AssignmentCreationModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: AssignmentCreationData) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AssignmentCreationData>({
    preceptorId: '',
    fellowId: '',
    assignmentType: 'primary',
    workload: 'full',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    department: '',
    cohort: '',
    notes: ''
  });

  const [preceptors, setPreceptors] = useState<any[]>([]);
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [preceptorsData, fellowsData] = await Promise.all([
          preceptorAssignmentService.getAvailablePreceptors(),
          preceptorAssignmentService.getAvailableFellows()
        ]);
        setPreceptors(preceptorsData);
        setFellows(fellowsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preceptor *
              </label>
              <select
                required
                value={formData.preceptorId}
                onChange={(e) => setFormData(prev => ({ ...prev, preceptorId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Preceptor</option>
                {preceptors.map(preceptor => (
                  <option key={preceptor.id} value={preceptor.id}>
                    {preceptor.firstName} {preceptor.lastName} - {preceptor.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fellow *
              </label>
              <select
                required
                value={formData.fellowId}
                onChange={(e) => setFormData(prev => ({ ...prev, fellowId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Fellow</option>
                {fellows.map(fellow => (
                  <option key={fellow.id} value={fellow.id}>
                    {fellow.firstName} {fellow.lastName} - {fellow.cohort}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Type *
              </label>
              <select
                required
                value={formData.assignmentType}
                onChange={(e) => setFormData(prev => ({ ...prev, assignmentType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="mentor">Mentor</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workload *
              </label>
              <select
                required
                value={formData.workload}
                onChange={(e) => setFormData(prev => ({ ...prev, workload: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full">Full</option>
                <option value="partial">Partial</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Internal Medicine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cohort
              </label>
              <input
                type="text"
                value={formData.cohort}
                onChange={(e) => setFormData(prev => ({ ...prev, cohort: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2024A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this assignment..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Assignment Details Modal Component
const AssignmentDetailsModal: React.FC<{
  assignment: PreceptorAssignment;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
}> = ({ assignment, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Assignment Details</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Preceptor</label>
                <p className="text-gray-900">{assignment.preceptorId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fellow</label>
                <p className="text-gray-900">{assignment.fellowId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
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
                <label className="text-sm font-medium text-gray-500">Assigned At</label>
                <p className="text-gray-900">{new Date(assignment.assignedAt).toLocaleDateString()}</p>
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

// Bulk Assignment Modal Component
const BulkAssignmentModal: React.FC<{
  fellows: any[];
  onClose: () => void;
  onSubmit: (data: AssignmentCreationData) => void;
}> = ({ fellows, onClose, onSubmit }) => {
  const [selectedFellows, setSelectedFellows] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    preceptorId: '',
    assignmentType: 'primary' as const,
    workload: 'full' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    department: '',
    cohort: '',
    notes: ''
  });

  const [preceptors, setPreceptors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPreceptors = async () => {
      setIsLoading(true);
      try {
        const preceptorsData = await preceptorAssignmentService.getAvailablePreceptors();
        setPreceptors(preceptorsData);
      } catch (error) {
        console.error('Error loading preceptors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPreceptors();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFellows.length === 0) {
      alert('Please select at least one fellow');
      return;
    }
    
    // Create assignments for each selected fellow
    selectedFellows.forEach(fellowId => {
      onSubmit({
        ...formData,
        fellowId
      });
    });
    
    onClose();
  };

  const toggleFellow = (fellowId: string) => {
    setSelectedFellows(prev => 
      prev.includes(fellowId) 
        ? prev.filter(id => id !== fellowId)
        : [...prev, fellowId]
    );
  };

  const selectAllFellows = () => {
    setSelectedFellows(fellows.map(f => f.id));
  };

  const deselectAllFellows = () => {
    setSelectedFellows([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Bulk Assign Fellows to Preceptor</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preceptor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preceptor *
            </label>
            <select
              required
              value={formData.preceptorId}
              onChange={(e) => setFormData(prev => ({ ...prev, preceptorId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Preceptor</option>
              {preceptors.map(preceptor => (
                <option key={preceptor.id} value={preceptor.id}>
                  {preceptor.firstName} {preceptor.lastName} - {preceptor.department}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Type *
              </label>
              <select
                required
                value={formData.assignmentType}
                onChange={(e) => setFormData(prev => ({ ...prev, assignmentType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="mentor">Mentor</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workload *
              </label>
              <select
                required
                value={formData.workload}
                onChange={(e) => setFormData(prev => ({ ...prev, workload: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full">Full</option>
                <option value="partial">Partial</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fellow Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Fellows to Assign ({selectedFellows.length} selected)
              </label>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllFellows}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllFellows}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
              {fellows.map((fellow) => (
                <div key={fellow.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedFellows.includes(fellow.id)}
                    onChange={() => toggleFellow(fellow.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {fellow.firstName} {fellow.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{fellow.email}</div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {fellow.cohort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about these assignments..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedFellows.length === 0}>
              {isLoading ? 'Creating...' : `Create ${selectedFellows.length} Assignment${selectedFellows.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPreceptorAssignment;
