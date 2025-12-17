import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toaster';
import { notificationService } from '@/services/notificationService';
import { eventBus, EVENTS } from '@/services/eventBus';
import { onStorageChange } from '@/utils/storageSync';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  NotificationType, 
  NotificationPriority, 
  NotificationChannel,
  NotificationStatus,
  EmailTemplateVariables 
} from '@/types/notification';
import { ApplicationFormData } from '@/types/application';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
  Filter
} from 'lucide-react';

interface ApplicationWithUser {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  submittedAt: string;
  personalInfo: ApplicationFormData['personalInfo'];
  education: ApplicationFormData['education'];
  documents: ApplicationFormData['documents'];
  metadata: ApplicationFormData['metadata'];
}

const ApplicationReview: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to refresh applications - SUPABASE PRIMARY, localStorage fallback only
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    let fetchedApplications: ApplicationWithUser[] = [];

    // PRIMARY: Load from Supabase (REQUIRED for multi-user real-time)
    if (isSupabaseConfigured() && supabase) {
        console.log('🚀 [PRIMARY] Fetching applications from Supabase...');
        try {
          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .order('submitted_at', { ascending: false });

          if (error) {
            console.error('❌ Supabase error:', error);
            // Check if it's a CORS/network error vs RLS/auth error
            const errorMessage = error.message || String(error);
            if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
              console.warn('⚠️ CORS/Network error detected - this is usually an RLS or connection issue');
              console.warn('💡 Tip: Disable RLS temporarily in Supabase to test: ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;');
            } else if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
              console.warn('⚠️ Permission/RLS error detected');
              console.warn('💡 Tip: Fix RLS policies or temporarily disable: ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;');
            }
            // Don't throw - allow fallback to localStorage
          } else if (data) {
            fetchedApplications = data.map(item => ({
              id: item.id,
              applicantId: item.user_id || 'unknown',
              applicantName: item.data.personalInfo.firstName + ' ' + item.data.personalInfo.lastName,
              applicantEmail: item.data.personalInfo.email,
              submittedAt: item.submitted_at,
              personalInfo: item.data.personalInfo,
              education: item.data.education,
              documents: item.data.documents,
              metadata: { ...item.data.metadata, status: item.status },
            }));
            console.log(`✅ [PRIMARY] Loaded ${fetchedApplications.length} applications from Supabase`);
          }
        } catch (supabaseError: any) {
          console.error('❌ Supabase fetch failed:', supabaseError);
          const errorMessage = supabaseError?.message || String(supabaseError);
          if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
            console.warn('⚠️ CORS/Network error - likely RLS or connection issue. See FIX_CORS_ERRORS.md for solutions.');
          }
          // Fall through to localStorage fallback
        }
      }
      
      // FALLBACK: Only use localStorage if Supabase is not configured
      if (!isSupabaseConfigured() || fetchedApplications.length === 0) {
        console.log('📂 [FALLBACK] Loading applications from localStorage');
        const submittedApps = JSON.parse(localStorage.getItem('cdpta_submitted_applications') || '[]');
        
        fetchedApplications = submittedApps
          .filter((app: any) => {
            const hasRequiredFields = app && app.personalInfo && app.metadata;
            const isSubmitted = app.metadata?.status === 'submitted';
            return hasRequiredFields && isSubmitted;
          })
          .map((app: any) => ({
            id: app.id || app.metadata?.applicationId,
            applicantId: app.applicantId || 'unknown',
            applicantName: (app.personalInfo?.firstName || '') + ' ' + (app.personalInfo?.lastName || ''),
            applicantEmail: app.personalInfo?.email || '',
            submittedAt: app.submittedAt || app.metadata?.submittedAt || app.metadata?.submissionDate,
            personalInfo: app.personalInfo,
            education: app.education || {},
            documents: app.documents || {},
            metadata: {
              ...app.metadata,
              status: app.metadata?.status || 'submitted',
            },
          }));
        console.log(`✅ [FALLBACK] Loaded ${fetchedApplications.length} applications from localStorage`);
      }

    setApplications(fetchedApplications);
    setLoading(false);
  }, []);

  // Listen for new applications
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.APPLICATION_SUBMITTED, async (data) => {
      console.log('📧 Admin received application submission:', data);
      console.log('📧 Application ID:', data.applicationId);
      console.log('📧 Applicant Name:', data.applicantName);
      console.log('📧 Application Data:', data.applicationData);
      
      // Refresh applications from localStorage to get the latest data
      await fetchApplications();

      // Show toast notification
      addToast({
        title: '🎉 New Application Received!',
        message: `${data.applicantName} has just submitted their application.`,
        type: 'success',
      });

      // Create notification for admin users
      try {
        await notificationService.mockCreateNotification({
          userId: 'admin', // This would be dynamic in a real app
          type: NotificationType.APPLICATION_SUBMITTED,
          title: 'New Application Received',
          message: `${data.applicantName} has submitted their fellowship application and is awaiting review.`,
          priority: NotificationPriority.HIGH,
          channels: [NotificationChannel.IN_APP],
          actionUrl: '/admin/applications',
          actionText: 'Review Application',
          relatedEntityId: data.applicationId,
          relatedEntityType: 'application',
          metadata: {
            applicationId: data.applicationId,
            applicantName: data.applicantName,
            applicantEmail: data.applicantEmail,
            submittedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error creating notification:', error);
        // Don't fail the whole process for notification errors
      }
    });

    return unsubscribe;
  }, [addToast]);

  // Test function to manually trigger an application event
  const testApplicationSubmission = () => {
    console.log('🧪 Testing application submission...');
    eventBus.emit(EVENTS.APPLICATION_SUBMITTED, {
      applicationId: 'test-app-' + Date.now(),
      applicantName: 'Test Applicant',
      applicantEmail: 'test@example.com',
      applicationData: {
        personalInfo: {
          firstName: 'Test',
          lastName: 'Applicant',
          email: 'test@example.com',
          phone: '+1-555-0123',
          isKHCCStaff: false,
          khccStaffId: '',
          title: 'Mr.',
          dateOfBirth: '1990-01-01',
          gender: 'unknown',
          nationality: 'Test',
          countryOfResidence: 'Test',
          alternativeEmail: '',
        },
        education: {
          currentLevel: 'Bachelor',
          institution: 'Test University',
          fieldOfStudy: 'Computer Science',
          graduationDate: '2024-01-01',
          gpa: '3.5',
          transcriptUploaded: true,
          previousEducation: [],
        },
        documents: {
          cv: { id: 'cv-1', name: 'test-cv.pdf', status: 'uploaded' },
          transcript: { id: 'transcript-1', name: 'test-transcript.pdf', status: 'uploaded' },
          personalStatement: null,
          motivationLetter: null,
          passport: null,
          englishProficiency: null,
          additionalDocuments: [],
        },
        metadata: {
          currentStep: 4,
          totalSteps: 4,
          completedSteps: [1, 2, 3, 4],
          lastSaved: new Date().toISOString(),
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        }
      },
      submissionResponse: {
        success: true,
        applicationId: 'test-app-' + Date.now(),
        message: 'Test application submitted',
        submittedAt: new Date().toISOString(),
      }
    });
    console.log('🧪 Test event emitted');
  };

  // Load applications on mount and set up REAL-TIME subscriptions
  useEffect(() => {
    fetchApplications();
    
    // REAL-TIME: Subscribe to Supabase changes for instant multi-user updates
    if (isSupabaseConfigured() && supabase) {
      console.log('🔄 Setting up real-time subscription for applications...');
      
      let channel: any = null;
      let subscriptionTimeout: NodeJS.Timeout;
      
      try {
        channel = supabase
          .channel('applications_realtime', {
            config: {
              broadcast: { self: true }
            }
          })
          .on(
            'postgres_changes',
            {
              event: '*', // INSERT, UPDATE, DELETE
              schema: 'public',
              table: 'applications',
            },
            (payload) => {
              console.log('🔄 Real-time application update:', payload.eventType);
              // Refresh applications when any change occurs
              fetchApplications();
              
              // Show toast notification
              if (addToast) {
                addToast({
                  type: 'info',
                  title: 'Application Updated',
                  message: `Application ${payload.eventType === 'INSERT' ? 'submitted' : 'updated'} in real-time`,
                  duration: 3000,
                });
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('✅ Real-time subscription active - multi-user sync enabled!');
              clearTimeout(subscriptionTimeout);
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('⚠️ Real-time subscription error - will use polling fallback');
              clearTimeout(subscriptionTimeout);
              // Fall through to polling fallback
            } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
              console.warn('⚠️ Real-time connection timed out - will use polling fallback');
              clearTimeout(subscriptionTimeout);
              // Fall through to polling fallback
            }
          });

        // Set timeout - if not subscribed within 5 seconds, use polling
        subscriptionTimeout = setTimeout(() => {
          if (channel) {
            console.warn('⚠️ Real-time subscription timeout - using polling fallback');
            supabase.removeChannel(channel);
          }
        }, 5000);
      } catch (error) {
        console.warn('⚠️ Real-time setup failed, using polling fallback:', error);
        channel = null;
      }

      // If channel was created, return cleanup function
      if (channel) {
        return () => {
          clearTimeout(subscriptionTimeout);
          if (channel) {
            supabase.removeChannel(channel);
            console.log('🔌 Unsubscribed from real-time updates');
          }
        };
      }
      // Fall through to polling if real-time setup failed
    }

    // FALLBACK: Polling for updates (works when real-time unavailable)
    {
      // FALLBACK: Polling for updates (works when real-time unavailable)
      console.log('📡 Using polling for updates (real-time unavailable)');
      
      // Poll every 5 seconds for updates (more responsive than 10s)
      const interval = setInterval(() => {
        fetchApplications();
      }, 5000);
      
      // Also listen for localStorage changes (same browser tabs)
      const cleanup = onStorageChange((e) => {
        if (e.key === 'cdpta_submitted_applications' || e.key?.startsWith('application_')) {
          console.log('🔔 New application detected from another tab, reloading...');
          fetchApplications();
        }
      });
      
      return () => {
        clearInterval(interval);
        cleanup();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleAcceptApplication = async (application: ApplicationWithUser) => {
    setProcessingId(application.id);
    try {
      // Try to update in Supabase first
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error } = await supabase
            .from('applications')
            .update({ status: 'accepted' })
            .eq('application_id', application.metadata.applicationId);
          if (error) console.warn('⚠️ Supabase status update failed:', error.message || error);
        } catch (e) {
          console.warn('⚠️ Supabase exception while updating status:', e);
        }

        // Ensure the applicant exists in public.users so admin can activate
        try {
          console.log('🚀 Creating user record for accepted applicant:', application.applicantEmail);
          const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert({
              email: application.applicantEmail,
              first_name: application.personalInfo.firstName || 'Applicant',
              last_name: application.personalInfo.lastName || '',
              role: 'fellow',
                is_active: true, // automatically activate new fellows
              department: null,
              cohort: null,
            }, { onConflict: 'email' })
            .select()
            .single();
          
          if (userError) {
            console.error('❌ Supabase user upsert failed:', userError);
            // Try to create a new user record with a different approach
            const { data: insertData, error: insertError } = await supabase
              .from('users')
              .insert({
                email: application.applicantEmail,
                first_name: application.personalInfo.firstName || 'Applicant',
                last_name: application.personalInfo.lastName || '',
                role: 'fellow',
                is_active: true,
                department: null,
                cohort: null,
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('❌ Supabase user insert also failed:', insertError);
            } else {
              console.log('✅ User created successfully:', insertData);
            }
          } else {
            console.log('✅ User upserted successfully:', userData);
          }
        } catch (e) {
          console.error('💥 Supabase exception while creating user:', e);
        }
      }

      // Fallback: Also save to localStorage for User Management (in case Supabase fails)
      try {
        const userKey = `user_${application.applicantEmail}`;
        const userData = {
          id: `user-${Date.now()}`,
          email: application.applicantEmail,
          firstName: application.personalInfo.firstName || 'Applicant',
          lastName: application.personalInfo.lastName || '',
          role: 'fellow',
            isActive: true, // automatically activate new fellows
          createdAt: new Date().toISOString(),
          department: null,
          cohort: null,
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
        console.log('✅ User saved to localStorage as fallback:', userData);
      } catch (e) {
        console.error('❌ Failed to save user to localStorage:', e);
      }

      // Update application status in localStorage
      const localStorageKey = `application_${application.id}`;
      const existingApp = localStorage.getItem(localStorageKey);
      if (existingApp) {
        const appData = JSON.parse(existingApp);
        appData.metadata.status = 'accepted';
        appData.metadata.reviewedAt = new Date().toISOString();
        localStorage.setItem(localStorageKey, JSON.stringify(appData));
      }

      // Update application status in state
      setApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, metadata: { ...app.metadata, status: 'accepted', reviewedAt: new Date().toISOString() } }
            : app
        )
      );

      // Send notification to applicant
      const emailVariables: EmailTemplateVariables = {
        userName: application.applicantName,
        userEmail: application.applicantEmail,
        applicationStatus: 'accepted',
        supportEmail: 'support@cdpta.org',
        loginUrl: window.location.origin + '/applicant/dashboard'
      };

      try {
        await notificationService.mockCreateNotification({
          userId: application.applicantId,
          type: NotificationType.APPLICATION_APPROVED,
          title: 'Application Accepted - Welcome to CDPTA!',
          message: `Congratulations! Your fellowship application has been accepted. Welcome to the Center for Drug Policy & Technology Assessment program.`,
          priority: NotificationPriority.HIGH,
          channels: [NotificationChannel.IN_APP],
          actionUrl: '/fellow/dashboard',
          actionText: 'Access Fellow Portal',
          relatedEntityId: application.id,
          relatedEntityType: 'application',
          metadata: {
            applicationId: application.metadata.applicationId,
            decision: 'accepted',
            decidedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error creating approval notification:', error);
        // Don't fail the whole process for notification errors
      }

      // Send email notification (mock)
      try {
        await notificationService.mockSendEmail({
          id: `email-${Date.now()}`,
          userId: application.applicantId,
          type: NotificationType.APPLICATION_APPROVED,
          title: 'Application Accepted - Welcome to CDPTA Fellowship Program',
          message: `Congratulations! Your fellowship application has been accepted. Welcome to the Center for Drug Policy & Technology Assessment program.`,
          priority: NotificationPriority.HIGH,
          status: NotificationStatus.UNREAD,
          channels: [NotificationChannel.EMAIL],
          isRead: false,
          isArchived: false,
          isDeleted: false,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending mock email:', error);
        // Don't fail the whole process for email errors
      }

      addToast({
        title: 'Application Accepted',
        message: `${application.applicantName}'s application has been accepted and they have been notified.`,
        type: 'success'
      });

      // Redirect admin to User Management to activate this user
      navigate(`/admin/users?email=${encodeURIComponent(application.applicantEmail)}&action=activate`);

      // Emit event for application status change
      eventBus.emit(EVENTS.APPLICATION_APPROVED, {
        applicationId: application.id,
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        status: 'accepted',
        reviewedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error accepting application:', error);
      addToast({
        title: 'Error',
        message: 'Failed to accept application. Please try again.',
        type: 'error'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApplication = async (application: ApplicationWithUser) => {
    setProcessingId(application.id);
    try {
      // Try to update in Supabase first
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error } = await supabase
            .from('applications')
            .update({ status: 'rejected' })
            .eq('application_id', application.metadata.applicationId);
          if (error) console.warn('⚠️ Supabase status update failed:', error.message || error);
        } catch (e) {
          console.warn('⚠️ Supabase exception while updating status:', e);
        }
      }

      // Update application status in localStorage
      const localStorageKey = `application_${application.id}`;
      const existingApp = localStorage.getItem(localStorageKey);
      if (existingApp) {
        const appData = JSON.parse(existingApp);
        appData.metadata.status = 'rejected';
        appData.metadata.reviewedAt = new Date().toISOString();
        localStorage.setItem(localStorageKey, JSON.stringify(appData));
      }

      // Update application status in state
      setApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, metadata: { ...app.metadata, status: 'rejected', reviewedAt: new Date().toISOString() } }
            : app
        )
      );

      // Send notification to applicant
      const emailVariables: EmailTemplateVariables = {
        userName: application.applicantName,
        userEmail: application.applicantEmail,
        applicationStatus: 'rejected',
        supportEmail: 'support@cdpta.org',
        loginUrl: window.location.origin + '/applicant/dashboard'
      };

      try {
        await notificationService.mockCreateNotification({
          userId: application.applicantId,
          type: NotificationType.APPLICATION_REJECTED,
          title: 'Application Status Update',
          message: `Thank you for your interest in the CDPTA Fellowship Program. After careful consideration, we are unable to offer you a position at this time.`,
          priority: NotificationPriority.MEDIUM,
          channels: [NotificationChannel.IN_APP],
          actionUrl: '/applicant/dashboard',
          actionText: 'View Dashboard',
          relatedEntityId: application.id,
          relatedEntityType: 'application',
          metadata: {
            applicationId: application.metadata.applicationId,
            decision: 'rejected',
            decidedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error creating rejection notification:', error);
        // Don't fail the whole process for notification errors
      }

      // Send email notification (mock)
      try {
        await notificationService.mockSendEmail({
          id: `email-${Date.now()}`,
          userId: application.applicantId,
          type: NotificationType.APPLICATION_REJECTED,
          title: 'CDPTA Fellowship Application Status Update',
          message: `Thank you for your interest in the CDPTA Fellowship Program. After careful consideration, we are unable to offer you a position at this time.`,
          priority: NotificationPriority.MEDIUM,
          status: NotificationStatus.UNREAD,
          channels: [NotificationChannel.EMAIL],
          isRead: false,
          isArchived: false,
          isDeleted: false,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending mock email:', error);
        // Don't fail the whole process for email errors
      }

      addToast({
        title: 'Application Rejected',
        message: `${application.applicantName}'s application has been rejected and they have been notified.`,
        type: 'success'
      });

      // Emit event for application status change
      eventBus.emit(EVENTS.APPLICATION_REJECTED, {
        applicationId: application.id,
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        status: 'rejected',
        reviewedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error rejecting application:', error);
      addToast({
        title: 'Error',
        message: 'Failed to reject application. Please try again.',
        type: 'error'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getAcceptanceEmailTemplate = () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; font-size: 32px; margin: 0;">🎉 Congratulations!</h1>
        </div>
        
        <p style="font-size: 18px; color: #374151;">Dear {{userName}},</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          We are delighted to inform you that your application for the <strong>CDPTA Fellowship Program</strong> has been <strong style="color: #059669;">accepted</strong>!
        </p>
        
        <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 30px 0;">
          <h3 style="color: #059669; margin: 0 0 10px 0;">What's Next?</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            <li>You will receive a welcome package with program details</li>
            <li>Access to the Fellow Portal will be activated within 24 hours</li>
            <li>Orientation session details will be sent separately</li>
            <li>Program coordinator will contact you within 48 hours</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="{{loginUrl}}" style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Fellow Portal</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          We are excited to have you join our community of researchers and policy makers working to advance drug policy through evidence-based research.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          If you have any questions, please don't hesitate to contact us at <a href="mailto:{{supportEmail}}" style="color: #059669;">{{supportEmail}}</a>.
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>CDPTA Fellowship Program Team</strong><br>
            Center for Drug Policy & Technology Assessment
          </p>
        </div>
      </div>
    </div>
  `;

  const getRejectionEmailTemplate = () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #374151; font-size: 28px; margin: 0;">Application Status Update</h1>
        </div>
        
        <p style="font-size: 18px; color: #374151;">Dear {{userName}},</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          Thank you for your interest in the <strong>CDPTA Fellowship Program</strong> and for taking the time to submit your application.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          After careful consideration of all applications, we regret to inform you that we are unable to offer you a position in this year's fellowship cohort.
        </p>
        
        <div style="background: #fef3f2; border-left: 4px solid #f87171; padding: 20px; margin: 30px 0;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">Please Note</h3>
          <p style="color: #374151; margin: 0; line-height: 1.5;">
            This decision does not reflect on your qualifications or potential. We received an exceptional pool of applications this year, making our selection process highly competitive.
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          We encourage you to:
        </p>
        
        <ul style="color: #374151; margin: 20px 0; padding-left: 20px;">
          <li>Consider applying for future fellowship opportunities</li>
          <li>Stay connected with our research community</li>
          <li>Explore our public resources and publications</li>
          <li>Attend our webinars and public events</li>
        </ul>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="{{loginUrl}}" style="background-color: #6b7280; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit Your Dashboard</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          Thank you again for your interest in advancing drug policy research. We wish you all the best in your future endeavors.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          If you have any questions, please feel free to contact us at <a href="mailto:{{supportEmail}}" style="color: #2563eb;">{{supportEmail}}</a>.
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px;">
            Sincerely,<br>
            <strong>CDPTA Fellowship Program Team</strong><br>
            Center for Drug Policy & Technology Assessment
          </p>
        </div>
      </div>
    </div>
  `;

  const getStatusBadge = (status: string) => {
    const styles = {
      submitted: 'bg-primary-100 text-primary-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      submitted: <Clock size={14} />,
      under_review: <Eye size={14} />,
      accepted: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.metadata.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.metadata.applicationId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <p className="text-gray-600">
            Review and manage fellowship applications submitted by candidates.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchApplications}
            className="flex items-center space-x-2"
          >
            <span>🔄 Refresh</span>
          </Button>
          <Button
            variant="outline"
            onClick={testApplicationSubmission}
            className="flex items-center space-x-2"
          >
            <span>🧪 Test Application</span>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <Card.Content>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <Card.Content>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="text-primary-600" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.applicantName}
                        </h3>
                        {getStatusBadge(application.metadata.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          <span>{application.applicantEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span>{application.personalInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Submitted: {formatDate(application.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} />
                          <span>{application.education.currentLevel} - {application.education.fieldOfStudy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>ID: {application.metadata.applicationId}</span>
                        </div>
                        {application.personalInfo.isKHCCStaff && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                              KHCC Staff: {application.personalInfo.khccStaffId}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Documents Summary */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Documents:</span>
                        {application.documents.cv && (
                          <span className="text-green-600">✓ CV</span>
                        )}
                        {application.documents.transcript && (
                          <span className="text-green-600">✓ Transcript</span>
                        )}
                        {application.documents.personalStatement && (
                          <span className="text-green-600">✓ Personal Statement</span>
                        )}
                        {application.documents.passport && (
                          <span className="text-green-600">✓ Passport</span>
                        )}
                        {application.documents.motivationLetter && (
                          <span className="text-green-600">✓ Motivation Letter</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Eye size={16} className="mr-1" />
                    View Details
                  </Button>
                  
                  {application.metadata.status === 'submitted' || application.metadata.status === 'under_review' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleAcceptApplication(application)}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <CheckCircle size={16} className="mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleRejectApplication(application)}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <XCircle size={16} className="mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 px-3 py-2">
                      {application.metadata.status === 'accepted' ? 'Application Accepted' : 'Application Rejected'}
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No applications match your current filters.' 
                    : 'No applications have been submitted yet.'}
                </p>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Application Details - {selectedApplication.applicantName}
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}</div>
                  <div><strong>Email:</strong> {selectedApplication.personalInfo.email}</div>
                  <div><strong>Phone:</strong> {selectedApplication.personalInfo.phone}</div>
                  <div><strong>Date of Birth:</strong> {selectedApplication.personalInfo.dateOfBirth}</div>
                  <div><strong>Gender:</strong> {selectedApplication.personalInfo.gender}</div>
                  <div><strong>Nationality:</strong> {selectedApplication.personalInfo.nationality}</div>
                  <div><strong>Country of Residence:</strong> {selectedApplication.personalInfo.countryOfResidence}</div>
                  {selectedApplication.personalInfo.isKHCCStaff && (
                    <div><strong>KHCC Staff ID:</strong> {selectedApplication.personalInfo.khccStaffId}</div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Current Level:</strong> {selectedApplication.education.currentLevel}</div>
                  <div><strong>Institution:</strong> {selectedApplication.education.institution}</div>
                  <div><strong>Field of Study:</strong> {selectedApplication.education.fieldOfStudy}</div>
                  <div><strong>Graduation Date:</strong> {selectedApplication.education.graduationDate}</div>
                  <div><strong>GPA:</strong> {selectedApplication.education.gpa}</div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedApplication.documents).map(([key, doc]) => {
                    if (!doc || Array.isArray(doc)) return null;
                    return (
                      <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-500">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.status}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Metadata */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Application Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Application ID:</strong> {selectedApplication.metadata.applicationId}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedApplication.metadata.status)}</div>
                  <div><strong>Submitted:</strong> {formatDate(selectedApplication.submittedAt)}</div>
                  <div><strong>Last Updated:</strong> {formatDate(selectedApplication.metadata.lastSaved)}</div>
                  <div><strong>Progress:</strong> {selectedApplication.metadata.completedSteps.length}/{selectedApplication.metadata.totalSteps} steps completed</div>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            {(selectedApplication.metadata.status === 'submitted' || selectedApplication.metadata.status === 'under_review') && (
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleRejectApplication(selectedApplication);
                    setSelectedApplication(null);
                  }}
                  disabled={processingId === selectedApplication.id}
                >
                  {processingId === selectedApplication.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <XCircle size={16} className="mr-2" />
                      Reject Application
                    </>
                  )}
                </Button>
                
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleAcceptApplication(selectedApplication);
                    setSelectedApplication(null);
                  }}
                  disabled={processingId === selectedApplication.id}
                >
                  {processingId === selectedApplication.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Accept Application
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
