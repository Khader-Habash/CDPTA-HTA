import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, UserRole, Permission } from '@/types/auth';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  cohort?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  department?: string;
  cohort?: string;
  isActive?: boolean;
}

// LocalStorage keys
const USERS_STORAGE_KEY = 'cdpta_users';
const CURRENT_USER_KEY = 'cdpta_current_user';

// Clean users - no mock data, only real users
const cleanUsers: User[] = [
  {
    id: 'user-abeer-admin',
    email: 'abeer@gmail.com',
    firstName: 'Abeer',
    lastName: 'Admin',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-khader-preceptor',
    email: 'khader@gmail.com',
    firstName: 'Khader',
    lastName: 'Preceptor',
    role: UserRole.PRECEPTOR,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profileData: {
      fellowsAssigned: []
    }
  },
  {
    id: 'user-zaid-fellow',
    email: 'zaid@gmail.com',
    firstName: 'Zaid',
    lastName: 'Fellow',
    role: UserRole.FELLOW,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profileData: {
      cohort: '2024A',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      mentor: 'user-khader-preceptor',
    }
  },
];

// Initialize localStorage with clean users
const initializeLocalStorage = async () => {
  try {
    // Clear any existing data and set clean users
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanUsers));
    
    // Also save individual user keys for authentication
    cleanUsers.forEach(user => {
      const userWithPassword = {
        ...user,
        password: 'password123'
      };
      localStorage.setItem(`user_${user.email}`, JSON.stringify(userWithPassword));
    });
    
    // Create assignment for zaid to Khader
    try {
      const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
      await preceptorAssignmentService.createAssignment({
        preceptorId: 'user-khader-preceptor',
        fellowId: 'user-zaid-fellow',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Zaid automatically assigned to Khader upon initialization',
        department: 'Health Technology Assessment',
        cohort: '2024A',
        assignmentType: 'primary',
        workload: 'full',
      });
      
      console.log('✅ Zaid automatically assigned to Khader');
    } catch (error) {
      console.error('❌ Failed to auto-assign Zaid to Khader:', error);
    }
    
    console.log('✅ Initialized localStorage with clean users:', cleanUsers.map(u => u.email));
  } catch (error) {
    console.error('Error initializing user storage:', error);
  }
};

// Get users from localStorage
const getLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    const baseUsers = stored ? JSON.parse(stored) : cleanUsers;
    console.log('📋 Base users from localStorage:', baseUsers.length);
    
    // Also check for individual user keys created when accepting applications
    const individualUsers: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.email && userData.firstName) {
            individualUsers.push({
              id: userData.id || `user-${Date.now()}-${Math.random()}`,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName || '',
              role: userData.role || UserRole.FELLOW,
              isActive: userData.isActive || false,
              createdAt: userData.createdAt || new Date().toISOString(),
              updatedAt: userData.updatedAt || new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Failed to parse user data from key:', key, e);
        }
      }
    }
    console.log('📋 Individual users from user_ keys:', individualUsers.length);
    
    // Merge base users with individual users, avoiding duplicates
    const allUsers = [...baseUsers];
    individualUsers.forEach(indivUser => {
      if (!allUsers.find(user => user.email === indivUser.email)) {
        allUsers.push(indivUser);
        console.log('📋 Added individual user:', indivUser.email);
      } else {
        console.log('📋 Skipped duplicate user:', indivUser.email);
      }
    });
    
    console.log('📋 Total users loaded:', allUsers.length);
    return allUsers;
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return cleanUsers;
  }
};

