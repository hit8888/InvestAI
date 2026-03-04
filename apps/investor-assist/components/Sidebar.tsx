"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, LayoutDashboard, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Analysis", href: "/dashboard", icon: LayoutDashboard },
  { label: "About", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold text-gray-900">NeuralTrade</span>
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

      <div className="px-4 py-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Powered by Monte Carlo simulation + AI analysis
        </p>
      </div>
    </aside>
  );
}
