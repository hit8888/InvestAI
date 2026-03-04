"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TrendingUp, LayoutDashboard, Info, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const NAV_ITEMS = [
  { label: "Analysis", href: "/dashboard", icon: LayoutDashboard },
  { label: "About", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold text-gray-900">
          NeuralTrade
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        {!loading && user ? (
          <>
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full shrink-0"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-brand-700">
                    {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user.displayName ?? "User"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={signIn}
              disabled={loading}
              className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in with Google
            </button>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Powered by Monte Carlo simulation + AI analysis
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
