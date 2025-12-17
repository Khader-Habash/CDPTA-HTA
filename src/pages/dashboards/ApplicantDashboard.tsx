import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Upload,
  User,
  GraduationCap,
  PenTool,
  BookOpen,
  MessageCircle,
  Settings,
  Shield,
  Users,
  Award,
  Bell
} from 'lucide-react';

const ApplicantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [hasStartedApplication, setHasStartedApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    status: 'not_started' as const,
    progress: {
      personalInfo: false,
      academicBackground: false,
      documents: false,
      essay: false
    },
    applicationWindow: {
      isOpen: true,
      deadline: '2024-03-15',
      daysRemaining: 45
    },
    khccStaff: false,
    khccStaffId: null
  });

  // Check if user has started their application
  useEffect(() => {
    const savedApplication = localStorage.getItem('applicationFormData');
    if (savedApplication) {
      try {
        const parsedData = JSON.parse(savedApplication);
        setHasStartedApplication(true);
        
        // Update application data based on saved progress
        setApplicationData(prev => ({
          ...prev,
          status: parsedData.metadata?.status || 'draft',
          progress: {
            personalInfo: parsedData.personalInfo?.firstName ? true : false,
            academicBackground: parsedData.education?.institution ? true : false,
            documents: Object.values(parsedData.documents || {}).some(doc => doc !== null),
            essay: parsedData.essays?.personalStatement ? true : false,
          }
        }));
      } catch (error) {
        console.error('Error parsing saved application:', error);
      }
    }
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-purple-600 bg-purple-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <FileText size={20} />;
      case 'draft': return <PenTool size={20} />;
      case 'submitted': return <Clock size={20} />;
      case 'under_review': return <AlertCircle size={20} />;
      case 'accepted': return <CheckCircle size={20} />;
      case 'rejected': return <AlertCircle size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const calculateProgress = () => {
    const sections = Object.values(applicationData.progress);
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            CDPTA Fellowship Application Portal
          </p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationData.status)}`}>
            {getStatusIcon(applicationData.status)}
            <span className="capitalize">{applicationData.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* New Applicant Welcome */}
      {!hasStartedApplication && (
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <Card.Content className="p-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="text-primary-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to CDPTA Fellowship Program!
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Thank you for registering! You're one step closer to joining our prestigious fellowship program. 
                Let's start your application process and help you showcase your qualifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/applicant/application')}
                  className="bg-primary-600 hover:bg-primary-700"
                  size="lg"
                >
                  <FileText className="mr-2" size={20} />
                  Start Your Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/applicant/program-info')}
                  size="lg"
                >
                  <BookOpen className="mr-2" size={20} />
                  Learn About the Program
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Application Window Alert */}
      {applicationData.applicationWindow.isOpen && hasStartedApplication && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={20} />
            <div>
              <h3 className="text-blue-900 font-medium">Application Window Open</h3>
              <p className="text-blue-700 text-sm">
                Deadline: {applicationData.applicationWindow.deadline} 
                <span className="font-medium"> ({applicationData.applicationWindow.daysRemaining} days remaining)</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* My Application */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="text-primary-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">My Application</h3>
                <p className="text-sm text-gray-600">Manage your fellowship application</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Program Information */}
        <Link to="/applicant/program-info">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Program Info</h3>
                  <p className="text-sm text-gray-600">Browse curriculum & faculty</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Link>

        {/* Messages/Notifications */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg relative">
                <MessageCircle className="text-green-600" size={24} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">3 new notifications</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Settings className="text-gray-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Application Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Application Sections */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Application Sections</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              
              {/* Personal Information */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className={applicationData.progress.personalInfo ? "text-green-600" : "text-gray-400"} size={20} />
                  <div>
                    <h4 className="font-medium">Personal Information</h4>
                    <p className="text-sm text-gray-600">Basic info + KHCC staff details</p>
                  </div>
                </div>
                {applicationData.progress.personalInfo ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Clock className="text-gray-400" size={20} />
                )}
              </div>

              {/* Academic Background */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <GraduationCap className={applicationData.progress.academicBackground ? "text-green-600" : "text-gray-400"} size={20} />
                  <div>
                    <h4 className="font-medium">Academic Background</h4>
                    <p className="text-sm text-gray-600">Education history & qualifications</p>
                  </div>
                </div>
                {applicationData.progress.academicBackground ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Clock className="text-gray-400" size={20} />
                )}
              </div>

              {/* Document Uploads */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Upload className={applicationData.progress.documents ? "text-green-600" : "text-gray-400"} size={20} />
                  <div>
                    <h4 className="font-medium">Document Uploads</h4>
                    <p className="text-sm text-gray-600">CV, transcripts & certificates</p>
                  </div>
                </div>
                {applicationData.progress.documents ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Clock className="text-gray-400" size={20} />
                )}
              </div>

              {/* Essay/Statement of Purpose */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <PenTool className={applicationData.progress.essay ? "text-green-600" : "text-gray-400"} size={20} />
                  <div>
                    <h4 className="font-medium">Essay/Statement of Purpose</h4>
                    <p className="text-sm text-gray-600">Research interests & career goals</p>
                  </div>
                </div>
                {applicationData.progress.essay ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Clock className="text-gray-400" size={20} />
                )}
              </div>

              <div className="pt-4">
                <Link to="/applicant/application">
                  <Button fullWidth>
                    {applicationData.status === 'draft' ? 'Continue Application' : 'View Application'}
                  </Button>
                </Link>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Recent Activity & Status */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Application Status & Activity</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              
              {/* Current Status */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(applicationData.status)}`}>
                    {getStatusIcon(applicationData.status)}
                  </div>
                  <div>
                    <h4 className="font-medium capitalize">{applicationData.status.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">
                      {applicationData.status === 'draft' && 'Complete your application before the deadline'}
                      {applicationData.status === 'submitted' && 'Your application is under review'}
                      {applicationData.status === 'under_review' && 'Application review in progress'}
                      {applicationData.status === 'accepted' && 'Congratulations! You have been accepted'}
                      {applicationData.status === 'rejected' && 'Application was not successful this time'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Academic background completed</p>
                      <p className="text-xs text-gray-500">Today at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Personal information saved</p>
                      <p className="text-xs text-gray-500">Today at 11:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Application started</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* KHCC Staff Status */}
              {applicationData.khccStaff && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="text-purple-600" size={16} />
                    <span className="text-sm font-medium text-purple-900">KHCC Staff Member</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    Staff ID: {applicationData.khccStaffId}
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/applicant/application">
              <Button variant="outline" fullWidth className="h-auto py-3">
                <div className="text-center">
                  <FileText className="mx-auto mb-2" size={20} />
                  <span className="text-sm">Edit Application</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/applicant/status">
              <Button variant="outline" fullWidth className="h-auto py-3">
                <div className="text-center">
                  <Clock className="mx-auto mb-2" size={20} />
                  <span className="text-sm">Track Status</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/applicant/program-info">
              <Button variant="outline" fullWidth className="h-auto py-3">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-2" size={20} />
                  <span className="text-sm">Program Info</span>
                </div>
              </Button>
            </Link>
            
            <Button variant="outline" fullWidth className="h-auto py-3">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-2" size={20} />
                <span className="text-sm">Messages</span>
              </div>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ApplicantDashboard;
