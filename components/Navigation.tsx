"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, LayoutDashboard, Users, Zap, Target, Settings } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ceo", label: "CEO Command", icon: Brain },
  { href: "/flow", label: "Flow OS", icon: Zap },
  { href: "/shadow", label: "Shadow Ops", icon: Target },
  { href: "/onboarding", label: "Onboarding", icon: Users },
  { href: "/ops", label: "Ops", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-14">
        <Link
          href="/dashboard"
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-lg mr-4 shrink-0"
        >
          AI Wingman
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
