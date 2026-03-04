"use client";

import { LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function LoginBanner() {
  const { signIn, loading } = useAuth();

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-brand-900">
          Sign in to save your portfolio
        </p>
        <p className="text-xs text-brand-600 mt-0.5">
          Your stocks will persist across sessions when you&apos;re signed in.
        </p>
      </div>
      <button
        onClick={signIn}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors shrink-0"
      >
        <LogIn className="h-4 w-4" />
        Sign in with Google
      </button>
    </div>
  );
}
