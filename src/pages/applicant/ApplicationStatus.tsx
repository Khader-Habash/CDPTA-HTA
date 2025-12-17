import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { eventBus, EVENTS } from '@/services/eventBus';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Send, 
  Eye, 
  Mail,
  Calendar,
  XCircle,
  Bell
} from 'lucide-react';

interface ApplicationStatusData {
  id: string;
  applicationId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt?: string;
  reviewStartedAt?: string;
  decisionMadeAt?: string;
  timeline: TimelineEvent[];
  notifications: NotificationEvent[];
}

interface TimelineEvent {
  id: string;
  type: 'submitted' | 'review_started' | 'documents_verified' | 'interview_scheduled' | 'decision_made';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  isRead: boolean;
}

const ApplicationStatus: React.FC = () => {
  const { user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load application status from localStorage
  const loadApplicationStatus = () => {
    console.log('🔍 Loading application status from localStorage...');
    
    // Look for submitted applications in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('application_')) {
        try {
          const appData = JSON.parse(localStorage.getItem(key)!);
          if (appData && appData.metadata && appData.metadata.status) {
            const applicationId = key.replace('application_', '');
            
            const statusData: ApplicationStatusData = {
              id: applicationId,
              applicationId: appData.metadata.applicationId || applicationId,
              status: appData.metadata.status,
              submittedAt: appData.metadata.submittedAt,
              reviewStartedAt: appData.metadata.reviewStartedAt,
              decisionMadeAt: appData.metadata.reviewedAt,
              timeline: [
                {
                  id: '1',
                  type: 'submitted',
                  title: 'Application Submitted',
                  description: 'Your fellowship application has been successfully submitted.',
                  date: appData.metadata.submittedAt || '',
                  status: 'completed'
                },
                {
                  id: '2',
                  type: 'review_started',
                  title: 'Review Started',
                  description: 'Our admissions committee has begun reviewing your application.',
                  date: appData.metadata.reviewStartedAt || '',
                  status: appData.metadata.status === 'under_review' || appData.metadata.status === 'accepted' || appData.metadata.status === 'rejected' ? 'completed' : 'pending'
                },
                {
                  id: '3',
                  type: 'documents_verified',
                  title: 'Documents Verified',
                  description: 'All required documents have been verified and approved.',
                  date: appData.metadata.documentsVerifiedAt || '',
                  status: appData.metadata.status === 'accepted' || appData.metadata.status === 'rejected' ? 'completed' : 'pending'
                },
                {
                  id: '4',
                  type: 'interview_scheduled',
                  title: 'Interview Scheduled',
                  description: 'Interview invitation will be sent if shortlisted.',
                  date: appData.metadata.interviewScheduledAt || '',
                  status: 'pending'
                },
                {
                  id: '5',
                  type: 'decision_made',
                  title: 'Final Decision',
                  description: 'Final admission decision will be communicated.',
                  date: appData.metadata.reviewedAt || '',
                  status: appData.metadata.status === 'accepted' || appData.metadata.status === 'rejected' ? 'completed' : 'pending'
                }
              ],
              notifications: [
                {
                  id: '1',
                  title: 'Application Status Update',
                  message: `Your application status has been updated to: ${appData.metadata.status.replace('_', ' ')}`,
                  type: appData.metadata.status === 'accepted' ? 'success' : appData.metadata.status === 'rejected' ? 'error' : 'info',
                  date: appData.metadata.reviewedAt || new Date().toISOString(),
                  isRead: false
                },
                {
                  id: '2',
                  title: 'Application Received',
                  message: 'Thank you for submitting your fellowship application. You will receive updates as we review your application.',
                  type: 'success',
                  date: appData.metadata.submittedAt || '',
                  isRead: true
                }
              ]
            };
            
            console.log('📋 Found application status:', statusData);
            setApplicationStatus(statusData);
            return;
          }
        } catch (error) {
          console.error('Error parsing application data:', error);
        }
      }
    }
    
    // If no application found, set to null
    setApplicationStatus(null);
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      loadApplicationStatus();
      setLoading(false);
    };

    fetchApplicationStatus();
  }, [user]);

  // Listen for application status changes
  useEffect(() => {
    const unsubscribeApproved = eventBus.on(EVENTS.APPLICATION_APPROVED, (data) => {
      console.log('🎉 Application approved event received:', data);
      loadApplicationStatus(); // Reload status
    });

    const unsubscribeRejected = eventBus.on(EVENTS.APPLICATION_REJECTED, (data) => {
      console.log('❌ Application rejected event received:', data);
      loadApplicationStatus(); // Reload status
    });

    return () => {
      unsubscribeApproved();
      unsubscribeRejected();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'submitted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'under_review': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'accepted': return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText size={24} />;
      case 'submitted': return <Send size={24} />;
      case 'under_review': return <Eye size={24} />;
      case 'accepted': return <CheckCircle size={24} />;
      case 'rejected': return <XCircle size={24} />;
      default: return <Clock size={24} />;
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'submitted': return <Send size={20} />;
      case 'review_started': return <Eye size={20} />;
      case 'documents_verified': return <CheckCircle size={20} />;
      case 'interview_scheduled': return <Calendar size={20} />;
      case 'decision_made': return <Mail size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error': return <XCircle className="text-red-500" size={20} />;
      default: return <Bell className="text-blue-500" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Your application is still in draft mode. Please complete and submit it before the deadline.';
      case 'submitted':
        return 'Your application has been successfully submitted and is awaiting review.';
      case 'under_review':
        return 'Your application is currently being reviewed by our admissions committee. We will notify you of any updates.';
      case 'accepted':
        return 'Congratulations! Your fellowship application has been accepted. Welcome to the CDPTA program!';
      case 'rejected':
        return 'We appreciate your interest in our program. Unfortunately, we are unable to offer you a position at this time.';
      default:
        return 'Application status is being updated.';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!applicationStatus) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-600">
            Track the progress of your fellowship application.
          </p>
        </div>

        <Card>
          <Card.Content>
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Found</h3>
              <p className="text-gray-600">
                You haven't submitted an application yet. Start your fellowship application to track its progress.
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
        <p className="text-gray-600">
          Track the progress of your fellowship application.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <Card.Content>
          <div className={`flex items-center justify-between p-6 border rounded-lg ${getStatusColor(applicationStatus.status)}`}>
            <div className="flex items-center space-x-4">
              {getStatusIcon(applicationStatus.status)}
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {applicationStatus.status.replace('_', ' ')}
                </h2>
                <p className="text-sm opacity-90">
                  Application ID: {applicationStatus.applicationId}
                </p>
              </div>
            </div>
            {applicationStatus.submittedAt && (
              <div className="text-right text-sm opacity-90">
                <p>Submitted on</p>
                <p className="font-medium">{formatDate(applicationStatus.submittedAt)}</p>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Status Message hidden as requested */}
      {false && (
        <Card>
          <Card.Content>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900">
                {getStatusMessage(applicationStatus.status)}
              </p>
            </div>
          </Card.Content>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Timeline hidden as requested */}
        {false && (
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Application Timeline</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  {applicationStatus.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="relative">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          event.status === 'completed' 
                            ? 'bg-green-100 border-green-500 text-green-600'
                            : event.status === 'current'
                            ? 'bg-blue-100 border-blue-500 text-blue-600'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                          {getTimelineIcon(event.type)}
                        </div>
                        {index < applicationStatus.timeline.length - 1 && (
                          <div className={`absolute top-10 left-1/2 w-0.5 h-6 transform -translate-x-1/2 ${
                            event.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            event.status === 'completed' 
                              ? 'text-gray-900'
                              : event.status === 'current'
                              ? 'text-blue-900'
                              : 'text-gray-500'
                          }`}>
                            {event.title}
                          </h3>
                          {event.date && (
                            <span className="text-xs text-gray-500">
                              {formatDate(event.date)}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          event.status === 'completed' 
                            ? 'text-gray-600'
                            : event.status === 'current'
                            ? 'text-blue-700'
                            : 'text-gray-400'
                        }`}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Recent Notifications */}
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Recent Updates</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {applicationStatus.notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      notification.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${
                          notification.isRead ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-xs mt-1 ${
                          notification.isRead ? 'text-gray-600' : 'text-blue-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Application Summary */}
          <Card className="mt-6">
            <Card.Header>
              <h2 className="text-xl font-semibold">Application Summary</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="font-medium">{applicationStatus.applicationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    applicationStatus.status === 'accepted' ? 'text-green-600' :
                    applicationStatus.status === 'rejected' ? 'text-red-600' :
                    applicationStatus.status === 'under_review' ? 'text-purple-600' :
                    'text-blue-600'
                  }`}>
                    {applicationStatus.status.replace('_', ' ')}
                  </span>
                </div>
                {applicationStatus.submittedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">
                      {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {applicationStatus.reviewStartedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Review Started:</span>
                    <span className="font-medium">
                      {new Date(applicationStatus.reviewStartedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;

