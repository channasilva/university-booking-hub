import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'lecturer' | 'student' | 'maintenance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM001'
  },
  {
    id: '2',
    email: 'lecturer@university.edu',
    password: 'lecturer123',
    name: 'Prof. Michael Chen',
    role: 'lecturer',
    department: 'Computer Science',
    employeeId: 'LEC001'
  },
  {
    id: '3',
    email: 'student@university.edu',
    password: 'student123',
    name: 'Emma Davis',
    role: 'student',
    department: 'Computer Science',
    studentId: 'STU2024001'
  },
  {
    id: '4',
    email: 'maintenance@university.edu',
    password: 'maintenance123',
    name: 'James Wilson',
    role: 'maintenance',
    department: 'Facilities',
    employeeId: 'MAI001'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('campus_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('campus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campus_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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