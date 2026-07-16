import { Link, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { title: "Overview", url: "/overview" },
  { title: "Review", url: "/review" },
] as const;

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-3 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">Polis Systems</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">Operations Platform</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {nav.map((item) => {
          const active = pathname === item.url || pathname.startsWith(item.url + "/");
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white",
              )}
            >
              {collapsed && <span className="mx-auto">{item.title[0]}</span>}
              {!collapsed && item.title}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-sidebar-border px-3 py-2 text-[11px] text-sidebar-foreground/50">
          Bengaluru pilot · v0.1
        </div>
      )}
    </aside>
  );
}
