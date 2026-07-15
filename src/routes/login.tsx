import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import polisLogo from "@/assets/polis-logo.jpeg.asset.json";
import { Recycle, MapPin, ClipboardCheck, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Polis Systems" },
      { name: "description", content: "Sign in to the Polis Systems Operations Platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, session } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  async function handleGoogleSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Sign-in failed", { description: "Could not start Google sign-in." });
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Left: form */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2.5">
            <img
              src={polisLogo.url}
              alt="Polis Systems"
              className="h-10 w-10 rounded-full object-contain"
            />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight text-foreground">
                Polis Systems
              </div>
              <div className="text-[11px] text-muted-foreground">
                Operations Platform
              </div>
            </div>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Access your municipal or partner operations workspace.
          </p>

          <form onSubmit={handleGoogleSignIn} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Work email
              </Label>
              <Input
                id="email"
                type="email"
                required
                defaultValue="ananya.rao@bbmp.gov.in"
                className="h-10 bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                required
                defaultValue="••••••••"
                className="h-10 bg-card"
              />
            </div>

            <Button type="submit" className="h-10 w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-full border-border bg-card"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              Continue with organisation SSO
            </Button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            By continuing you agree to Polis Systems' terms and acknowledge our
            data-handling practices for municipal partners.
          </p>
        </div>
      </div>

      {/* Right: institutional panel */}
      <div className="relative hidden overflow-hidden bg-primary-dark text-white lg:block">
        <BackgroundMotif />
        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-14">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-info">
            <span className="h-px w-8 bg-info" />
            Civic infrastructure · Field operations
          </div>

          <div>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
              Coordinating cleaner cities, one verified pickup at a time.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Polis Systems helps municipalities, NGOs, and cleanup operators
              assign field tasks, review proof of work, and report on ground
              impact — with the auditability governments and funders expect.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
              <Stat icon={<MapPin className="h-4 w-4" />} label="Zones covered" value="24" />
              <Stat icon={<Users className="h-4 w-4" />} label="Active collectors" value="340+" />
              <Stat icon={<ClipboardCheck className="h-4 w-4" />} label="Verified pickups" value="18,290" />
              <Stat icon={<Recycle className="h-4 w-4" />} label="Waste diverted (t)" value="612" />
            </div>
          </div>

          <div className="text-[11px] text-white/50">
            © 2026 Polis Systems · Bengaluru pilot deployment
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/60">
        <span className="text-info">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function BackgroundMotif() {
  // Subtle civic-infrastructure motif: layered concentric arcs + a light grid.
  // Purely inline SVG — no stock imagery.
  return (
    <>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-white/[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <svg
        aria-hidden
        className="absolute -bottom-40 -right-40 h-[560px] w-[560px] text-info/25"
        viewBox="0 0 200 200"
      >
        {[40, 60, 80, 100].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-dark to-[#0a2338]" />
    </>
  );
}
