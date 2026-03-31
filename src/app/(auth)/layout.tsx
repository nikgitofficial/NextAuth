import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden bg-surface-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Main gradient orb */}
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-20 animate-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(79,70,229,0.2) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[400px] opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(129,140,248,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Logo */}
      <header className="relative z-10 flex items-center justify-center pt-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1L14 4V12L8 15L2 12V4L8 1Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8 6a2 2 0 100 4 2 2 0 000-4z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            AuthSystem
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6">
        <p className="text-surface-600 text-xs">
          © {new Date().getFullYear()} AuthSystem · Built with Next.js &amp;
          MongoDB
        </p>
      </footer>
    </div>
  );
}
