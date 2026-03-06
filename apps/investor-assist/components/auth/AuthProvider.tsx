"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  onAuthChange,
  signInWithGoogle,
  signOutUser,
} from "@/lib/supabase-auth";
import { useAnalysisStore } from "@/stores/analysisStore";
import { saveStock } from "@/lib/supabase-db";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const resetStore = useAnalysisStore((s) => s.reset);
  const portfolio = useAnalysisStore((s) => s.portfolio);
  const prevUserRef = useRef<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      // Detect fresh sign-in (null → user) and save any pending portfolio
      if (authUser && !prevUserRef.current && portfolio.length > 0) {
        Promise.all(portfolio.map((stock) => saveStock(authUser.uid, stock)));
      }
      prevUserRef.current = authUser;
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [portfolio]);

  async function signIn() {
    await signInWithGoogle();
    // Session is set automatically after OAuth redirect
  }

  async function signOut() {
    await signOutUser();
    resetStore();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
