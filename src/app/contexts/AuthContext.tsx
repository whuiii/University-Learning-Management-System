import { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from '../types';

interface AuthContextType {
  user: string | null;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map role to a mock user name
const roleToName: Record<Role, string> = {
  student: 'Ahmad Fariz',
  lecturer: 'Dr. Sarah Chen',
  admin: 'Siti Rahimah',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>('Ahmad Fariz');
  const [role, setRole] = useState<Role | null>('student');

  const login = (r: Role) => {
    setRole(r);
    setUser(roleToName[r]);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}