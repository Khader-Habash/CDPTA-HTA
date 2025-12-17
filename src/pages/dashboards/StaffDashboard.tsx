import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import HTAProgramManagement from '@/components/HTAProgramManagement';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Calendar,
  MessageCircle,
  FileText,
  GraduationCap,
  Award,
  Target
} from 'lucide-react';

const PreceptorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Preceptor {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Manage fellows, courses, and track program progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
              <BookOpen className="text-primary-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Fellows</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-blue-600">Across all courses</p>
              </div>
              <Users className="text-green-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-orange-600">Assignments to grade</p>
              </div>
              <FileText className="text-orange-600" size={24} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week Events</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-purple-600">Lectures & exams</p>
              </div>
              <Calendar className="text-purple-600" size={24} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Fellow Activity */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Recent Fellow Activity</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-gray-600">Completed React Module 3</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CheckCircle className="text-green-600" size={20} />
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">AS</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Alice Smith</h3>
                      <p className="text-sm text-gray-600">Submitted ML Project Report</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <FileText className="text-blue-600" size={20} />
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">MB</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Mike Brown</h3>
                      <p className="text-sm text-gray-600">Started Product Management Course</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <BookOpen className="text-green-600" size={20} />
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">SJ</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Sarah Johnson</h3>
                      <p className="text-sm text-gray-600">Requested mentorship session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <MessageCircle className="text-yellow-600" size={20} />
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/preceptor/fellows">
                  <Button fullWidth>View All Fellows</Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tasks & Reviews */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <h3 className="text-lg font-semibold">Pending Reviews</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Project Submissions</p>
                    <p className="text-xs text-gray-500">3 submissions awaiting review</p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Urgent
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Assignment Grading</p>
                    <p className="text-xs text-gray-500">2 assignments to grade</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                    Today
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Course Content Review</p>
                    <p className="text-xs text-gray-500">1 course needs approval</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    This week
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Fellow Check-in Meeting</p>
                  <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Course Planning Session</p>
                  <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Staff Weekly Sync</p>
                  <p className="text-xs text-gray-500">Friday, 3:00 PM</p>
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
                <Link to="/preceptor/courses">
                  <Button variant="outline" fullWidth size="sm">
                    <BookOpen className="mr-2" size={16} />
                    Manage Courses
                  </Button>
                </Link>
                <Link to="/preceptor/courses">
                  <Button variant="outline" fullWidth size="sm">
                    <FileText className="mr-2" size={16} />
                    Create Assignment
                  </Button>
                </Link>
                <Link to="/preceptor/courses">
                  <Button variant="outline" fullWidth size="sm">
                    <Calendar className="mr-2" size={16} />
                    Schedule Event
                  </Button>
                </Link>
                <Link to="/preceptor/fellows">
                  <Button variant="outline" fullWidth size="sm">
                    <Users className="mr-2" size={16} />
                    View Fellow Progress
                  </Button>
                </Link>
                <Button variant="outline" fullWidth size="sm" onClick={() => window.scrollTo({ top: document.querySelector('.space-y-6')?.scrollHeight, behavior: 'smooth' })}>
                  <GraduationCap className="mr-2" size={16} />
                  HTA Program
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* HTA Program Management Section */}
      <div className="mt-8">
        <HTAProgramManagement />
      </div>
    </div>
  );
};

export default PreceptorDashboard;
