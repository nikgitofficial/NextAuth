"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, HelpCircle, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/UserAvatar";

/* ─────────────────────────────────────────────
   Page meta
───────────────────────────────────────────── */
const PAGE_META: Record<string, { title: string; crumb: string }> = {
  "/dashboard":               { title: "Dashboard",     crumb: "Overview"  },
  "/dashboard/activity":      { title: "Activity",      crumb: "Overview"  },
  "/dashboard/profile":       { title: "Profile",       crumb: "Account"   },
  "/dashboard/billing":       { title: "Billing",       crumb: "Account"   },
  "/dashboard/notifications": { title: "Notifications", crumb: "Account"   },
  "/dashboard/security":      { title: "Security",      crumb: "Security"  },
  "/dashboard/api-keys":      { title: "API Keys",      crumb: "Security"  },
  "/dashboard/settings":      { title: "Settings",      crumb: "Settings"  },
};

/* ─────────────────────────────────────────────
   Topbar
───────────────────────────────────────────── */
export function Topbar({
  user,
  notificationCount = 3,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null };
  notificationCount?: number;
}) {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { title: "Dashboard", crumb: "Overview" };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center border-b border-surface-800/60 bg-surface-950/80 backdrop-blur-xl px-6 gap-4">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
        <span className="text-surface-600 hidden sm:block">{meta.crumb}</span>
        <ChevronRight size={13} className="text-surface-800 hidden sm:block flex-shrink-0" />
        <span className="text-white font-semibold truncate">{meta.title}</span>
      </div>

      {/* ── Search ── */}
      <div className="relative hidden md:flex items-center">
        <Search size={13} className="absolute left-3 text-surface-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="
            w-48 lg:w-64 h-8 pl-8 pr-10 rounded-lg
            bg-surface-900 border border-surface-800
            text-sm text-surface-300 placeholder:text-surface-700
            focus:outline-none focus:border-brand-500/50 focus:bg-surface-800/80
            transition-all duration-200
          "
        />
        <kbd className="absolute right-2.5 hidden lg:inline-flex items-center rounded px-1 py-0.5 text-[10px] font-medium text-surface-700 border border-surface-800">
          ⌘K
        </kbd>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1">

        {/* Help */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-600 hover:text-surface-300 hover:bg-surface-800 transition-colors">
          <HelpCircle size={15} />
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-surface-600 hover:text-surface-300 hover:bg-surface-800 transition-colors">
          <Bell size={15} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border border-surface-950" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-surface-800 mx-1.5" />

        {/* ── User dropdown ── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className={`
              flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl
              border transition-all duration-200
              ${dropdownOpen
                ? "bg-surface-800 border-surface-700"
                : "border-transparent hover:bg-surface-800/70 hover:border-surface-800"
              }
            `}
          >
            {/* Avatar — now uses UserAvatar */}
            <UserAvatar
              image={user?.image}
              name={user?.name}
              size="sm"
            />

            {/* Name — visible on lg+ */}
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-surface-300 leading-tight truncate max-w-[100px]">
                {user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-surface-600 leading-tight truncate max-w-[100px]">
                {user?.email ?? ""}
              </p>
            </div>

            {/* Caret */}
            <ChevronRight
              size={12}
              className="text-surface-600 hidden lg:block transition-transform duration-200"
              style={{ transform: dropdownOpen ? "rotate(-90deg)" : "rotate(90deg)" }}
            />
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-surface-900 border border-surface-800 shadow-xl shadow-black/40 overflow-hidden z-50">
              {/* User info header — also shows avatar */}
              <div className="px-4 py-3 border-b border-surface-800 flex items-center gap-3">
                <UserAvatar
                  image={user?.image}
                  name={user?.name}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
                  <p className="text-xs text-surface-500 truncate mt-0.5">{user?.email ?? ""}</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                >
                  <User size={14} className="text-surface-600" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                >
                  <Settings size={14} className="text-surface-600" />
                  Settings
                </Link>
              </div>

              {/* Sign out */}
              <div className="p-1.5 border-t border-surface-800">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}