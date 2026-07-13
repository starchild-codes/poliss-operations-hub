import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-3 sm:px-5">
      <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-primary-dark" />

      <div className="relative ml-1 hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks, collectors, zones…"
          className="h-9 rounded-md border-border bg-surface pl-9 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-1 focus-visible:ring-primary/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:bg-surface hover:text-primary-dark"
          onClick={() =>
            toast("3 new notifications", { description: "2 submissions pending review" })
          }
          aria-label="Notifications"
        >
          <Bell className="h-[17px] w-[17px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-card" />
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 rounded-md px-1.5 py-1 hover:bg-surface"
              aria-label="Profile menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-dark text-[11px] font-semibold text-white">
                  AN
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold leading-tight text-foreground">
                  Ananya Rao
                </div>
                <div className="text-[11px] leading-tight text-muted-foreground">
                  Operations Lead
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Signed in as Ananya
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
