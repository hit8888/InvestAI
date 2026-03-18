"use client";

import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function MobileHeader() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <header className="flex md:hidden items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
      <Image
        src="/logo.png"
        alt="NeuralTrade"
        width={28}
        height={28}
        className="rounded-lg"
      />
      <span className="text-base font-semibold text-gray-900 flex-1">
        NeuralTrade
      </span>

      {!loading && (
        <>
          {user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-brand-700">
                    {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={signOut}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          )}
        </>
      )}
    </header>
  );
}