// Save users to localStorage
const saveLocalUsers = (users: User[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

initializeLocalStorage();

export const userService = {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    // PRIMARY: Load from Supabase (REQUIRED for multi-user real-time)
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: usersData, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase getAllUsers error:', error);
          throw error; // Fail hard - we need Supabase
        }

        if (usersData) {
          // Convert to app User format
          const users: User[] = usersData.map((u: any) => ({
            id: u.id,
            email: u.email,
            firstName: u.first_name,
            lastName: u.last_name,
            role: u.role as UserRole,
            isActive: u.is_active,
            createdAt: u.created_at,
            updatedAt: u.updated_at,
            permissions: userService.getPermissionsForRole(u.role as UserRole),
            profileData: {
              department: u.department || undefined,
              cohort: u.cohort || undefined,
            }
          }));

          console.log('✅ [PRIMARY] Loaded users from Supabase:', { total: users.length });
          
          // Sync to localStorage for offline access (backup only)
          saveLocalUsers(users);
          
          return users;
        }
      } catch (supabaseError) {
        console.error('❌ Supabase getAllUsers failed:', supabaseError);
        // Only fallback if Supabase is not configured
        if (!isSupabaseConfigured()) {
          console.warn('⚠️ Supabase not configured, using localStorage fallback');
        } else {
          throw supabaseError; // Fail hard if Supabase is configured but fails
        }
      }
    }

    // FALLBACK: Only use localStorage if Supabase is not configured
    console.log('📂 [FALLBACK] Loading users from localStorage');
    const users = getLocalUsers();
    console.log('📋 Loaded users from localStorage:', { total: users.length });
    return users;
  },

  /**
   * Helper to get permissions for a role
   */
  getPermissionsForRole(role: UserRole): Permission[] {
    const permissions: Record<UserRole, Permission[]> = {
      [UserRole.APPLICANT]: [
        { resource: 'application', action: 'create' },
        { resource: 'application', action: 'update' },
        { resource: 'application', action: 'read' }
      ],
      [UserRole.FELLOW]: [
        { resource: 'courses', action: 'read' },
        { resource: 'assignments', action: 'read' },
        { resource: 'assignments', action: 'update' },
        { resource: 'modules', action: 'read' },
        { resource: 'profile', action: 'update' }
      ],
      [UserRole.PRECEPTOR]: [
        { resource: 'users', action: 'read' },
        { resource: 'fellows', action: 'read' },
        { resource: 'fellows', action: 'update' },
        { resource: 'courses', action: 'read' },
        { resource: 'courses', action: 'create' },
        { resource: 'courses', action: 'update' },
        { resource: 'assignments', action: 'read' },
        { resource: 'assignments', action: 'create' },
        { resource: 'assignments', action: 'update' }
      ],
      [UserRole.ADMIN]: [
        { resource: 'users', action: 'create' },
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'update' },
        { resource: 'users', action: 'delete' },
        { resource: 'system', action: 'read' },
        { resource: 'announcements', action: 'create' },
        { resource: 'announcements', action: 'update' },
        { resource: 'announcements', action: 'delete' }
      ]
    };

    return permissions[role] || [];
  },

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return null;

        return {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role as UserRole,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          permissions: userService.getPermissionsForRole(data.role as UserRole),
          profileData: {
            department: data.department || undefined,
            cohort: data.cohort || undefined,
          }
        };
      } catch (error) {
        console.warn('Supabase getUserById error, falling back to localStorage:', error);
      }
    }

    // LocalStorage fallback
    const users = getLocalUsers();
    return users.find(u => u.id === id) || null;
  },

  /**
   * Create a new user (admin only)
   */
  async createUser(data: CreateUserData): Promise<User> {
    // Try Supabase first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true, // Auto-confirm email for admin-created users
          user_metadata: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        });

        if (authError) {
          throw authError;
        }

        if (!authData.user) {
          throw new Error('Failed to create user in Supabase Auth');
        }

        // Create user record in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            is_active: data.isActive ?? true,
            department: data.department || null,
            cohort: data.cohort || null,
          })
          .select()
          .single();

        if (userError) {
          // Clean up auth user if user table insert fails
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (cleanupError) {
            console.error('Failed to cleanup auth user:', cleanupError);
          }
          throw userError;
        }

        // Convert to app User format
        const newUser: User = {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role as UserRole,
          isActive: userData.is_active,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
          permissions: userService.getPermissionsForRole(userData.role as UserRole),
          profileData: {
            department: userData.department || undefined,
            cohort: userData.cohort || undefined,
          }
        };

        // If creating a fellow, automatically assign to Khader (preceptor)
        if (data.role === UserRole.FELLOW) {
          try {
            const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
            
            // Get Khader's user ID from Supabase or localStorage
            const khader = await userService.getUserByEmail('khader@gmail.com');
            const preceptorId = khader?.id || 'user-khader-preceptor';
            
            await preceptorAssignmentService.createAssignment({
              preceptorId: preceptorId,
              fellowId: newUser.id,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              notes: 'Automatically assigned to Khader upon fellow creation',
              department: 'Health Technology Assessment',
              cohort: data.cohort || '2024A',
              assignmentType: 'primary',
              workload: 'full',
            });
            
            console.log('✅ Fellow automatically assigned to Khader:', {
              fellowId: newUser.id,
              fellowName: `${data.firstName} ${data.lastName}`,
              preceptorId: preceptorId
            });
          } catch (error) {
            console.error('❌ Failed to auto-assign fellow to Khader:', error);
          }
        }

        // Also save to localStorage for offline access
        const users = getLocalUsers();
        users.push(newUser);
        saveLocalUsers(users);
        localStorage.setItem(`user_${data.email}`, JSON.stringify({
          ...newUser,
          password: data.password
        }));

        console.log('✅ User created successfully in Supabase:', {
          email: data.email,
          role: data.role,
          id: newUser.id
        });

        return newUser;
      } catch (supabaseError: any) {
        console.warn('Supabase createUser failed, falling back to localStorage:', supabaseError);
        // Fall through to localStorage fallback
      }
    }

    // LocalStorage fallback
    console.log('🔵 Creating user with localStorage');
    const users = getLocalUsers();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newUser: User = {
      id: `user-${timestamp}-${randomSuffix}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: userService.getPermissionsForRole(data.role),
      profileData: data.role === UserRole.FELLOW ? {
        cohort: data.cohort || '2024A',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        mentor: 'user-khader-preceptor',
      } : {},
    };

    users.push(newUser);
    saveLocalUsers(users);
    
    // If creating a fellow, automatically assign to Khader (preceptor)
    if (data.role === UserRole.FELLOW) {
      try {
        const { preceptorAssignmentService } = await import('./preceptorAssignmentService');
        
        await preceptorAssignmentService.createAssignment({
          preceptorId: 'user-khader-preceptor',
          fellowId: newUser.id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Automatically assigned to Khader upon fellow creation',
          department: 'Health Technology Assessment',
          cohort: data.cohort || '2024A',
          assignmentType: 'primary',
          workload: 'full',
        });
        
        console.log('✅ Fellow automatically assigned to Khader:', {
          fellowId: newUser.id,
          fellowName: `${data.firstName} ${data.lastName}`,
          preceptorId: 'user-khader-preceptor'
        });
      } catch (error) {
        console.error('❌ Failed to auto-assign fellow to Khader:', error);
      }
    }
    
    // Also save user with password for authentication (authService format)
    const userWithPassword = {
      ...newUser,
      password: data.password,
    };
    localStorage.setItem(`user_${data.email}`, JSON.stringify(userWithPassword));
    
    console.log('✅ User created and saved (localStorage):', {
      email: data.email,
      role: data.role,
      storageKey: `user_${data.email}`
    });
    
    return newUser;
  },

  /**
   * Get user by email (helper method)
   */
  async getUserByEmail(email: string): Promise<User | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error) throw error;
        if (!data) return null;

        return {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role as UserRole,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          permissions: userService.getPermissionsForRole(data.role as UserRole),
          profileData: {
            department: data.department || undefined,
            cohort: data.cohort || undefined,
          }
        };
      } catch (error) {
        console.warn('Supabase getUserByEmail error:', error);
      }
    }

    // LocalStorage fallback
    const users = getLocalUsers();
    return users.find(u => u.email === email) || null;
  },

  /**
   * Update a user (admin only)
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const updateData: any = {};
        if (data.firstName) updateData.first_name = data.firstName;
        if (data.lastName) updateData.last_name = data.lastName;
        if (data.role) updateData.role = data.role;
        if (data.department !== undefined) updateData.department = data.department || null;
        if (data.cohort !== undefined) updateData.cohort = data.cohort || null;
        if (data.isActive !== undefined) updateData.is_active = data.isActive;

        const { data: userData, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        const updatedUser: User = {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role as UserRole,
          isActive: userData.is_active,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
          permissions: userService.getPermissionsForRole(userData.role as UserRole),
          profileData: {
            department: userData.department || undefined,
            cohort: userData.cohort || undefined,
          }
        };

        // Also update localStorage
        const users = getLocalUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
          users[index] = updatedUser;
          saveLocalUsers(users);
        }

        console.log('✅ User updated in Supabase:', id);
        return updatedUser;
      } catch (error) {
        console.warn('Supabase updateUser error, falling back to localStorage:', error);
      }
    }

    // LocalStorage fallback
    const users = getLocalUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updatedUser: User = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString(),
      permissions: userService.getPermissionsForRole((data.role || users[index].role)),
    };

    users[index] = updatedUser;
    saveLocalUsers(users);
    return updatedUser;
  },

  /**
   * Activate/Deactivate a user (admin only)
   */
  async toggleUserStatus(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');

    return this.updateUser(id, { isActive: !user.isActive });
  },

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        // Admin can update another user's password
        const { error } = await supabase.auth.admin.updateUserById(id, {
          password: newPassword,
        });

        if (error) throw error;
        console.log(`✅ Password reset for user ${id} in Supabase`);
        
        // Also update localStorage if exists
        const user = await userService.getUserById(id);
        if (user) {
          const userKey = `user_${user.email}`;
          const existingData = localStorage.getItem(userKey);
          if (existingData) {
            try {
              const userData = JSON.parse(existingData);
              userData.password = newPassword;
              localStorage.setItem(userKey, JSON.stringify(userData));
            } catch (e) {
              console.warn('Failed to update password in localStorage:', e);
            }
          }
        }
        
        return;
      } catch (error) {
        console.error('Supabase password reset error:', error);
        throw new Error('Failed to reset password. Please ensure Supabase is properly configured.');
      }
    }

    // For localStorage users, we can't actually store passwords, but we can simulate it
    // by updating the user record with a password reset timestamp
    const users = getLocalUsers();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex].updatedAt = new Date().toISOString();
      // Store the password reset info (in a real app, this would be hashed and stored securely)
      const userKey = `user_${users[userIndex].email}`;
      const existingUserData = JSON.parse(localStorage.getItem(userKey) || '{}');
      existingUserData.passwordResetAt = new Date().toISOString();
      existingUserData.passwordResetBy = 'admin';
      localStorage.setItem(userKey, JSON.stringify(existingUserData));
      saveLocalUsers(users);
      console.log(`✅ Password reset recorded for user ${id} (localStorage mode)`);
    } else {
      throw new Error('User not found');
    }
  },

  /**
   * Delete a user (admin only)
   */
  async deleteUser(id: string): Promise<void> {
    // Try Supabase first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        // Check if ID is a valid UUID format (Supabase uses UUIDs)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(id)) {
          console.log('🚀 Deleting user from Supabase:', id);
          
          // Delete from users table
          const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

          if (dbError) throw dbError;

          // Also delete auth user if it exists
          try {
            await supabase.auth.admin.deleteUser(id);
            console.log('✅ Auth user deleted from Supabase:', id);
          } catch (authError) {
            console.warn('Auth user deletion failed (user might not exist in auth):', authError);
          }
          
          console.log('✅ User deleted from Supabase:', id);
        } else {
          console.log('⚠️ Skipping Supabase deletion for non-UUID ID:', id);
        }
      } catch (error) {
        console.error('Supabase deletion error:', error);
        throw error;
      }
    }

    // Always delete from localStorage as well
    const users = getLocalUsers();
    const filtered = users.filter(u => u.id !== id);
    saveLocalUsers(filtered);
    
    // Also remove individual user keys created from accepted applications
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.id === id) {
            localStorage.removeItem(key);
            console.log('✅ Removed individual user key:', key);
          }
        } catch (e) {
          console.warn('Failed to parse user data from key:', key, e);
        }
      }
    }
    
    console.log('✅ User deleted from localStorage:', id);
  },

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter(u => u.role === role);
  },

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<User[]> {
    const allUsers = await this.getAllUsers();
    const lowerQuery = query.toLowerCase();
    return allUsers.filter(
      u =>
        u.email.toLowerCase().includes(lowerQuery) ||
        u.firstName.toLowerCase().includes(lowerQuery) ||
        u.lastName.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear all mock users (admin only) - for testing/cleanup
   */
  async clearAllMockUsers(): Promise<void> {
    console.log('🧹 Clearing all mock users...');
    
    // Clear localStorage users
    localStorage.removeItem('cdpta_users');
    
    // Clear individual user keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        localStorage.removeItem(key);
        console.log('✅ Removed user key:', key);
      }
    }
    
    // Reinitialize with empty mock users
    initializeLocalStorage();
    
    console.log('✅ All mock users cleared');
  },
};

export default userService;

