import { useEffect, useState, useCallback } from 'react';
import { realtimeService } from '@/services/realtimeService';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * Generic hook for realtime data synchronization
 * Automatically fetches data and subscribes to updates
 * Falls back to polling if Supabase is not configured
 */
export function useRealtimeData<T>(
  tableName: string,
  fetchFunction: () => Promise<T[]>,
  pollingInterval: number = 5000
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, tableName]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up realtime subscription or polling
    if (isSupabaseConfigured()) {
      console.log(`Setting up realtime subscription for ${tableName}`);
      const subscription = realtimeService.subscribe(tableName, fetchData);

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      // Fallback: poll localStorage
      console.log(`Setting up polling for ${tableName} (every ${pollingInterval}ms)`);
      const interval = setInterval(fetchData, pollingInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, tableName, pollingInterval]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh, setData };
}





