import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { Shield, Mail, Calendar, User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { user } = session;

  const joinedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh bg-surface-950 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10"
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

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-brand-400 font-medium mb-1">Account</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Profile</h1>
          <p className="text-surface-500 text-sm mt-1">
            Manage your personal information and profile picture.
          </p>
        </div>

        <div className="space-y-4 animate-fade-up delay-75">

          {/* ── Profile picture card ── */}
          <div className="bg-surface-900/80 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={14} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-white">Profile Picture</h2>
            </div>
            <AvatarUpload
              currentImage={user?.image}
              name={user?.name}
              email={user?.email}
            />
          </div>

          {/* ── Personal info card ── */}
          <div className="bg-surface-900/80 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={14} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-white">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1.5">Full name</p>
                <div className="flex items-center gap-2 bg-surface-800/50 border border-surface-800 rounded-xl px-3 py-2.5">
                  <User size={13} className="text-surface-600 flex-shrink-0" />
                  <span className="text-sm text-surface-300 truncate">{user?.name ?? "—"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1.5">Email address</p>
                <div className="flex items-center gap-2 bg-surface-800/50 border border-surface-800 rounded-xl px-3 py-2.5">
                  <Mail size={13} className="text-surface-600 flex-shrink-0" />
                  <span className="text-sm text-surface-300 truncate">{user?.email ?? "—"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1.5">Member since</p>
                <div className="flex items-center gap-2 bg-surface-800/50 border border-surface-800 rounded-xl px-3 py-2.5">
                  <Calendar size={13} className="text-surface-600 flex-shrink-0" />
                  <span className="text-sm text-surface-300">{joinedDate}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-surface-600 uppercase tracking-wider mb-1.5">Account status</p>
                <div className="flex items-center gap-2 bg-surface-800/50 border border-surface-800 rounded-xl px-3 py-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-sm text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Badges card ── */}
          <div className="bg-surface-900/80 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={14} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-white">Account Badges</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
                <Shield size={10} />
                Verified
              </span>
              {user?.image && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                  <User size={10} />
                  Photo set
                </span>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}