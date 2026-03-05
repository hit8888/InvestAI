"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthChange,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase-auth";
import { upsertUser } from "@/lib/firebase-db";
import { useAnalysisStore } from "@/stores/analysisStore";

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

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        upsertUser(authUser.uid, {
          name: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,
        }).catch(console.error);
      }
    });
    return unsubscribe;
  }, []);

  async function signIn() {
    await signInWithGoogle();
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
