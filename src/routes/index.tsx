import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusBarColor } from "@/components/status-badge";
import {
  Plus,
  Download,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  MapPin,
  Send,
  XCircle,
} from "lucide-react";
import {
  openTasksCount,
  awaitingReviewCount,
  approvedTasksCount,
  activeCollectorsCount,
  totalCollectorsCount,
  completionRate,
  acceptanceRate,
  estimatedWasteCollectedKg,
  overdueTasksCount,
  cleanupActivity,
  taskStatusBreakdown,
  tasksNeedingReview,
  recentActivity,
  cleanupLocations,
  pendingRegistrationCount,
  collectorsAssignedTodayCount,
  collectorsAwaitingReviewCount,
  topCollectors,
  type ActivityItem,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Polis Systems" },
      { name: "description", content: "Monitor cleanup assignments, collector activity, and verified environmental impact." },
    ],
  }),
  component: OverviewPage,
});

function formatWaste(kg: number) {
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${kg} kg`;
}

function timeOnly(dateStr: string) {
  return dateStr.split(" ")[1] ?? dateStr;
}

const activityIcon: Record<ActivityItem["type"], React.ReactNode> = {
  assigned: <UserPlus className="h-3.5 w-3.5" />,
  accepted: <UserCheck className="h-3.5 w-3.5" />,
  declined: <UserX className="h-3.5 w-3.5" />,
  submitted: <Send className="h-3.5 w-3.5" />,
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
};

function OverviewPage() {
  const maxDailyValue = Math.max(1, ...cleanupActivity.flatMap((d) => [d.assigned, d.submitted, d.approved]));
  const totalStatusCount = Math.max(1, taskStatusBreakdown.reduce((s, x) => s + x.count, 0));

  return (
    <>
      <PageHeader
        title="Operations Overview"
        description="Monitor cleanup assignments, collector activity, and verified environmental impact"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/tasks">
                <Plus className="h-4 w-4" /> Create Task
              </Link>
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* Primary metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Open Tasks" value={openTasksCount} icon={<Clock className="h-4 w-4" />} />
          <Kpi label="Awaiting Review" value={awaitingReviewCount} icon={<ShieldCheck className="h-4 w-4" />} tone="warning" />
          <Kpi label="Approved Tasks" value={approvedTasksCount} icon={<CheckCircle2 className="h-4 w-4" />} tone="primary" />
          <Kpi label="Active Collectors" value={activeCollectorsCount} icon={<Users className="h-4 w-4" />} delta={`of ${totalCollectorsCount} total`} />
        </section>

        {/* Secondary metrics */}
        <section className="grid grid-cols-2 gap-3 rounded-md border border-border bg-card p-4 sm:grid-cols-4">
          <SecondaryStat label="Completion Rate" value={`${completionRate}%`} hint="Approved ÷ decided submissions" />
          <SecondaryStat label="Acceptance Rate" value={`${acceptanceRate}%`} hint="Accepted ÷ accepted + declined" />
          <SecondaryStat label="Est. Waste Collected" value={formatWaste(estimatedWasteCollectedKg)} hint="Sum of approved submissions" />
          <SecondaryStat label="Overdue Tasks" value={overdueTasksCount} hint="Past due, not yet resolved" tone={overdueTasksCount > 0 ? "warning" : "default"} />
        </section>

        {/* Cleanup activity + status breakdown */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Cleanup Activity</h2>
              <p className="text-xs text-muted-foreground">Assigned, submitted, and approved over the last 7 days</p>
            </div>
            <div className="px-4 pt-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Legend swatch="bg-primary-dark" label="Assigned" />
                <Legend swatch="bg-indigo" label="Submitted" />
                <Legend swatch="bg-teal" label="Approved" />
              </div>
            </div>
            <div className="flex gap-3 px-4 pb-4 pt-4 h-44">
              {cleanupActivity.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end justify-center gap-0.5">
                    <div className="w-2 rounded-t bg-primary-dark" style={{ height: `${(d.assigned / maxDailyValue) * 100}%` }} title={`${d.assigned} assigned`} />
                    <div className="w-2 rounded-t bg-indigo" style={{ height: `${(d.submitted / maxDailyValue) * 100}%` }} title={`${d.submitted} submitted`} />
                    <div className="w-2 rounded-t bg-teal" style={{ height: `${(d.approved / maxDailyValue) * 100}%` }} title={`${d.approved} approved`} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Task Status Breakdown</h2>
              <p className="text-xs text-muted-foreground">{totalStatusCount} tasks in the pilot</p>
            </div>
            <div className="px-4 pt-4">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                {taskStatusBreakdown.filter((s) => s.count > 0).map((s) => (
                  <div
                    key={s.status}
                    className={statusBarColor[s.status]}
                    style={{ width: `${(s.count / totalStatusCount) * 100}%` }}
                    title={`${s.label}: ${s.count}`}
                  />
                ))}
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-1.5 p-4 pt-3 sm:grid-cols-2">
              {taskStatusBreakdown.map((s) => (
                <li key={s.status} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${statusBarColor[s.status]}`} />
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="ml-auto font-medium tabular-nums text-foreground">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tasks needing review */}
        <section className="rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Tasks Needing Review</h2>
              <p className="text-xs text-muted-foreground">Submitted proof awaiting your decision</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/review">View all</Link>
            </Button>
          </div>
          {tasksNeedingReview.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={<ShieldCheck className="h-5 w-5" />}
                title="No submissions awaiting review"
                description="New proof-of-work will appear here when collectors submit via WhatsApp."
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tasksNeedingReview.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{s.taskTitle}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                      <span>{s.collector}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.zone}</span>
                      <span>·</span>
                      <span>Submitted {timeOnly(s.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {s.wasteType} · {s.quantityKg} kg
                  </div>
                  <div className="shrink-0 text-xs font-medium capitalize text-foreground">{s.priority}</div>
                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <Link to="/review" search={{ taskId: s.taskId }}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity + cleanup locations */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No recent activity" description="Activity will appear here as tasks move through the pipeline." />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2.5 px-4 py-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                      {activityIcon[a.type]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{a.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Cleanup Locations</h2>
              <p className="text-xs text-muted-foreground">Pilot zones · open vs. completed</p>
            </div>
            <ul className="divide-y divide-border">
              {cleanupLocations.map((z) => (
                <li key={z.zone} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <span className="w-20 shrink-0 text-sm font-medium text-foreground">{z.zone}</span>
                  <span className="text-xs text-muted-foreground">{z.openTasks} open</span>
                  <span className="text-xs text-muted-foreground">{z.completedTasks} completed</span>
                  <span className="text-xs text-muted-foreground">Hotspot: {z.hotspotType}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
                    {z.highestPriorityTask ? `Top priority: ${z.highestPriorityTask}` : "No open tasks"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collector activity */}
        <section className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Collector Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 border-b border-border p-4 sm:grid-cols-4">
            <SecondaryStat label="Active Collectors" value={activeCollectorsCount} />
            <SecondaryStat label="Pending Registration" value={pendingRegistrationCount} />
            <SecondaryStat label="Assigned Today" value={collectorsAssignedTodayCount} />
            <SecondaryStat label="Awaiting Review" value={collectorsAwaitingReviewCount} />
          </div>
          <ul className="divide-y divide-border">
            {topCollectors.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="w-36 shrink-0 truncate text-sm font-medium text-foreground">{c.name}</span>
                <span className="w-16 shrink-0 text-xs text-muted-foreground">{c.zone}</span>
                <span className="text-xs text-muted-foreground">{c.tasksCompleted} completed</span>
                <span className="text-xs text-muted-foreground">{c.approvalRate}% approval</span>
                <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
                  Last active {c.lastActiveAt}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${swatch}`} />
      {label}
    </span>
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

function SecondaryStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "warning";
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold tracking-tight ${tone === "warning" ? "text-warning" : "text-foreground"}`}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
