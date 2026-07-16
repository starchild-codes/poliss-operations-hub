import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth, type AuthContextType } from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";

type RouterContext = {
  auth: AuthContextType;
};

function AccessPendingScreen({
  email,
  role,
  onSignOut,
}: {
  email: string | null;
  role: string | null;
  onSignOut: () => void;
}) {
  const suspended = role && role !== "pending";
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-institutional-50 text-institutional-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 4h.01M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zM7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-navy-950">
          {suspended ? "Access not permitted" : "Access pending approval"}
        </h1>
        <p className="mt-2 text-sm text-navy-500">
          {suspended
            ? "Your account does not have permission to open the Polis Systems dashboard. Contact your administrator if you believe this is a mistake."
            : "Your account is signed in but has not been granted access to the dashboard yet. An administrator needs to approve you as an operator or admin."}
        </p>
        {email && (
          <p className="mt-4 text-xs text-navy-400">
            Signed in as <span className="font-medium text-navy-600">{email}</span>
          </p>
        )}
        <button
          onClick={onSignOut}
          className="mt-6 w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const { loading, session, profile, profileLoading, isAuthorized, signOut, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.navigate({ to: "/login", search: { mode: "signin" } });
    }
  }, [loading, session, router]);

  if (loading || (session && profileLoading && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50">
        <div className="text-navy-400 text-sm font-medium">Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  if (!isAuthorized) {
    return (
      <AccessPendingScreen
        email={user?.email ?? null}
        role={profile?.role ?? null}
        onSignOut={() => {
          void signOut().then(() =>
            router.navigate({ to: "/login", search: { mode: "signin" } }),
          );
        }}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
          <AppHeader />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context }) => ({
    auth: context.auth,
  }),
  component: () => <RootComponent />,
});

function RootComponent() {
  const location = useRouterState({ select: (s) => s.location });

  const isPublicRoute =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="min-h-screen bg-white">
      {isPublicRoute ? (
        <Outlet />
      ) : (
        <ProtectedShell>
          <Outlet />
        </ProtectedShell>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
