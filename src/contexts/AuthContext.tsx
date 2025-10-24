import { createContext, useContext, useEffect, useState } from 'react';
import { User, Profile, localStorageService } from '../lib/localStorage';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setProfile({
        id: userData.id,
        full_name: userData.full_name,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: newUser, error } = await localStorageService.createUser(email, password, fullName);
      
      if (error) {
        return { error };
      }

      if (newUser) {
        setUser(newUser);
        setProfile({
          id: newUser.id,
          full_name: newUser.full_name,
          role: newUser.role,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        });
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authenticatedUser, error } = await localStorageService.authenticateUser(email, password);
      
      if (error) {
        return { error };
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setProfile({
          id: authenticatedUser.id,
          full_name: authenticatedUser.full_name,
          role: authenticatedUser.role,
          created_at: authenticatedUser.created_at,
          updated_at: authenticatedUser.updated_at
        });
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
