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
import { useWatch, useFormContext } from "react-hook-form";

function PasswordStrengthWrapper({ control }: { control: any }) {
  return null; // placeholder — handled inline below
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

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

    // Auto sign in after registration
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
