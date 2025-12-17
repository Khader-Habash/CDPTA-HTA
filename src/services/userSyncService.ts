import { User, UserRole } from '@/types/auth';
import { userService } from './userService';

/**
 * Centralized User Synchronization Service
 * 
 * This service ensures consistency across all user data storage locations:
 * - localStorage (cdpta_users)
 * - Individual user keys (user_email)
 * - Auth context state
 * - Profile data updates
 */

interface UserUpdateOptions {
  updateProfileData?: boolean;
  updatePermissions?: boolean;
  propagateToChildren?: boolean; // For preceptor-fellow relationships
  syncAcrossTabs?: boolean;
}

class UserSyncService {
  /**
   * Get a user with fully synchronized data
   */
  async getSyncedUser(userId: string): Promise<User | null> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) return null;

      // Ensure profileData exists
      if (!user.profileData) {
        user.profileData = this.getDefaultProfileData(user.role);
      }

      // Ensure permissions exist
      if (!user.permissions || user.permissions.length === 0) {
        user.permissions = this.getDefaultPermissions(user.role);
      }

      // Load any additional data from individual keys
      const individualUserData = this.loadIndividualUserData(user.email);
      if (individualUserData) {
        return { ...user, ...individualUserData };
      }

      return user;
    } catch (error) {
      console.error('Error getting synced user:', error);
      return null;
    }
  }

  /**
   * Update user with full synchronization
   */
  async updateUserSync(
    userId: string,
    updates: Partial<User>,
    options: UserUpdateOptions = {}
  ): Promise<User> {
    try {
      // Update user in userService (updates localStorage)
      const updatedUser = await userService.updateUser(userId, updates);

      // Update individual user key if exists
      const individualKey = `user_${updatedUser.email}`;
      const individualData = localStorage.getItem(individualKey);
      if (individualData) {
        try {
          const userData = JSON.parse(individualData);
          localStorage.setItem(individualKey, JSON.stringify({
            ...userData,
            ...updatedUser,
            password: userData.password, // Preserve password
            updatedAt: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error updating individual user key:', error);
        }
      }

      // Update profile data if needed
      if (options.updateProfileData && updates.role) {
        await this.updateProfileDataForRole(updatedUser);
      }

      // Update permissions if role changed
      if (options.updatePermissions && updates.role) {
        updatedUser.permissions = this.getDefaultPermissions(updates.role);
      }

      // Propagate to related users (e.g., update preceptor when fellow is assigned)
      if (options.propagateToChildren && updatedUser.role === UserRole.FELLOW) {
        await this.updatePreceptorWithFellow(updatedUser);
      }

      // Broadcast change to other tabs
      if (options.syncAcrossTabs !== false) {
        this.broadcastUserUpdate(updatedUser);
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user sync:', error);
      throw error;
    }
  }

  /**
   * Create user with full synchronization
   */
  async createUserSync(userData: any): Promise<User> {
    try {
      // Create user via userService
      const newUser = await userService.createUser(userData);

      // Save to individual user key for authentication
      const userKey = `user_${newUser.email}`;
      localStorage.setItem(userKey, JSON.stringify({
        ...newUser,
        password: userData.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Initialize profile data
      newUser.profileData = this.getDefaultProfileData(newUser.role);
      newUser.permissions = this.getDefaultPermissions(newUser.role);

      // Propagate to related users if needed
      if (newUser.role === UserRole.FELLOW) {
        await this.updatePreceptorWithFellow(newUser);
      }

      // Broadcast creation
      this.broadcastUserUpdate(newUser);

      return newUser;
    } catch (error) {
      console.error('Error creating user sync:', error);
      throw error;
    }
  }

  /**
   * Sync all users in localStorage with current data model
   */
  async syncAllUsers(): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      
      for (const user of users) {
        // Ensure all users have required fields
        if (!user.profileData) {
          user.profileData = this.getDefaultProfileData(user.role);
        }
        if (!user.permissions || user.permissions.length === 0) {
          user.permissions = this.getDefaultPermissions(user.role);
        }

        // Update localStorage with synced data
        const userKey = `user_${user.email}`;
        const existingData = localStorage.getItem(userKey);
        if (existingData) {
          try {
            const userData = JSON.parse(existingData);
            localStorage.setItem(userKey, JSON.stringify({
              ...user,
              password: userData.password, // Preserve password
            }));
          } catch (error) {
            console.error(`Error syncing user ${user.email}:`, error);
          }
        }
      }

      console.log('✅ Synced all users');
    } catch (error) {
      console.error('Error syncing all users:', error);
    }
  }

  /**
   * Get default profile data for a role
   */
  private getDefaultProfileData(role: UserRole): any {
    const defaults: Record<string, any> = {
      [UserRole.APPLICANT]: {
        applicationStatus: 'pending',
        applicationDate: new Date().toISOString(),
        documents: []
      },
      [UserRole.FELLOW]: {
        cohort: '2024A',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        mentor: 'user-khader-preceptor',
        projects: []
      },
      [UserRole.PRECEPTOR]: {
        department: 'Health Technology Assessment',
        position: 'Preceptor',
        fellowsAssigned: []
      },
      [UserRole.ADMIN]: {
        adminLevel: 'super'
      }
    };

    return defaults[role] || {};
  }

  /**
   * Get default permissions for a role
   */
  private getDefaultPermissions(role: UserRole): any[] {
    const permissions: Record<string, any[]> = {
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

  /**
   * Update profile data when role changes
   */
  private async updateProfileDataForRole(user: User): Promise<void> {
    try {
      const defaultProfile = this.getDefaultProfileData(user.role);
      const updatedProfile = {
        ...user.profileData,
        ...defaultProfile
      };

      await userService.updateUser(user.id, {
        // Only update if profileData is different
      });
    } catch (error) {
      console.error('Error updating profile data for role:', error);
    }
  }

  /**
   * Update preceptor's profile when a fellow is assigned
   */
  private async updatePreceptorWithFellow(fellow: User): Promise<void> {
    try {
      const preceptorId = fellow.profileData?.mentor || 'user-khader-preceptor';
      const preceptor = await userService.getUserById(preceptorId);
      
      if (preceptor && preceptor.role === UserRole.PRECEPTOR) {
        const existingFellows = preceptor.profileData?.fellowsAssigned || [];
        const fellowExists = existingFellows.some((f: any) => f.id === fellow.id);
        
        if (!fellowExists) {
          const updatedProfile = {
            ...preceptor.profileData,
            fellowsAssigned: [
              ...existingFellows,
              {
                id: fellow.id,
                name: `${fellow.firstName} ${fellow.lastName}`,
                email: fellow.email,
                cohort: fellow.profileData?.cohort || '2024A',
                startDate: fellow.profileData?.startDate || new Date().toISOString(),
                status: 'active'
              }
            ]
          };

          await userService.updateUser(preceptorId, {
            profileData: updatedProfile
          });

          console.log('✅ Updated preceptor profile with new fellow:', {
            preceptor: `${preceptor.firstName} ${preceptor.lastName}`,
            fellow: `${fellow.firstName} ${fellow.lastName}`
          });
        }
      }
    } catch (error) {
      console.error('Error updating preceptor with fellow:', error);
    }
  }

  /**
   * Load individual user data from localStorage
   */
  private loadIndividualUserData(email: string): any | null {
    try {
      const userKey = `user_${email}`;
      const data = localStorage.getItem(userKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading individual user data:', error);
    }
    return null;
  }

  /**
   * Broadcast user update to other tabs
   */
  private broadcastUserUpdate(user: User): void {
    try {
      // Store update in localStorage
      localStorage.setItem(`user_update_${user.id}`, JSON.stringify({
        user,
        timestamp: Date.now()
      }));

      // Dispatch storage event to sync with other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: `user_update_${user.id}`,
        newValue: JSON.stringify({ user, timestamp: Date.now() })
      }));
    } catch (error) {
      console.error('Error broadcasting user update:', error);
    }
  }

  /**
   * Listen for user updates from other tabs
   */
  startListeningForUpdates(callback: (user: User) => void): () => void {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('user_update_')) {
        try {
          const data = JSON.parse(event.newValue || '{}');
          if (data.user) {
            callback(data.user);
          }
        } catch (error) {
          console.error('Error handling user update event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
}

export const userSyncService = new UserSyncService();
