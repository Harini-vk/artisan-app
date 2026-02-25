import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "entrepreneur" | "investor" | "organizer";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  onboarded: boolean;
  profile?: Record<string, any>;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  completeOnboarding: (profileData: Record<string, any>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user store
const mockUsers: AuthUser[] = [
  { name: "Priya Sharma", email: "priya@artisan.com", role: "entrepreneur", onboarded: true, profile: { phone: "+91 98765 43210", businessType: "Handmade Pottery & Ceramics", experience: "3-5 years", interests: ["Pottery", "Ceramics", "Natural Dyes"], categories: ["Home Decor", "Kitchenware", "Art"] } },
  { name: "Rajiv Mehta", email: "rajiv@invest.com", role: "investor", onboarded: true, profile: { organization: "Artisan Capital Partners", investmentInterests: ["Handmade Crafts", "Textile Products"], preferredCategories: ["Home Decor", "Fashion"] } },
  { name: "Admin Organizer", email: "admin@artisan.com", role: "organizer", onboarded: true, profile: { organization: "Women Artisans Collective", phone: "+91 99887 76655" } },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    const newUser: AuthUser = { name, email, role, onboarded: false };
    mockUsers.push(newUser);
    setUser(newUser);
  };

  const completeOnboarding = (profileData: Record<string, any>) => {
    setUser((prev) => prev ? { ...prev, onboarded: true, profile: profileData } : null);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
