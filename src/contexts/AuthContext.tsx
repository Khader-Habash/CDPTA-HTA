import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';
import { userSyncService } from '@/services/userSyncService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await authService.getCurrentUser();
          
          // Sync user data to ensure consistency
          const syncedUser = await userSyncService.getSyncedUser(user.id);
          const finalUser = syncedUser || user;
          
          setState({
            user: finalUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed',
        });
      }
    };

    initializeAuth();
    
    // Listen for user updates from other tabs
    const cleanup = userSyncService.startListeningForUpdates((updatedUser) => {
      if (state.user?.id === updatedUser.id) {
        setState(prev => ({
          ...prev,
          user: updatedUser
        }));
      }
    });
    
    return cleanup;
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Sync user data to ensure consistency
      const syncedUser = await userSyncService.getSyncedUser(response.user.id);
      const finalUser = syncedUser || response.user;
      
      setState({
        user: finalUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('AuthContext register called with:', data);
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.register(data);
      console.log('AuthContext received response:', response);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log('AuthContext state updated successfully');
    } catch (error) {
      console.error('AuthContext registration error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and reset state
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      // Redirect to home page after logout
      window.location.href = '/';
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        error: null,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  // Check if user has specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.user) return false;
    
    return state.user.permissions.some(
      permission => 
        permission.resource === resource && permission.action === action
    );
  };

  // Check if user has specific role(s)
  const hasRole = (roles: string | string[]): boolean => {
    if (!state.user) {
      return false;
    }
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(state.user.role);
  };

  // Update current user data
  const updateUser = async (updates: Partial<User>) => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userSyncService.updateUserSync(
        state.user.id,
        updates,
        {
          updateProfileData: !!updates.role,
          updatePermissions: !!updates.role,
          propagateToChildren: true,
          syncAcrossTabs: true
        }
      );

      setState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Refresh user data from server
  const refreshUserData = async () => {
    if (!state.user) {
      return;
    }

    try {
      const refreshedUser = await userSyncService.getSyncedUser(state.user.id);
      if (refreshedUser) {
        setState(prev => ({
          ...prev,
          user: refreshedUser
        }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    updateUser,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
