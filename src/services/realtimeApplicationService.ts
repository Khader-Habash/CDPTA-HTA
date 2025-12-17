import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ApplicationFormData } from '@/types/application';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ApplicationWithUser {
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

/**
 * Real-time service for applications
 * Provides real-time subscriptions for cross-user interactions
 */
export const realtimeApplicationService = {
  /**
   * Subscribe to application changes in real-time
   * @param callback - Function called when applications change
   * @returns Subscription object with unsubscribe method
   */
  subscribeToApplications(
    callback: (applications: ApplicationWithUser[]) => void
  ): { unsubscribe: () => void } | null {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('⚠️ Supabase not configured, real-time subscriptions unavailable');
      return null;
    }

    // Fetch initial data
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (error) throw error;

        const applications: ApplicationWithUser[] = (data || []).map(item => ({
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

        callback(applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    // Initial fetch
    fetchApplications();

    // Set up real-time subscription
    const channel = supabase
      .channel('applications_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'applications',
        },
        (payload) => {
          console.log('🔄 Real-time application update:', payload.eventType);
          // Refetch applications when any change occurs
          fetchApplications();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to real-time application updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
        }
      });

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
        console.log('🔌 Unsubscribed from real-time application updates');
      },
    };
  },

  /**
   * Subscribe to specific application changes
   * @param applicationId - ID of application to watch
   * @param callback - Function called when application changes
   */
  subscribeToApplication(
    applicationId: string,
    callback: (application: ApplicationWithUser | null) => void
  ): { unsubscribe: () => void } | null {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    const fetchApplication = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('application_id', applicationId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            callback(null); // Not found
          } else {
            throw error;
          }
          return;
        }

        const application: ApplicationWithUser = {
          id: data.id,
          applicantId: data.user_id || 'unknown',
          applicantName: data.data.personalInfo.firstName + ' ' + data.data.personalInfo.lastName,
          applicantEmail: data.data.personalInfo.email,
          submittedAt: data.submitted_at,
          personalInfo: data.data.personalInfo,
          education: data.data.education,
          documents: data.data.documents,
          metadata: { ...data.data.metadata, status: data.status },
        };

        callback(application);
      } catch (error) {
        console.error('Error fetching application:', error);
        callback(null);
      }
    };

    fetchApplication();

    const channel = supabase
      .channel(`application_${applicationId}_realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `application_id=eq.${applicationId}`,
        },
        () => {
          fetchApplication();
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};



