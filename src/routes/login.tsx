import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search.mode as "signin" | "signup") ?? "signin",
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">(
    search.mode ?? "signin",
  );

  useEffect(() => {
    if (session) {
      navigate({ to: "/overview" });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setNotice(
          "Account created. Check your email to confirm, then contact an administrator for dashboard access.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: "/overview" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      // Supabase handles the redirect — no further action needed here.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-institutional-700 text-white font-bold">
            P
          </div>
          <span className="font-semibold text-navy-950 text-xl tracking-tight">
            Polis <span className="text-institutional-600">Systems</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-navy-950 text-center mb-2">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-navy-400 text-center mb-6">
            {mode === "signin"
              ? "Sign in to your Polis Systems dashboard"
              : "Join Polis Systems to coordinate field work"}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-800 hover:bg-navy-50 focus:ring-2 focus:ring-institutional-100 outline-none transition-all disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.98 6.98 0 015.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 001 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-navy-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-300 focus:border-institutional-500 focus:ring-2 focus:ring-institutional-100 outline-none transition-all"
                placeholder="you@organization.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-navy-900 placeholder:text-navy-300 focus:border-institutional-500 focus:ring-2 focus:ring-institutional-100 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-lg bg-institutional-700 px-4 py-2.5 font-medium text-white hover:bg-institutional-800 focus:ring-2 focus:ring-institutional-200 outline-none transition-all disabled:opacity-60"
            >
              {loading
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-navy-500">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setNotice(null);
                  }}
                  className="font-medium text-institutional-700 hover:text-institutional-800"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setNotice(null);
                  }}
                  className="font-medium text-institutional-700 hover:text-institutional-800"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-navy-400">
          Polis Systems — Making the invisible visible.
        </p>
      </div>
    </div>
  );
}
