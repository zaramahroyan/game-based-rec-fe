
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'candidate' | 'recruiter' | 'admin';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions (replace with actual API calls)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock users for different roles
  const mockUsers = {
    'candidate@example.com': {
      id: 'c123',
      name: 'Test Candidate',
      email: 'candidate@example.com',
      role: 'candidate' as UserRole,
    },
    'recruiter@example.com': {
      id: 'r456',
      name: 'Test Recruiter',
      email: 'recruiter@example.com',
      role: 'recruiter' as UserRole,
    },
    'admin@example.com': {
      id: 'a789',
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'admin' as UserRole,
    },
  };
  
  if (email in mockUsers && password === 'password') {
    return mockUsers[email as keyof typeof mockUsers];
  }
  
  throw new Error('Invalid credentials');
};

const mockSignup = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    role,
  };
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }
      
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const user = await mockSignup(name, email, password, role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to appropriate dashboard
      if (role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
      
      toast({
        title: 'Account Created',
        description: 'Your account has been successfully created',
      });
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        signup, 
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
