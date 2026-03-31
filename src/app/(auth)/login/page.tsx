"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { AuthCard, AuthCardHeader } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<Lock size={20} />}
        title="Welcome back"
        subtitle="Sign in to your account to continue"
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

        <Input
          {...register("password")}
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock size={15} />}
          error={errors.password?.message}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

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
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-surface-800 text-center">
        <p className="text-sm text-surface-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
