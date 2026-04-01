"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { AuthCard, AuthCardHeader } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json.error ?? "Registration failed");
      return;
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  if (success) {
    return (
      <AuthCard>
        <div className="text-center py-8 animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 mb-4">
            <CheckCircle2 size={28} className="text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Account created!
          </h2>
          <p className="text-sm text-surface-500">
            Redirecting you to the dashboard…
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<User size={20} />}
        title="Create an account"
        subtitle="Join us today — it only takes a minute"
      />

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800/50 hover:bg-surface-800 text-surface-200 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
      >
        {googleLoading ? (
          <svg
            className="animate-spin w-4 h-4 text-surface-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-surface-800" />
        <span className="text-xs text-surface-600">or register with email</span>
        <div className="flex-1 h-px bg-surface-800" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          {...register("name")}
          label="Full name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          autoFocus
          leftIcon={<User size={15} />}
          error={errors.name?.message}
        />

        <Input
          {...register("email")}
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
        />

        <div>
          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            leftIcon={<Lock size={15} />}
            error={errors.password?.message}
          />
          <PasswordStrength password={password} />
        </div>

        <Input
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          leftIcon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
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
          rightIcon={<ArrowRight size={16} />}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-xs text-surface-600 text-center leading-relaxed">
          By creating an account, you agree to our{" "}
          <span className="text-surface-400">Terms of Service</span> and{" "}
          <span className="text-surface-400">Privacy Policy</span>.
        </p>
      </form>

      <div className="mt-6 pt-6 border-t border-surface-800 text-center">
        <p className="text-sm text-surface-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}