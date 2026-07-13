import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collectors } from "@/lib/mock-data";
import { Plus, Star } from "lucide-react";

export const Route = createFileRoute("/collectors")({
  head: () => ({
    meta: [
      { title: "Collectors — Polis Systems" },
      { name: "description", content: "Manage the field workforce collecting waste across zones." },
    ],
  }),
  component: CollectorsPage,
});

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function CollectorsPage() {
  return (
    <>
      <PageHeader
        title="Collectors"
        description={`${collectors.filter((c) => c.active).length} active · ${collectors.length} total`}
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add collector
          </Button>
        }
      />

      <div className="p-6">
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Collector</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectors.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary-dark">
                          {initials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-sm text-foreground">{c.zone}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 text-xs " +
                        (c.active ? "text-primary" : "text-muted-foreground")
                      }
                    >
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (c.active ? "bg-primary" : "bg-muted-foreground/50")
                        }
                      />
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-foreground">{c.tasksCompleted}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">
                    <span className="inline-flex items-center gap-1 text-sm text-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {c.rating.toFixed(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
