import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  farmName: string;
  farmLocation: string;
  farmSize: number;
  phoneNumber?: string;
  role: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock user data for demo purposes
  const [user, setUser] = useState<User | null>({
    _id: 'demo-user-id',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@agrimanage.com',
    farmName: 'Demo Farm',
    farmLocation: 'Demo Location',
    farmSize: 100,
    phoneNumber: '+1-555-0123',
    role: 'owner',
    lastLogin: new Date().toISOString()
  });
  const [token, setToken] = useState<string | null>('demo-token');
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Mock login - always succeeds
    console.log('Mock login for:', email);
  };

  const register = async (userData: any) => {
    // Mock register - always succeeds
    console.log('Mock registration for:', userData.email);
  };

  const logout = () => {
    // Mock logout - just log the action
    console.log('Logout successful');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: true // Always authenticated in demo mode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};