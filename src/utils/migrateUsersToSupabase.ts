/**
 * Migration Utility: Move localStorage users to Supabase
 * 
 * This utility helps migrate existing users from localStorage to Supabase
 * Run this once after setting up Supabase to transfer all existing users
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserRole } from '@/types/auth';

interface LocalStorageUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  profileData?: any;
}

/**
 * Migrate all users from localStorage to Supabase
 * @returns Migration report with success/failure counts
 */
export async function migrateUsersToSupabase(): Promise<{
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{ email: string; error: string }>;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables first.');
  }

  const result = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  // Collect all users from localStorage
  const allUsers: LocalStorageUser[] = [];

  // 1. Get users from registeredUsers
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    allUsers.push(...registeredUsers);
  } catch (error) {
    console.error('Error reading registeredUsers:', error);
  }

  // 2. Get users from cdpta_users
  try {
    const cdptaUsers = JSON.parse(localStorage.getItem('cdpta_users') || '[]');
    allUsers.push(...cdptaUsers);
  } catch (error) {
    console.error('Error reading cdpta_users:', error);
  }

  // 3. Get users from individual user_ keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('user_') && !key.includes('update_')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.email && userData.firstName) {
          // Check if already added (avoid duplicates)
          if (!allUsers.find(u => u.email === userData.email)) {
            allUsers.push(userData);
          }
        }
      } catch (error) {
        console.warn(`Error parsing user data from key ${key}:`, error);
      }
    }
  }

  console.log(`📦 Found ${allUsers.length} users to migrate`);

  // Migrate each user
  for (const user of allUsers) {
    try {
      // Check if user already exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existingUser) {
        console.log(`⏭️  Skipping ${user.email} - already exists in Supabase`);
        result.skipped++;
        continue;
      }

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password || 'password123', // Default password if not provided
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
        }
      });

      if (authError) {
        throw new Error(`Auth creation failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Failed to create auth user');
      }

      // Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          is_active: user.isActive ?? true,
          department: user.profileData?.department || null,
          cohort: user.profileData?.cohort || null,
          created_at: user.createdAt || new Date().toISOString(),
          updated_at: user.updatedAt || new Date().toISOString(),
        });

      if (userError) {
        // Clean up auth user if user table insert fails
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        throw new Error(`User table insert failed: ${userError.message}`);
      }

      console.log(`✅ Migrated user: ${user.email}`);
      result.success++;
    } catch (error: any) {
      console.error(`❌ Failed to migrate ${user.email}:`, error);
      result.failed++;
      result.errors.push({
        email: user.email,
        error: error.message || 'Unknown error',
      });
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Success: ${result.success}`);
  console.log(`⏭️  Skipped: ${result.skipped}`);
  console.log(`❌ Failed: ${result.failed}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(({ email, error }) => {
      console.log(`  - ${email}: ${error}`);
    });
  }

  return result;
}

/**
 * Check if migration is needed (compare localStorage users with Supabase)
 */
export async function checkMigrationNeeded(): Promise<{
  needed: boolean;
  localStorageCount: number;
  supabaseCount: number;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      needed: false,
      localStorageCount: 0,
      supabaseCount: 0,
    };
  }

  // Count localStorage users
  let localStorageCount = 0;
  const emails = new Set<string>();

  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.forEach((u: any) => emails.add(u.email));
    localStorageCount += registeredUsers.length;
  } catch (error) {
    console.error('Error reading registeredUsers:', error);
  }

  try {
    const cdptaUsers = JSON.parse(localStorage.getItem('cdpta_users') || '[]');
    cdptaUsers.forEach((u: any) => emails.add(u.email));
    localStorageCount += cdptaUsers.length;
  } catch (error) {
    console.error('Error reading cdpta_users:', error);
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('user_') && !key.includes('update_')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.email && !emails.has(userData.email)) {
          emails.add(userData.email);
          localStorageCount++;
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
  }

  // Count Supabase users
  let supabaseCount = 0;
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    supabaseCount = count || 0;
  } catch (error) {
    console.error('Error counting Supabase users:', error);
  }

  return {
    needed: localStorageCount > supabaseCount,
    localStorageCount: emails.size, // Unique emails
    supabaseCount,
  };
}




