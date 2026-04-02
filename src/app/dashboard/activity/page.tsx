import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  LogIn,
  LogOut,
  Shield,
  Key,
  Settings,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ActivityType = "login" | "logout" | "security" | "api" | "settings" | "device" | "warning";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  device?: string;
  status: "success" | "warning" | "info";
}

/* ─────────────────────────────────────────────
   Sample data
───────────────────────────────────────────── */
const ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "login",
    title: "Successful sign in",
    description: "Signed in via email & password",
    timestamp: "2 minutes ago",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "success",
  },
  {
    id: "2",
    type: "security",
    title: "Password changed",
    description: "Your account password was updated",
    timestamp: "1 hour ago",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "success",
  },
  {
    id: "3",
    type: "device",
    title: "New device detected",
    description: "First sign in from this browser",
    timestamp: "1 hour ago",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "info",
  },
  {
    id: "4",
    type: "warning",
    title: "Failed login attempt",
    description: "Incorrect password entered 3 times",
    timestamp: "3 hours ago",
    location: "Unknown",
    device: "Firefox on Windows",
    status: "warning",
  },
  {
    id: "5",
    type: "api",
    title: "API key generated",
    description: "New API key created for production",
    timestamp: "Yesterday, 4:12 PM",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "success",
  },
  {
    id: "6",
    type: "settings",
    title: "Profile updated",
    description: "Display name was changed",
    timestamp: "Yesterday, 2:30 PM",
    location: "Davao, Philippines",
    device: "Safari on iPhone",
    status: "success",
  },
  {
    id: "7",
    type: "logout",
    title: "Signed out",
    description: "Session ended manually",
    timestamp: "2 days ago",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "info",
  },
  {
    id: "8",
    type: "login",
    title: "Successful sign in",
    description: "Signed in via email & password",
    timestamp: "2 days ago",
    location: "Davao, Philippines",
    device: "Chrome on macOS",
    status: "success",
  },
  {
    id: "9",
    type: "security",
    title: "2FA reminder",
    description: "Two-factor authentication is still disabled",
    timestamp: "3 days ago",
    location: "—",
    device: "—",
    status: "warning",
  },
  {
    id: "10",
    type: "login",
    title: "Successful sign in",
    description: "Signed in via OAuth (Google)",
    timestamp: "4 days ago",
    location: "Davao, Philippines",
    device: "Safari on macOS",
    status: "success",
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const ICON_MAP: Record<ActivityType, React.ElementType> = {
  login:    LogIn,
  logout:   LogOut,
  security: Shield,
  api:      Key,
  settings: Settings,
  device:   Smartphone,
  warning:  AlertTriangle,
};

const STATUS_STYLES = {
  success: {
    dot:  "bg-green-400",
    icon: "text-green-400",
    ring: "bg-green-500/10 border-green-500/20",
  },
  warning: {
    dot:  "bg-amber-400",
    icon: "text-amber-400",
    ring: "bg-amber-500/10 border-amber-500/20",
  },
  info: {
    dot:  "bg-brand-400",
    icon: "text-brand-400",
    ring: "bg-brand-500/10 border-brand-500/20",
  },
};

/* ─────────────────────────────────────────────
   Stats bar data
───────────────────────────────────────────── */
const STATS = [
  { label: "Total events",     value: "10",  icon: Clock,         color: "text-surface-400" },
  { label: "Successful logins",value: "3",   icon: CheckCircle2,  color: "text-green-400"   },
  { label: "Security alerts",  value: "2",   icon: AlertTriangle, color: "text-amber-400"   },
  { label: "Active devices",   value: "2",   icon: Smartphone,    color: "text-brand-400"   },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function ActivityPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh bg-surface-950 relative overflow-hidden">

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-5"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-brand-400 font-medium mb-1">Account</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Activity Log
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            A full history of sign-ins, security events, and account changes.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-up delay-75">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-surface-900/80 border border-surface-800 rounded-2xl px-4 py-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white leading-none">{stat.value}</p>
                  <p className="text-[11px] text-surface-600 mt-0.5 leading-tight">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center justify-between mb-4 animate-fade-up delay-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-surface-700">
            Recent events
          </p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-300 hover:border-surface-700 transition-colors text-xs font-medium">
            <Filter size={11} />
            Filter
          </button>
        </div>

        {/* ── Timeline ── */}
        <div className="relative animate-fade-up delay-150">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-800" />

          <div className="space-y-1">
            {ACTIVITIES.map((activity, i) => {
              const Icon   = ICON_MAP[activity.type];
              const styles = STATUS_STYLES[activity.status];

              return (
                <div
                  key={activity.id}
                  className="group relative flex gap-4 pl-0"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Timeline dot + icon */}
                  <div className="relative flex-shrink-0 flex items-start pt-4">
                    <div
                      className={`
                        w-10 h-10 rounded-xl border flex items-center justify-center z-10
                        transition-all duration-200 group-hover:scale-105
                        ${styles.ring}
                      `}
                    >
                      <Icon size={14} className={styles.icon} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-surface-900/60 border border-surface-800/80 rounded-2xl px-5 py-4 my-1.5 hover:bg-surface-900/90 hover:border-surface-700 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
                          <p className="text-sm font-semibold text-white truncate">
                            {activity.title}
                          </p>
                        </div>
                        <p className="text-xs text-surface-500 ml-3.5">
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-[11px] text-surface-700 whitespace-nowrap flex-shrink-0 pt-0.5">
                        {activity.timestamp}
                      </p>
                    </div>

                    {/* Meta row */}
                    {(activity.location || activity.device) && (
                      <div className="mt-3 pt-3 border-t border-surface-800/60 flex flex-wrap gap-x-4 gap-y-1">
                        {activity.location && activity.location !== "—" && (
                          <span className="flex items-center gap-1.5 text-[11px] text-surface-600">
                            <Globe size={10} className="text-surface-700" />
                            {activity.location}
                          </span>
                        )}
                        {activity.device && activity.device !== "—" && (
                          <span className="flex items-center gap-1.5 text-[11px] text-surface-600">
                            <Smartphone size={10} className="text-surface-700" />
                            {activity.device}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Load more ── */}
        <div className="mt-6 flex justify-center animate-fade-up delay-200">
          <button className="px-5 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-300 hover:border-surface-700 transition-colors text-sm font-medium">
            Load older events
          </button>
        </div>

      </main>
    </div>
  );
}