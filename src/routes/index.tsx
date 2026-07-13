import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Plus, ArrowUpRight, MapPin, Clock, CheckCircle2, Users } from "lucide-react";
import { kpis, tasks, submissions, weeklyCompleted, zoneBreakdown } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Polis Systems" },
      { name: "description", content: "At-a-glance view of cleanup operations, active tasks, and reviews." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const max = Math.max(...weeklyCompleted.map((d) => d.value));

  return (
    <>
      <PageHeader
        title="Overview"
        description="Monday, 13 July 2026 · Bengaluru pilot"
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New task
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Active tasks" value={kpis.activeTasks} icon={<Clock className="h-4 w-4" />} delta="+4 vs yesterday" />
          <Kpi label="Awaiting review" value={kpis.awaitingReview} icon={<ArrowUpRight className="h-4 w-4" />} delta="2 urgent" tone="warning" />
          <Kpi label="Completed today" value={kpis.completedToday} icon={<CheckCircle2 className="h-4 w-4" />} delta="+11%" tone="primary" />
          <Kpi label="Active collectors" value={kpis.activeCollectors} icon={<Users className="h-4 w-4" />} delta="of 38 total" />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Completed tasks this week</h2>
                <p className="text-xs text-muted-foreground">Rolling 7 days across all zones</p>
              </div>
              <span className="text-xs text-muted-foreground">168 total</span>
            </div>
            <div className="flex items-end gap-3 px-4 pt-6 pb-4 h-48">
              {weeklyCompleted.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-primary/85 transition-all hover:bg-primary"
                      style={{ height: `${(d.value / max) * 100}%` }}
                      title={`${d.value} tasks`}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Zones</h2>
              <p className="text-xs text-muted-foreground">Open vs completed</p>
            </div>
            <ul className="divide-y divide-border">
              {zoneBreakdown.map((z) => {
                const total = z.open + z.done;
                const pct = (z.done / total) * 100;
                return (
                  <li key={z.zone} className="px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{z.zone}</span>
                      <span className="text-xs text-muted-foreground">
                        {z.done}/{total}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Recent tasks</h2>
              <Button variant="ghost" size="sm" className="h-7 text-xs">View all</Button>
            </div>
            <div className="divide-y divide-border">
              {tasks.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium text-foreground">{t.title}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {t.location} · {t.zone}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    <div>{t.assignee ?? "Unassigned"}</div>
                    <div>Due {t.dueAt.split(" ")[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Awaiting review</h2>
              <p className="text-xs text-muted-foreground">{submissions.filter((s) => s.status === "pending").length} pending</p>
            </div>
            <ul className="divide-y divide-border">
              {submissions.slice(0, 4).map((s) => (
                <li key={s.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{s.taskId}</span>
                    <span>·</span>
                    <span>{s.zone}</span>
                  </div>
                  <div className="mt-0.5 truncate text-sm font-medium text-foreground">{s.taskTitle}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">by {s.collector}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  icon,
  delta,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  delta?: string;
  tone?: "default" | "primary" | "warning";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "warning"
      ? "text-warning"
      : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={toneClass}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {delta && <div className={`mt-1 text-xs ${toneClass}`}>{delta}</div>}
    </div>
  );
}
