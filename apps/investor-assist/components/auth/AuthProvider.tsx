"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  onAuthChange,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase-auth";
import { upsertUser } from "@/lib/firebase-db";
import { useAnalysisStore } from "@/stores/analysisStore";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const resetStore = useAnalysisStore((s) => s.reset);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn() {
    const firebaseUser = await signInWithGoogle();
    await upsertUser(firebaseUser.uid, {
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    });
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
