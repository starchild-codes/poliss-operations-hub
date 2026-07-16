import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import polisLogo from "@/assets/polis-logo.jpeg.asset.json";

const nav = [
  { title: "Overview", url: "/overview", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: ClipboardList },
  { title: "Review", url: "/review", icon: ShieldCheck },
  { title: "Collectors", url: "/collectors", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2.5 px-1.5 py-2">
          <img
            src={polisLogo.url}
            alt="Polis Systems logo"
            className="h-9 w-9 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-sidebar-border"
          />
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-white">
                Polis Systems
              </div>
              <div className="truncate text-[11px] text-sidebar-foreground/70">
                Operations Platform
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-foreground/60">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active =
                  item.url === "/overview" ? pathname === "/overview" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        "group h-9 rounded-md text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-white data-[active=true]:bg-transparent data-[active=true]:text-white " +
                        (active
                          ? "relative before:absolute before:left-0 before:top-1.5 before:h-6 before:w-[3px] before:rounded-r before:bg-info"
                          : "")
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-[17px] w-[17px] shrink-0" />
                        <span className="text-[13px] font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar">
        {!collapsed && (
          <div className="px-2 py-2 text-[11px] text-sidebar-foreground/60">
            Bengaluru pilot · v0.1
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
