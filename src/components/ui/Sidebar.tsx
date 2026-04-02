"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  Shield,
  Bell,
  Settings,
  CreditCard,
  Activity,
  Key,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";

/* ─────────────────────────────────────────────
   Nav data
───────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Activity,        label: "Activity",  href: "/dashboard/activity" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User,       label: "Profile",       href: "/dashboard/profile" },
      { icon: CreditCard, label: "Billing",        href: "/dashboard/billing" },
      { icon: Bell,       label: "Notifications",  href: "/dashboard/notifications", badge: 3 },
    ],
  },
  {
    label: "Security",
    items: [
      { icon: Shield, label: "Security",    href: "/dashboard/security" },
      { icon: Key,    label: "API Keys",    href: "/dashboard/api-keys" },
    ],
  },
];

/* ─────────────────────────────────────────────
   Single nav item
───────────────────────────────────────────── */
function NavItem({
  icon: Icon,
  label,
  href,
  badge,
  active,
  collapsed,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 outline-none
        ${active
          ? "bg-brand-500/15 text-brand-300 shadow-[inset_0_1px_0_rgba(99,102,241,0.15)]"
          : "text-surface-500 hover:text-surface-200 hover:bg-surface-800/70"
        }
      `}
      title={collapsed ? label : undefined}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-brand-400" />
      )}

      <Icon
        size={16}
        className={`flex-shrink-0 transition-colors duration-200 ${
          active ? "text-brand-400" : "text-surface-600 group-hover:text-surface-400"
        }`}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500/20 px-1.5 text-[10px] font-semibold text-brand-300">
              {badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="
            pointer-events-none absolute left-full ml-3 z-50
            whitespace-nowrap rounded-lg bg-surface-800 border border-surface-700
            px-2.5 py-1.5 text-xs text-surface-200 shadow-xl
            opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-150
          "
        >
          {label}
          {badge !== undefined && (
            <span className="ml-1.5 inline-flex h-4 items-center justify-center rounded-full bg-brand-500/20 px-1 text-[10px] font-semibold text-brand-300">
              {badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Main Sidebar component
───────────────────────────────────────────── */
export function Sidebar({
  user,
  onSignOut,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null };
  onSignOut?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div
      className={`
        flex flex-col h-full bg-surface-950/90 backdrop-blur-xl
        border-r border-surface-800/60
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-64"}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-surface-800/60 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-brand">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L14 4V12L8 15L2 12V4L8 1Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M8 6a2 2 0 100 4 2 2 0 000-4z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-sm tracking-tight whitespace-nowrap">
              AuthSystem
            </span>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden md:flex w-6 h-6 items-center justify-center rounded-md text-surface-600 hover:text-surface-300 hover:bg-surface-800 transition-colors flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {/* ── Nav groups ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5 scrollbar-thin scrollbar-thumb-surface-800">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-surface-700">
                {group.label}
              </p>
            )}
            {collapsed && (
              <div className="mx-3 mb-1.5 h-px bg-surface-800/60" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Settings shortcut ── */}
      <div className="px-2 pb-2">
        <NavItem
          icon={Settings}
          label="Settings"
          href="/dashboard/settings"
          active={pathname === "/dashboard/settings"}
          collapsed={collapsed}
        />
      </div>

      {/* ── User footer ── */}
      <div className="border-t border-surface-800/60 p-3 flex-shrink-0">
        <div
          className={`flex items-center gap-3 rounded-xl p-2 hover:bg-surface-800/50 transition-colors group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {/* Avatar — now uses UserAvatar */}
          <UserAvatar
            image={user?.image}
            name={user?.name}
            size="md"
          />

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-200 truncate leading-tight">
                  {user?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-surface-600 truncate leading-tight">
                  {user?.email ?? ""}
                </p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-surface-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-50 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-900 border border-surface-800 text-surface-400 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={16} />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`
          md:hidden fixed inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative h-full w-64">
          {sidebarContent}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3.5 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}