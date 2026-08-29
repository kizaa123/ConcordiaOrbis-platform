"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { isAccountant, isAccountantApproved } from "@/lib/types";
import { Icon } from "@/components/icons";
import { PasswordInput } from "@/components/PasswordInput";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AuthHeroPanel } from "@/components/AuthHeroPanel";
import { AuthDivider, GoogleSignInButton } from "@/components/GoogleSignInButton";
import { api } from "@/lib/api";

const GOOGLE_DEV_MODE = process.env.NEXT_PUBLIC_GOOGLE_DEV_MODE === "true";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryError = searchParams.get("error");

  const routeAfterAuth = (profile: {
    profileComplete?: boolean;
    roleId: number;
    verificationStatus?: string;
  }) => {
    if (profile.profileComplete === false) {
      router.push("/complete-profile");
    } else if (isAccountant(profile.roleId) && isAccountantApproved(profile)) {
      router.push("/accountant");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await login(email, password);
      routeAfterAuth(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDevGoogle = async () => {
    setError("");
    setDevLoading(true);
    try {
      const result = await api.auth.googleDevSignIn({
        email: email || "google.dev@ani.gh",
        firstName: "Google",
        lastName: "User",
      });
      api.setTokens(result.accessToken, result.refreshToken);
      if (result.needsProfile) {
        window.location.href = "/complete-profile";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <AuthHeroPanel className="flex-1" simple>
      <ScrollReveal trigger="mount" delay={80} duration={400} direction="fade-up">
        <div className="space-y-4">
          <header>
            <h1 className="text-lg font-bold text-brand-900">Sign in</h1>
            <p className="mt-0.5 text-sm text-gray-500">Email or Google to continue.</p>
          </header>

          {(error || queryError) && (
            <div className="auth-error" role="alert">
              <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error || queryError}</span>
            </div>
          )}

          <GoogleSignInButton
            label="Continue with Google"
            disabled={loading || devLoading}
            showDev={GOOGLE_DEV_MODE}
            onDevSignIn={handleDevGoogle}
            devLoading={devLoading}
          />
          <AuthDivider text="or" />

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="login-email" className="auth-label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-input !py-2.5"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="auth-label">
                Password
              </label>
              <PasswordInput
                id="login-password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="auth-input !py-2.5"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cta w-full !py-2.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="pt-0.5 text-center text-sm text-gray-500">
            No account?{" "}
            <Link href="/register" className="font-semibold text-brand-700 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </ScrollReveal>
    </AuthHeroPanel>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
