import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield, Mail, Calendar } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { user } = session;
  const joinedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  return (
    <div className="min-h-dvh bg-surface-950 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
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

      

      {/* Main */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-brand-400 font-medium mb-1">Dashboard</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            You&apos;re securely signed in to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-up delay-100">
          {/* Profile card */}
          <div className="md:col-span-2 bg-surface-900/80 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-brand">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-base truncate">{user?.name}</h2>
                <p className="text-surface-500 text-sm truncate">{user?.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
                    <Shield size={10} />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-surface-300 text-sm">
                  <Mail size={13} className="text-surface-500 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1">Member since</p>
                <div className="flex items-center gap-2 text-surface-300 text-sm">
                  <Calendar size={13} className="text-surface-500 flex-shrink-0" />
                  {joinedDate}
                </div>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div className="bg-surface-900/80 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Password", status: "Set", ok: true },
                { label: "Session", status: "Active", ok: true },
                { label: "2FA", status: "Off", ok: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">{item.label}</span>
                  <span className={`text-xs font-medium ${item.ok ? "text-green-400" : "text-surface-600"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-brand-600/10 border border-brand-500/20 rounded-2xl p-5 animate-fade-up delay-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield size={14} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-0.5">Your session is protected</p>
              <p className="text-xs text-surface-500 leading-relaxed">
                You&apos;re authenticated with JWT — your session will expire after 30 days of inactivity. 
                Use the sign out button to end your session immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
