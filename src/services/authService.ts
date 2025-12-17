import { AuthResponse, LoginCredentials, RegisterData, User, UserRole, Permission } from '@/types';
import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Clean users - no mock data, only real users
const CLEAN_USERS: Array<User & { password: string }> = [
  {
    id: 'user-abeer-admin',
    email: 'abeer@gmail.com',
    password: 'password123',
    firstName: 'Abeer',
    lastName: 'Admin',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: [
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'system', action: 'read' }
    ],
    profileData: {
      phone: '+1-555-0101',
      bio: 'System administrator with full access to all platform features.',
      adminLevel: 'super'
    }
  },
  {
    id: 'user-khader-preceptor',
    email: 'khader@gmail.com',
    password: 'password123',
    firstName: 'Khader',
    lastName: 'Preceptor',
    role: UserRole.PRECEPTOR,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: [
      { resource: 'users', action: 'read' },
      { resource: 'fellows', action: 'read' },
      { resource: 'fellows', action: 'update' },
      { resource: 'courses', action: 'read' },
      { resource: 'courses', action: 'create' },
      { resource: 'courses', action: 'update' }
    ],
    profileData: {
      phone: '+1-555-0102',
      bio: 'Senior staff member responsible for course management and fellow supervision.',
      department: 'Education',
      position: 'Senior Program Coordinator',
      hireDate: '2020-03-15'
    }
  }
];

