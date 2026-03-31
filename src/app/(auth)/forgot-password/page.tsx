"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, SendHorizonal } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { AuthCard, AuthCardHeader } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError("");

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong");
      return;
    }

    setEmail(data.email);
    setSent(true);
  };

  const handleVerifyOTP = () => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  if (sent) {
    return (
      <AuthCard>
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/15 border border-brand-500/20 mb-5">
            <Mail size={22} className="text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Check your inbox
          </h2>
          <p className="text-sm text-surface-500 leading-relaxed mb-1">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-surface-200 mb-6">{email}</p>

          <div className="space-y-3">
            <Button fullWidth size="lg" onClick={handleVerifyOTP}>
              Enter verification code
            </Button>

            <button
              onClick={() => setSent(false)}
              className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
            >
              Use a different email
            </button>
          </div>

          <p className="mt-6 text-xs text-surface-600">
            Didn&apos;t receive it? Check your spam folder or wait a minute.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<Mail size={20} />}
        title="Reset your password"
        subtitle="Enter your email and we'll send you a verification code"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          {...register("email")}
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
        />

        {serverError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-slide-down">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          rightIcon={<SendHorizonal size={16} />}
        >
          {isSubmitting ? "Sending code…" : "Send verification code"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-surface-800 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
