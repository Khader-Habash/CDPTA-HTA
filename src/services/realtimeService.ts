import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Generic realtime subscription service for Supabase tables
 * Provides a consistent interface for subscribing to table changes
 */

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

export const realtimeService = {
  /**
   * Subscribe to changes on a specific table
   * @param tableName - The name of the table to subscribe to
   * @param callback - Function to call when data changes
   * @param event - Specific event to listen for (default: *)
   * @returns Subscription object with unsubscribe method
   */
  subscribe(
    tableName: string,
    callback: () => void,
    event: RealtimeEvent = '*'
  ): RealtimeSubscription | null {
    if (!isSupabaseConfigured() || !supabase) {
      console.log(`Realtime not configured for ${tableName}, using polling fallback`);
      return null;
    }

    const channel = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Realtime update on ${tableName}:`, payload);
          callback();
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },

  /**
   * Subscribe to multiple tables at once
   * @param tableNames - Array of table names to subscribe to
   * @param callback - Function to call when any table changes
   * @returns Array of subscription objects
   */
  subscribeMultiple(
    tableNames: string[],
    callback: () => void
  ): RealtimeSubscription[] {
    return tableNames
      .map(tableName => this.subscribe(tableName, callback))
      .filter(sub => sub !== null) as RealtimeSubscription[];
  },

  /**
   * Notify about quiz creation (mock implementation)
   * @param quizData - The quiz data that was created
   */
  notifyQuizCreated(quizData: any): void {
    console.log('Quiz created notification:', quizData);
    // In a real implementation, this would send a notification to enrolled students
    // For now, we'll just log it and store it for fellows to see
    try {
      const existingQuizzes = JSON.parse(localStorage.getItem('staff_quizzes') || '[]');
      existingQuizzes.push(quizData);
      localStorage.setItem('staff_quizzes', JSON.stringify(existingQuizzes));
      
      // Also store in fellow-accessible quizzes
      const fellowQuizzes = JSON.parse(localStorage.getItem('fellow_quizzes') || '[]');
      fellowQuizzes.push({
        ...quizData,
        status: 'published',
        availableToFellows: true,
      });
      localStorage.setItem('fellow_quizzes', JSON.stringify(fellowQuizzes));
      
      console.log('Quiz stored for fellows to access');
    } catch (error) {
      console.error('Error storing quiz for fellows:', error);
    }
  },

  /**
   * Notify about assignment creation (mock implementation)
   * @param assignmentData - The assignment data that was created
   */
  notifyAssignmentCreated(assignmentData: any): void {
    console.log('Assignment created notification:', assignmentData);
    // Store assignment for fellows to see
    try {
      const existingAssignments = JSON.parse(localStorage.getItem('staff_assignments') || '[]');
      existingAssignments.push(assignmentData);
      localStorage.setItem('staff_assignments', JSON.stringify(existingAssignments));
      
      // Also store in fellow-accessible assignments
      const fellowAssignments = JSON.parse(localStorage.getItem('fellow_assignments') || '[]');
      fellowAssignments.push({
        ...assignmentData,
        status: 'published',
        availableToFellows: true,
      });
      localStorage.setItem('fellow_assignments', JSON.stringify(fellowAssignments));
      
      console.log('Assignment stored for fellows to access');
    } catch (error) {
      console.error('Error storing assignment for fellows:', error);
    }
  },

  /**
   * Notify about course creation (mock implementation)
   * @param courseData - The course data that was created
   */
  notifyCourseCreated(courseData: any): void {
    console.log('Course created notification:', courseData);
    try {
      // Store course for staff/preceptors
      const existingCourses = JSON.parse(localStorage.getItem('staff_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('staff_courses', JSON.stringify(existingCourses));
      
      // Also store in fellow-accessible courses
      const fellowCourses = JSON.parse(localStorage.getItem('fellow_courses') || '[]');
      fellowCourses.push({
        ...courseData,
        status: 'open', // Make it available to fellows
        availableToFellows: true,
      });
      localStorage.setItem('fellow_courses', JSON.stringify(fellowCourses));
      
      console.log('Course stored for fellows to access');
    } catch (error) {
      console.error('Error storing course for fellows:', error);
    }
  }
};

export default realtimeService;
