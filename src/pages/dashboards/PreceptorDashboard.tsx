import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PreceptorTestPanel from '@/components/PreceptorTestPanel';
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Calendar, 
  MessageCircle,
  Settings,
  TestTube,
  Activity,
  Target,
  Award
} from 'lucide-react';

const PreceptorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'testing'>('overview');

  const stats = [
    {
      title: 'Assigned Fellows',
      value: '2',
      change: '+1 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Courses',
      value: '3',
      change: '+2 this month',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Assignments',
      value: '5',
      change: '2 overdue',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Avg. Grade',
      value: '87%',
      change: '+3% this month',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'assignment_submitted',
      title: 'John Doe submitted HTA Analysis',
      time: '2 hours ago',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      id: '2',
      type: 'course_created',
      title: 'Created new course: Advanced HTA',
      time: '1 day ago',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      id: '3',
      type: 'fellow_assigned',
      title: 'New fellow assigned: Jane Smith',
      time: '3 days ago',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preceptor Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Manage your fellows and courses.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <Activity size={16} />
            Overview
          </Button>
          <Button
            variant={activeTab === 'testing' ? 'default' : 'outline'}
            onClick={() => setActiveTab('testing')}
            className="flex items-center gap-2"
          >
            <TestTube size={16} />
            Testing
          </Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`${stat.color}`} size={24} />
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <activity.icon className={`${activity.color}`} size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <BookOpen size={24} />
                    <span className="text-sm">Create Course</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <FileText size={24} />
                    <span className="text-sm">Create Assignment</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Users size={24} />
                    <span className="text-sm">Manage Fellows</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <BarChart3 size={24} />
                    <span className="text-sm">View Reports</span>
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-red-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">HTA Analysis Assignment</p>
                      <p className="text-sm text-gray-600">Due: Tomorrow</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">Urgent</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-yellow-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Course Evaluation</p>
                      <p className="text-sm text-gray-600">Due: Next Week</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">Pending</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </>
      )}

      {activeTab === 'testing' && (
        <PreceptorTestPanel />
      )}
    </div>
  );
};

export default PreceptorDashboard;




