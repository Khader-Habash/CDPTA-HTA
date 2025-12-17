import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      // Handle connection errors gracefully
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Database types (will be expanded as we add tables)
export interface Database {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          priority: 'low' | 'medium' | 'high';
          published: boolean;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          priority?: 'low' | 'medium' | 'high';
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          priority?: 'low' | 'medium' | 'high';
          published?: boolean;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'preceptor' | 'fellow' | 'applicant';
          is_active: boolean;
          created_at: string;
          updated_at: string;
          department?: string;
          cohort?: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'preceptor' | 'fellow' | 'applicant';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          department?: string;
          cohort?: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'preceptor' | 'fellow' | 'applicant';
          is_active?: boolean;
          updated_at?: string;
          department?: string;
          cohort?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          application_id: string;
          status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
          data: any;
          submitted_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          application_id: string;
          status?: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
          data: any;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
          data?: any;
          submitted_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          modules: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          instructor_id: string;
          modules?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          modules?: any[];
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          module_id: string;
          title: string;
          description: string;
          due_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          module_id: string;
          title: string;
          description: string;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          due_date?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          module_id: string;
          title: string;
          description: string;
          questions: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          module_id: string;
          title: string;
          description: string;
          questions?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          questions?: any[];
          updated_at?: string;
        };
      };
    };
  };
}





