"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import { AuthCard, AuthCardHeader } from "@/components/ui/AuthCard";
import { OTPInput } from "@/components/ui/OTPInput";
import { Button } from "@/components/ui/Button";

const RESEND_COOLDOWN = 60;

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCooldown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Invalid code");
      if (res.status !== 400) setOtp("");
      return;
    }

    router.push(
      `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
    );
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setError("");
    setOtp("");

    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setResending(false);
    startCooldown();
  };

  // Auto-submit when all digits entered
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) =>
    a + "*".repeat(Math.max(0, b.length)) + c
  );

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<ShieldCheck size={20} />}
        title="Enter verification code"
        subtitle={`We sent a 6-digit code to ${maskedEmail}`}
      />

      <div className="space-y-6">
        <OTPInput
          value={otp}
          onChange={setOtp}
          error={!!error}
          disabled={loading}
        />

        {error && (
          <p className="text-center text-sm text-red-400 animate-slide-down">
            {error}
          </p>
        )}

        <Button
          fullWidth
          size="lg"
          loading={loading}
          onClick={handleVerify}
          disabled={otp.length < 6}
        >
          {loading ? "Verifying…" : "Verify code"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-surface-500">
            Didn&apos;t receive the code?{" "}
            {cooldown > 0 ? (
              <span className="text-surface-600">
                Resend in <span className="font-mono text-surface-400">{cooldown}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-medium transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <RotateCcw size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Resend
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-surface-800 text-center">
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Try a different email
        </Link>
      </div>
    </AuthCard>
  );
}
