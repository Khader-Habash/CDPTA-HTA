import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import RealtimeDemo from '@/components/RealtimeDemo';
import NewApplicantFlow from '@/components/NewApplicantFlow';
import ProfileApplicationDemo from '@/components/ProfileApplicationDemo';
import ApplicantOnlyDemo from '@/components/ApplicantOnlyDemo';
import { eventBus, EVENTS } from '@/services/eventBus';
import { useToast } from '@/components/ui/Toaster';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  Activity,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  Database,
  Bell,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [metrics, setMetrics] = useState({
    totalUsers: 1247,
    activeFellows: 89,
    totalApplications: 156,
    pendingApplications: 23
  });
  const [recentApplications, setRecentApplications] = useState<Array<{
    id: string;
    applicantName: string;
    applicantEmail: string;
    submittedAt: string;
  }>>([]);

  // Listen for new application submissions
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.APPLICATION_SUBMITTED, (data) => {
      console.log('🎯 Admin Dashboard received new application:', data);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalApplications: prev.totalApplications + 1,
        pendingApplications: prev.pendingApplications + 1
      }));

      // Add to recent applications
      setRecentApplications(prev => [
        {
          id: data.applicationId,
          applicantName: data.applicantName,
          applicantEmail: data.applicantEmail,
          submittedAt: new Date().toISOString()
        },
        ...prev.slice(0, 4) // Keep only the 5 most recent
      ]);

      // Show toast notification
      addToast({
        type: 'success',
        title: '🎉 New Application Received!',
        message: `${data.applicantName} has just submitted their application.`,
        duration: 8000
      });
    });

    return unsubscribe;
  }, [addToast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          System Administration
        </h1>
        <p className="text-gray-600">
          Monitor platform health, manage users, and oversee operations.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <Users className="text-primary-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Fellows</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeFellows}</p>
                <p className="text-sm text-blue-600">Current cohort</p>
              </div>
              <GraduationCap className="text-blue-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalApplications}</p>
                <p className="text-sm text-yellow-600">{metrics.pendingApplications} pending review</p>
              </div>
              <FileText className="text-yellow-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-sm text-green-600">Above target</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Health */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">System Health</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="text-green-600" size={24} />
                  </div>
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Database className="text-blue-600" size={24} />
                  </div>
                  <p className="text-sm font-medium">Database Health</p>
                  <p className="text-2xl font-bold text-blue-600">Good</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="text-yellow-600" size={24} />
                  </div>
                  <p className="text-sm font-medium">Security Status</p>
                  <p className="text-2xl font-bold text-yellow-600">Secure</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Recent Applications */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Link to="/admin/applications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Content>
              {recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Bell className="text-primary-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary-900">
                          New application from {application.applicantName}
                        </p>
                        <p className="text-xs text-primary-700">{application.applicantEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary-600 font-medium">Just now</p>
                        <p className="text-xs text-primary-500">Pending review</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600">No recent applications</p>
                  <p className="text-sm text-gray-500">New applications will appear here in real-time</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Recent System Activity</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration spike</p>
                    <p className="text-xs text-gray-500">45 new registrations in the last hour</p>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Database backup completed</p>
                    <p className="text-xs text-gray-500">Automated backup successful</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">High API usage detected</p>
                    <p className="text-xs text-gray-500">Rate limits approaching threshold</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Failed login attempts</p>
                    <p className="text-xs text-gray-500">5 suspicious login attempts blocked</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar - Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-600" size={20} />
                <h3 className="text-lg font-semibold">System Alerts</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Storage Usage</p>
                  <p className="text-xs text-yellow-600">Database storage at 85% capacity</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Backup Schedule</p>
                  <p className="text-xs text-blue-600">Next backup in 2 hours</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Security Scan</p>
                  <p className="text-xs text-green-600">Last scan: 2 hours ago - Clean</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <Link to="/admin/applications">
                  <Button fullWidth size="sm">
                    <FileText size={16} className="mr-2" />
                    Review Applications
                  </Button>
                </Link>
                <Link to="/admin/announcements">
                  <Button variant="outline" fullWidth size="sm">
                    <Bell size={16} className="mr-2" />
                    Manage Announcements
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" fullWidth size="sm">
                    <Users size={16} className="mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button variant="outline" fullWidth size="sm">
                    <BarChart3 size={16} className="mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" fullWidth size="sm">
                    <Settings size={16} className="mr-2" />
                    System Settings
                  </Button>
                </Link>
                <Button variant="outline" fullWidth size="sm">
                  <Database size={16} className="mr-2" />
                  Backup Data
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Performance</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk Usage</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Applicant Only Registration Demo */}
      <ApplicantOnlyDemo />

      {/* New Applicant Flow Demo */}
      <NewApplicantFlow />

      {/* Profile Application Demo */}
      <ProfileApplicationDemo />

      {/* Realtime Demo */}
      <RealtimeDemo />
    </div>
  );
};

export default AdminDashboard;
