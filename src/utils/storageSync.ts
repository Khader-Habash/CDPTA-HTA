/**
 * Cross-tab/device synchronization utility for localStorage
 * Broadcasts changes to all open tabs and triggers re-renders
 */

export const STORAGE_EVENTS = {
  ANNOUNCEMENT_CHANGED: 'cdpta_announcement_changed',
  APPLICATION_CHANGED: 'cdpta_application_changed',
  USER_CHANGED: 'cdpta_user_changed',
  COURSE_CHANGED: 'cdpta_course_changed',
} as const;

/**
 * Broadcast a storage change event to all tabs
 * This triggers the 'storage' event in other tabs
 */
export const broadcastStorageChange = (key: string, value: any) => {
  // Update localStorage (this automatically triggers 'storage' event in OTHER tabs)
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  
  // NOTE: We do NOT dispatch events for same-tab to prevent infinite loops
  // The component that saves data should handle its own state update
};

/**
 * Listen for storage changes from other tabs
 * Callback receives { key, newValue, oldValue }
 * NOTE: 'storage' event only fires in OTHER tabs, not the one that made the change
 */
export const onStorageChange = (callback: (event: StorageEvent) => void) => {
  // Listen for changes from other tabs (browser handles this automatically)
  window.addEventListener('storage', callback);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', callback);
  };
};

/**
 * Hook-friendly storage listener
 */
export const useStorageSync = (keys: string[], onUpdate: () => void) => {
  if (typeof window === 'undefined') return;
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key && keys.includes(e.key)) {
      console.log(`Storage sync: ${e.key} changed, triggering update`);
      onUpdate();
    }
  };
  
  return onStorageChange(handleStorageChange);
};

