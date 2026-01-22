// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  is_admin?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, claudeApiKey: string, tavilyApiKey?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const AUTH_TIMESTAMP_KEY = 'auth_timestamp';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage for instant hydration
    try {
      const cached = localStorage.getItem(USER_DATA_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Computed admin status
  const isAdmin = user?.is_admin === true;

  // Sync user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    }
  }, [user]);

  // Refresh user data from API
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        return;
      } catch (error) {
        // Token invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
        setUser(null);
      }
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          localStorage.removeItem(AUTH_TIMESTAMP_KEY);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        if (event.newValue) {
          // Token was added in another tab - refresh user
          refreshUser();
        } else {
          // Token was removed in another tab - log out
          setUser(null);
        }
      } else if (event.key === USER_DATA_KEY) {
        if (event.newValue) {
          try {
            const newUser = JSON.parse(event.newValue);
            setUser(newUser);
          } catch {
            // Invalid JSON, ignore
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  // Broadcast auth state changes to other tabs via BroadcastChannel (for same-origin tabs)
  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_LOGOUT') {
        setUser(null);
      } else if (event.data.type === 'AUTH_LOGIN' && event.data.user) {
        setUser(event.data.user);
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  const broadcastAuthChange = useCallback((type: 'AUTH_LOGIN' | 'AUTH_LOGOUT', userData?: User) => {
    try {
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type, user: userData });
      channel.close();
    } catch {
      // BroadcastChannel not supported, fall back to storage events
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    // Token is already saved by apiClient.login()
    
    // Fetch user data and update state
    const userData = await apiClient.getCurrentUser();
    setUser(userData);
    broadcastAuthChange('AUTH_LOGIN', userData);
  };

  const register = async (email: string, password: string, name: string, claudeApiKey: string, tavilyApiKey?: string) => {
    const response = await apiClient.register(email, password, name, claudeApiKey, tavilyApiKey);
    // Token is already saved by apiClient.register()
    
    // Fetch full user data from API
    const userData = await apiClient.getCurrentUser();
    setUser(userData);
    broadcastAuthChange('AUTH_LOGIN', userData);
  };

  const logout = () => {
    apiClient.logout();
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    setUser(null);
    broadcastAuthChange('AUTH_LOGOUT');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}