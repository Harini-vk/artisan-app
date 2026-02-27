import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "entrepreneur" | "investor" | "organizer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  onboarded: boolean;
  profile?: Record<string, any>;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<AuthResult>;
  completeOnboarding: (profileData: Record<string, any>) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch full user data including custom tables
  const fetchUserData = async (userId: string) => {
    try {
      // 1. Get base user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // 2. Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          onboarded: profileData?.onboarded || false,
          profile: profileData?.data || {},
        });
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const completeOnboarding = async (profileData: Record<string, any>): Promise<AuthResult> => {
    if (!user) return { success: false, error: "Not logged in" };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarded: true, data: profileData, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser({ ...user, onboarded: true, profile: profileData });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to save profile" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, completeOnboarding, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
