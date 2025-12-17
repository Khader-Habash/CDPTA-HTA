import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { announcementService } from '@/services/announcementService';
import { Announcement } from '@/types/announcement';

/**
 * Hook to subscribe to realtime announcement updates from Supabase
 * Falls back to polling localStorage if Supabase is not configured
 */
export const useRealtimeAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    // Set up realtime subscription if Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      const channel = supabase
        .channel('announcements_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'announcements',
          },
          (payload) => {
            console.log('Realtime announcement update:', payload);
            // Refetch announcements when any change occurs
            fetchAnnouncements();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Fallback: poll localStorage every 5 seconds
      const interval = setInterval(() => {
        fetchAnnouncements();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { announcements, loading, error, refresh };
};





