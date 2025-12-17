import React, { useState, useEffect, useMemo } from 'react';
import { AdminUser, UserFilter, BulkAction, UserStats, Department } from '@/types/admin';
import { UserRole } from '@/types';
import { useToast } from '@/components/ui/Toaster';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AdminUserCreationForm from '@/components/AdminUserCreationForm';
import { userService } from '@/services/userService';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  UserCheck,
  Shield,
  BookOpen,
  Mail,
  Calendar,
  Activity,
  FileText,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { clsx } from 'clsx';

// No hardcoded mock users - only load real users from userService

const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science', description: 'Computer Science Department', userCount: 45, isActive: true },
  { id: '2', name: 'Mathematics', description: 'Mathematics Department', userCount: 32, isActive: true },
  { id: '3', name: 'Engineering', description: 'Engineering Department', userCount: 78, isActive: true },
  { id: '4', name: 'Physics', description: 'Physics Department', userCount: 28, isActive: true },
  { id: '5', name: 'IT Services', description: 'IT Services Department', userCount: 12, isActive: true }
];

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const { addToast } = useToast();

  const [filters, setFilters] = useState<UserFilter>({
    role: 'all',
    status: 'all',
    department: 'all',
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Load real users from localStorage and applications
  const loadRealUsers = async () => {
    try {
      setIsLoading(true);
      
      // Load users from userService (which handles both Supabase and localStorage)
      const allUsers = await userService.getAllUsers();
      
      // Convert userService users to AdminUser format
      const adminUsers: AdminUser[] = allUsers.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: [],
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileData: {},
        status: user.isActive ? 'active' : 'inactive',
        emailVerified: true,
        loginCount: 0,
        lastLogin: null,
        registrationDate: user.createdAt,
        lastActivity: user.updatedAt,
        department: 'N/A'
      }));
      
      setUsers(adminUsers);
      setFilteredUsers(adminUsers);
      
      console.log('👥 Loaded users from userService:', {
        total: adminUsers.length
      });
    } catch (error) {
      console.error('Error loading users:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadRealUsers();
  }, []);

  // Calculate user statistics
  const userStats: UserStats = useMemo(() => {
    const stats: UserStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      pending: users.filter(u => u.status === 'pending').length,
      byRole: {
        [UserRole.ADMIN]: users.filter(u => u.role === UserRole.ADMIN).length,
        [UserRole.PRECEPTOR]: users.filter(u => u.role === UserRole.PRECEPTOR).length,
        [UserRole.FELLOW]: users.filter(u => u.role === UserRole.FELLOW).length,
        [UserRole.APPLICANT]: users.filter(u => u.role === UserRole.APPLICANT).length,
      },
      recentRegistrations: users.filter(u => 
        new Date(u.registrationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      recentLogins: users.filter(u => 
        u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };
    return stats;
  }, [users]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...users];

    // Text search
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.department && user.department.toLowerCase().includes(searchLower))
      );
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Department filter
    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastLogin':
          aValue = a.lastLogin || '1970-01-01';
          bValue = b.lastLogin || '1970-01-01';
          break;
        case 'registrationDate':
          aValue = a.registrationDate;
          bValue = b.registrationDate;
          break;
        default:
          aValue = a.firstName;
          bValue = b.firstName;
      }

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handlePasswordReset = async () => {
    console.log('🔑 Password reset triggered:', { passwordResetUserId, newPassword });
    
    if (!passwordResetUserId || !newPassword) {
      console.log('❌ Invalid input - missing userId or password');
      addToast({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please enter a valid password (min 8 characters).'
      });
      return;
    }

    if (newPassword.length < 8) {
      console.log('❌ Password too short:', newPassword.length);
      addToast({
        type: 'error',
        title: 'Password Too Short',
        message: 'Password must be at least 8 characters long.'
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Calling userService.resetUserPassword...');
      await userService.resetUserPassword(passwordResetUserId, newPassword);
      console.log('✅ Password reset successful');
      addToast({
        type: 'success',
        title: 'Password Reset',
        message: 'User password has been successfully reset.'
      });
      setShowPasswordResetModal(false);
      setPasswordResetUserId(null);
      setNewPassword('');
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      addToast({
        type: 'error',
        title: 'Password Reset Failed',
        message: error instanceof Error ? error.message : 'Failed to reset password.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    setIsLoading(true);
    try {
      const updatedUser = await userService.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: updatedUser.isActive, status: updatedUser.isActive ? 'active' : 'inactive' } : u));
      addToast({
        type: 'success',
        title: updatedUser.isActive ? 'User Activated' : 'User Deactivated',
        message: `${updatedUser.firstName} ${updatedUser.lastName} has been ${updatedUser.isActive ? 'activated' : 'deactivated'}.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to toggle user status.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addToast({
        type: 'success',
        title: 'User Deleted',
        message: 'User has been permanently deleted.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete user.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    setIsLoading(true);
    try {
      // Use userService for activate/deactivate
      if (action.type === 'activate' || action.type === 'deactivate') {
        for (const userId of action.userIds) {
          const user = users.find(u => u.id === userId);
          if (user) {
            const shouldActivate = action.type === 'activate';
            if (user.isActive !== shouldActivate) {
              await userService.toggleUserStatus(userId);
            }
          }
        }
        
        setUsers(prev => prev.map(user =>
          action.userIds.includes(user.id)
            ? { ...user, status: action.type === 'activate' ? 'active' as const : 'inactive' as const, isActive: action.type === 'activate' }
            : user
        ));
        
        addToast({
          type: 'success',
          title: action.type === 'activate' ? 'Users Activated' : 'Users Deactivated',
          message: `${action.userIds.length} users have been ${action.type === 'activate' ? 'activated' : 'deactivated'}.`
        });
      } else {
        // Simulate API call for other actions
        await new Promise(resolve => setTimeout(resolve, 1500));

        switch (action.type) {
          case 'deactivate':
            setUsers(prev => prev.map(user =>
              action.userIds.includes(user.id)
                ? { ...user, status: 'inactive' as const, isActive: false }
                : user
            ));
            addToast({
              type: 'success',
              title: 'Users Deactivated',
              message: `${action.userIds.length} users have been deactivated.`
            });
            break;
        case 'suspend':
          setUsers(prev => prev.map(user =>
            action.userIds.includes(user.id)
              ? { ...user, status: 'suspended' as const, isActive: false }
              : user
          ));
          addToast({
            type: 'warning',
            title: 'Users Suspended',
            message: `${action.userIds.length} users have been suspended.`
          });
          break;
        case 'delete':
          setUsers(prev => prev.filter(user => !action.userIds.includes(user.id)));
          addToast({
            type: 'error',
            title: 'Users Deleted',
            message: `${action.userIds.length} users have been deleted.`
          });
          break;
        case 'changeRole':
          if (action.data?.newRole) {
            setUsers(prev => prev.map(user =>
              action.userIds.includes(user.id)
                ? { ...user, role: action.data!.newRole! }
                : user
            ));
            addToast({
              type: 'success',
              title: 'Roles Updated',
              message: `${action.userIds.length} users' roles have been updated.`
            });
          }
          break;
        case 'promoteToFellow':
          // Promote applicants to fellows
          setUsers(prev => prev.map(user =>
            action.userIds.includes(user.id)
              ? { 
                  ...user, 
                  role: UserRole.FELLOW,
                  status: 'active' as const,
                  isActive: true,
                  profileData: {
                    ...user.profileData,
                    cohort: '2024A',
                    startDate: new Date().toISOString().split('T')[0]
                  }
                }
              : user
          ));
          addToast({
            type: 'success',
            title: 'Users Promoted',
            message: `${action.userIds.length} applicants have been promoted to fellows.`
          });
          break;
        case 'sendEmail':
          addToast({
            type: 'info',
            title: 'Email Sent',
            message: `Email sent to ${action.userIds.length} users.`
          });
          break;
        }
      }

      setSelectedUsers([]);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: 'The bulk action could not be completed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <Shield className="text-red-600" size={16} />;
      case UserRole.PRECEPTOR: return <UserCheck className="text-blue-600" size={16} />;
      case UserRole.FELLOW: return <BookOpen className="text-green-600" size={16} />;
      case UserRole.APPLICANT: return <Users className="text-purple-600" size={16} />;
      default: return <Users className="text-gray-600" size={16} />;
    }
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800', icon: Ban, text: 'Suspended' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pending' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={clsx('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', config.color)}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const formatLastActivity = (date: string | undefined) => {
    if (!date) return 'Never';
    const now = new Date();
    const activity = new Date(date);
    const diffMs = now.getTime() - activity.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return activity.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadRealUsers}>
            <Activity size={16} className="mr-2" />
            Refresh Users
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('🧪 Test modal button clicked');
              setPasswordResetUserId('test-user-id');
              setShowPasswordResetModal(true);
            }}
            className="bg-yellow-100 text-yellow-800"
          >
            Test Modal
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              try {
                await userService.clearAllMockUsers();
                addToast({
                  type: 'success',
                  title: 'Mock Users Cleared',
                  message: 'All mock users have been removed successfully.',
                });
                loadRealUsers();
              } catch (error) {
                addToast({
                  type: 'error',
                  title: 'Error',
                  message: 'Failed to clear mock users.',
                });
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} className="mr-2" />
            Clear Mock Users
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import Users
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Users
          </Button>
          <Button size="sm" onClick={() => setShowCreateUserModal(true)}>
            <UserPlus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              </div>
              <Users className="text-gray-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-red-600">{userStats.byRole[UserRole.ADMIN]}</p>
              </div>
              <Shield className="text-red-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preceptors</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.byRole[UserRole.PRECEPTOR]}</p>
              </div>
              <UserCheck className="text-blue-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fellows</p>
                <p className="text-2xl font-bold text-green-600">{userStats.byRole[UserRole.FELLOW]}</p>
              </div>
              <BookOpen className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applicants</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.byRole[UserRole.APPLICANT]}</p>
              </div>
              <Users className="text-purple-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Content>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users by name, email, or department..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full input"
                  >
                    <option value="all">All Roles</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.PRECEPTOR}>Preceptor</option>
                    <option value={UserRole.FELLOW}>Fellow</option>
                    <option value={UserRole.APPLICANT}>Applicant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full input"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full input"
                  >
                    <option value="all">All Departments</option>
                    {mockDepartments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full input"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                    <option value="status">Status</option>
                    <option value="lastLogin">Last Login</option>
                    <option value="registrationDate">Registration Date</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-primary-200 bg-primary-50">
          <Card.Content>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-primary-900">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                <Button size="sm" variant="outline" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction({ type: 'activate', userIds: selectedUsers })}
                  disabled={isLoading}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction({ type: 'deactivate', userIds: selectedUsers })}
                  disabled={isLoading}
                >
                  <XCircle size={14} className="mr-1" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction({ type: 'suspend', userIds: selectedUsers })}
                  disabled={isLoading}
                >
                  <Ban size={14} className="mr-1" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction({ type: 'promoteToFellow', userIds: selectedUsers })}
                  disabled={isLoading}
                >
                  <BookOpen size={14} className="mr-1" />
                  Promote to Fellow
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction({ type: 'sendEmail', userIds: selectedUsers })}
                  disabled={isLoading}
                >
                  <Mail size={14} className="mr-1" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{user.department || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {formatLastActivity(user.lastLogin)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetails(true);
                          }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            console.log('🔑 Key button clicked for user:', user.id, user.email);
                            setPasswordResetUserId(user.id);
                            setShowPasswordResetModal(true);
                            console.log('🔑 Modal state set:', { passwordResetUserId: user.id, showPasswordResetModal: true });
                          }}
                          title="Reset Password"
                        >
                          <Key size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <AdminUserCreationForm
          onClose={() => setShowCreateUserModal(false)}
          onSave={async (userData) => {
            try {
              console.log('🔵 Creating user with data:', userData);
              
              // Create user using userService
              const newUser = await userService.createUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role === 'admin' ? UserRole.ADMIN : 
                      userData.role === 'preceptor' ? UserRole.PRECEPTOR : UserRole.FELLOW,
                department: userData.department,
                cohort: userData.cohort,
                isActive: true, // New users are active by default
              });

              console.log('✅ User created successfully:', newUser);

              // Convert to AdminUser format for the UI
              const adminUser: AdminUser = {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                permissions: [],
                isActive: newUser.isActive,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                profileData: {
                  department: userData.department,
                  cohort: userData.cohort,
                },
                status: newUser.isActive ? 'active' : 'inactive',
                emailVerified: userData.sendEmail || false,
                loginCount: 0,
                registrationDate: newUser.createdAt,
              };
              
              setShowCreateUserModal(false);
              
              // Reload all users from the backend to ensure consistency
              await loadRealUsers();
              
              // Show success message
              addToast({
                type: 'success',
                title: 'User Created Successfully',
                message: `${userData.firstName} ${userData.lastName} has been created as ${userData.role} and is now active.`
              });
            } catch (error) {
              console.error('❌ Failed to create user:', error);
              addToast({
                type: 'error',
                title: 'Failed to Create User',
                message: error instanceof Error ? error.message : 'An error occurred while creating the user'
              });
            }
          }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="md" />
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Create User Modal Component
interface CreateUserModalProps {
  onClose: () => void;
  onUserCreated: (user: AdminUser) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.APPLICANT,
    phone: '',
    organization: '',
    position: '',
    department: '',
    isKHCCStaff: false,
    khccStaffId: '',
    researchArea: '',
    supervisor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        permissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileData: {
          phone: formData.phone,
          department: formData.department,
          position: formData.position,
        },
        status: 'active',
        emailVerified: false,
        loginCount: 0,
        lastLogin: null,
        department: formData.department,
      };

      onUserCreated(newUser);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create user. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Role and Organization */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={UserRole.APPLICANT}>Applicant</option>
                  <option value={UserRole.FELLOW}>Fellow</option>
                  <option value={UserRole.PRECEPTOR}>Preceptor</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position/Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* KHCC Staff Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">KHCC Staff Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is this user a KHCC staff member?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isKHCCStaff"
                      checked={formData.isKHCCStaff === true}
                      onChange={() => handleInputChange('isKHCCStaff', true)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isKHCCStaff"
                      checked={formData.isKHCCStaff === false}
                      onChange={() => handleInputChange('isKHCCStaff', false)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.isKHCCStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KHCC Staff ID *
                  </label>
                  <input
                    type="text"
                    required={formData.isKHCCStaff}
                    value={formData.khccStaffId}
                    onChange={(e) => handleInputChange('khccStaffId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter KHCC Staff ID"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === UserRole.FELLOW && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fellow Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Research Area
                  </label>
                  <input
                    type="text"
                    value={formData.researchArea}
                    onChange={(e) => handleInputChange('researchArea', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supervisor
                  </label>
                  <input
                    type="text"
                    value={formData.supervisor}
                    onChange={(e) => handleInputChange('supervisor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>

      {/* Password Reset Modal */}
      {console.log('🔍 Modal render check:', { showPasswordResetModal, passwordResetUserId })}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Key className="mr-2" size={20} />
                Reset User Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordResetModal(false);
                  setPasswordResetUserId(null);
                  setNewPassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {passwordResetUserId && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>User:</strong> {users.find(u => u.id === passwordResetUserId)?.firstName} {users.find(u => u.id === passwordResetUserId)?.lastName}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Email:</strong> {users.find(u => u.id === passwordResetUserId)?.email}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (min 8 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <p className="mt-1 text-sm text-gray-500">
                  This will immediately update the user's password. The user will need to use this new password to log in.
                </p>
                <p className="mt-1 text-sm text-amber-600">
                  <strong>Note:</strong> In development mode, password changes are recorded but not enforced at login.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordResetModal(false);
                    setPasswordResetUserId(null);
                    setNewPassword('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordReset}
                  disabled={isLoading || newPassword.length < 8}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
