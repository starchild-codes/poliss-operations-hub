import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth, type AuthContextType } from "@/lib/auth";

type RouterContext = {
  auth: AuthContextType;
};

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.navigate({ to: "/login" });
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50">
        <div className="text-navy-400 text-sm font-medium">Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
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
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      )}
    </div>
  );
}
