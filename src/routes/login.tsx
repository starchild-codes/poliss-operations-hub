import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">(
    search.mode ?? "signin",
  );

  if (session) {
    navigate({ to: "/dashboard" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
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

            <button
              type="submit"
              disabled={loading}
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