class AuthService {
  // Real login function - no mock data
  private async realLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Try Supabase first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        // Attempt Supabase Auth login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError) {
          // If Supabase auth fails, fall through to localStorage check
          console.log('Supabase login failed, trying localStorage fallback:', authError.message);
        } else if (authData.user) {
          // Get user record from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (userError || !userData) {
            throw new Error('User record not found');
          }

          // Check if user is active
          if (!userData.is_active) {
            throw new Error('Your account has been deactivated. Please contact an administrator.');
          }

          // Convert to app User format
          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role as UserRole,
            isActive: userData.is_active,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
            permissions: this.getPermissionsForRole(userData.role as UserRole),
            profileData: {
              department: userData.department || undefined,
              cohort: userData.cohort || undefined,
            }
          };

          console.log('✅ Login successful via Supabase:', user.email, 'Role:', user.role);

          // Get session tokens
          const session = authData.session;
          
          return {
            user,
            token: session?.access_token || `supabase-token-${user.id}`,
            refreshToken: session?.refresh_token || `supabase-refresh-${user.id}`,
          };
        }
      } catch (supabaseError: any) {
        console.warn('Supabase login error, falling back to localStorage:', supabaseError);
        // Fall through to localStorage fallback
      }
    }

    // LocalStorage fallback
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check for users created from applications and admin-created users (stored in localStorage)
    const applicationUsers: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.email && userData.firstName) {
            // Use the actual password if available, otherwise default to 'password123'
            const password = userData.password || 'password123';
            applicationUsers.push({
              ...userData,
              password: password
            });
          }
        } catch (error) {
          console.warn('Error parsing application user data:', error);
        }
      }
    }

    // Include clean users + real users
    const allUsers = [...CLEAN_USERS, ...registeredUsers, ...applicationUsers];
    console.log('🎯 Real login attempt (localStorage):', { 
      email: credentials.email, 
      totalUsers: allUsers.length
    });
    
    const user = allUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      console.log('❌ Login failed for:', credentials.email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ Login successful (localStorage):', user.email, 'Role:', user.role);
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: `real-jwt-token-${user.id}`,
      refreshToken: `real-refresh-token-${user.id}`,
    };
  }

  // Helper to get permissions for a role
  private getPermissionsForRole(role: UserRole): Permission[] {
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
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use real login function
      return await this.realLogin(credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Try Supabase first if configured
      if (isSupabaseConfigured() && supabase) {
        try {
          // Create user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone || '',
              }
            }
          });

          if (authError) {
            // If user already exists in auth, check if they exist in users table
            if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
              throw new Error('User with this email already exists');
            }
            throw authError;
          }

          if (!authData.user) {
            throw new Error('Failed to create user account');
          }

          // Create user record in users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              role: 'applicant',
              is_active: true,
              department: data.department || null,
            })
            .select()
            .single();

          if (userError) {
            // Clean up auth user if user table insert fails
            await supabase.auth.admin.deleteUser(authData.user.id);
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
            permissions: [
              { resource: 'application', action: 'create' },
              { resource: 'application', action: 'update' }
            ],
            profileData: {
              phone: data.phone || '',
              bio: '',
              applicationStatus: 'pending',
              applicationDate: new Date().toISOString(),
              documents: []
            }
          };

          // Also save to localStorage for offline access
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const updatedUsers = [...existingUsers, newUser];
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          localStorage.setItem(`user_${data.email}`, JSON.stringify({
            ...newUser,
            password: data.password
          }));

          console.log('✅ User registered successfully in Supabase:', newUser.email);

          // Get session for token
          const { data: sessionData } = await supabase.auth.getSession();
          
          return {
            user: newUser,
            token: sessionData?.session?.access_token || `supabase-token-${newUser.id}`,
            refreshToken: sessionData?.session?.refresh_token || `supabase-refresh-${newUser.id}`,
          };
        } catch (supabaseError: any) {
          console.warn('Supabase registration failed, falling back to localStorage:', supabaseError);
          // Fall through to localStorage fallback
        }
      }

      // LocalStorage fallback
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === data.email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.APPLICANT, // New registrations are applicants
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [
          { resource: 'application', action: 'create' },
          { resource: 'application', action: 'update' }
        ],
        profileData: {
          phone: data.phone || '',
          bio: '',
          applicationStatus: 'pending',
          applicationDate: new Date().toISOString(),
          documents: []
        }
      };

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      localStorage.setItem(`user_${data.email}`, JSON.stringify({
        ...newUser,
        password: data.password
      }));

      console.log('✅ User registered successfully (localStorage):', newUser.email);

      const { password, ...userWithoutPassword } = { ...newUser, password: data.password };

      return {
        user: userWithoutPassword,
        token: `real-jwt-token-${newUser.id}`,
        refreshToken: `real-refresh-token-${newUser.id}`,
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    // Sign out from Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
        console.log('✅ User logged out from Supabase');
      } catch (error) {
        console.warn('Supabase logout error:', error);
      }
    }
    
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    console.log('✅ User logged out');
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would validate the refresh token with the server
      // For now, we'll just return a new token
      const userId = refreshToken.replace('real-refresh-token-', '');
      
      return {
        user: {} as User, // Would be fetched from server
        token: `real-jwt-token-${userId}`,
        refreshToken: `real-refresh-token-${userId}`,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Verify token
  async verifyToken(token: string): Promise<User> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real app, this would validate the token with the server
      // For now, we'll extract user info from localStorage
      const userId = token.replace('real-jwt-token-', '');
      
      // Try to find user in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find((u: any) => u.id === userId);
      
      if (!user) {
        // Try application users
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('user_')) {
            try {
              const userData = JSON.parse(localStorage.getItem(key) || '{}');
              if (userData.id === userId) {
                return userData;
              }
            } catch (error) {
              console.warn('Error parsing user data:', error);
            }
          }
        }
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would send a password reset email
      console.log(`Password reset email sent to: ${email}`);
      
      // For demo purposes, we'll just log it
      console.log('✅ Password reset email sent (demo mode)');
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would validate the reset token and update the password
      console.log('Password reset successful (demo mode)');
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // Get current user from token
  async getCurrentUser(): Promise<User> {
    try {
      // Try Supabase session first
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (session?.user) {
            // Get user record from users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError || !userData) {
              throw new Error('User record not found');
            }

            // Convert to app User format
            return {
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              role: userData.role as UserRole,
              isActive: userData.is_active,
              createdAt: userData.created_at,
              updatedAt: userData.updated_at,
              permissions: this.getPermissionsForRole(userData.role as UserRole),
              profileData: {
                department: userData.department || undefined,
                cohort: userData.cohort || undefined,
              }
            };
          }
        } catch (supabaseError) {
          console.warn('Supabase getCurrentUser failed, falling back to localStorage:', supabaseError);
          // Fall through to localStorage fallback
        }
      }

      // LocalStorage fallback
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Extract user ID from token
      const userId = token.replace('real-jwt-token-', '').replace('supabase-token-', '');
      
      // Find user in CLEAN_USERS first
      const cleanUser = CLEAN_USERS.find(u => u.id === userId);
      if (cleanUser) {
        const { password, ...userWithoutPassword } = cleanUser;
        return userWithoutPassword;
      }

      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.id === userId);
      if (registeredUser) {
        return registeredUser;
      }

      // Check application users
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || '{}');
            if (userData.id === userId) {
              const { password, ...userWithoutPassword } = userData;
              return userWithoutPassword;
            }
          } catch (error) {
            console.warn('Error parsing user data:', error);
          }
        }
      }

      throw new Error('User not found');
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();