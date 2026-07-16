import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PriorityLabel } from "@/components/status-badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, X, ClipboardCheck, Clock3, CheckCircle2, XCircle, Timer,
} from "lucide-react";
import { toast } from "sonner";
import {
  collectors, formatFriendlyDateTime, isTaskOverdue,
  computeSubmissionCounts, computeAverageReviewMinutes,
  type Zone, type Priority, type RejectionReason,
} from "@/lib/mock-data";
import { useTaskStore } from "@/lib/task-store";
import { useSubmissionStore, submissionStoreActions, type SubmissionWithChecklist } from "@/lib/submission-store";
import { SubmissionDetailDrawer } from "@/components/review/submission-detail-drawer";

export const Route = createFileRoute("/review")({
  validateSearch: (search: Record<string, unknown>) => ({
    taskId: typeof search.taskId === "string" ? search.taskId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Submission Review — Polis Systems" },
      { name: "description", content: "Verify cleanup evidence and approve or return field submissions." },
    ],
  }),
  component: ReviewPage,
});

function nowIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 5);
}

type ReviewTab = "pending" | "approved" | "rejected" | "all";
type DateFilter = "any" | "today" | "week";

function dateKeyOf(dateStr: string): string {
  return dateStr.slice(0, 10);
}

function formatMinutes(mins: number): string {
  if (mins <= 0) return "—";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

function ReviewPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const submissions = useSubmissionStore();

  const [tab, setTab] = useState<ReviewTab>("pending");
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<Zone | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [reviewStatus, setReviewStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Deep-link support: Overview's "Review" link and the Tasks drawer's "Review submission"
  // button both navigate here with ?taskId=..., so open the matching submission automatically
  // and jump to the tab that actually contains it.
  useEffect(() => {
    if (!search.taskId) return;
    const match = submissions.find((s) => s.taskId === search.taskId);
    if (!match) return;
    setTab(match.status === "pending" ? "pending" : match.status === "approved" ? "approved" : "rejected");
    setSelectedId(match.id);
    setDrawerOpen(true);
  }, [search.taskId]);

  const counts = computeSubmissionCounts(submissions);
  const avgReviewMinutes = computeAverageReviewMinutes(submissions);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (tab !== "all" && s.status !== tab) return false;
      if (reviewStatus !== "all" && s.status !== reviewStatus) return false;
      if (zone !== "all" && s.zone !== zone) return false;
      if (priority !== "all" && s.priority !== priority) return false;
      if (dateFilter !== "any") {
        const submittedKey = dateKeyOf(s.submittedAt);
        const todayKey = dateKeyOf(nowIso());
        if (dateFilter === "today" && submittedKey !== todayKey) return false;
        if (dateFilter === "week") {
          const diffDays = (new Date(todayKey).getTime() - new Date(submittedKey).getTime()) / 86_400_000;
          if (diffDays < 0 || diffDays > 7) return false;
        }
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = `${s.taskTitle} ${s.collector} ${s.zone} ${s.wasteType}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.submittedAt.replace(" ", "T")).getTime() - new Date(a.submittedAt.replace(" ", "T")).getTime());
  }, [submissions, tab, reviewStatus, zone, priority, dateFilter, query]);

  const hasActiveFilters = query.trim() !== "" || zone !== "all" || priority !== "all" || reviewStatus !== "all" || dateFilter !== "any";

  function clearFilters() {
    setQuery("");
    setZone("all");
    setPriority("all");
    setReviewStatus("all");
    setDateFilter("any");
  }

  function openSubmission(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  function closeDrawer(open: boolean) {
    setDrawerOpen(open);
    if (!open && search.taskId) {
      navigate({ to: "/review", search: { taskId: undefined } });
    }
  }

  const selected: SubmissionWithChecklist | null = submissions.find((s) => s.id === selectedId) ?? null;
  const selectedTask = selected ? tasks.find((t) => t.id === selected.taskId) : undefined;
  const selectedCollector = selected ? collectors.find((c) => c.name === selected.collector) : undefined;

  function handleApprove() {
    if (!selected) return;
    submissionStoreActions.approve(selected.id, nowIso());
    toast.success("Submission approved", { description: `${selected.taskTitle} marked as approved.` });
    closeDrawer(false);
  }

  function handleReject(reason: RejectionReason, note: string | undefined) {
    if (!selected) return;
    submissionStoreActions.reject(selected.id, reason, note, nowIso());
    toast.error("Submission rejected", { description: `${selected.taskTitle} returned to ${selected.collector}.` });
    closeDrawer(false);
  }

  const emptyState = (() => {
    if (hasActiveFilters && filtered.length === 0) {
      return { title: "No submissions match your filters", description: "Try adjusting search, zone, priority, or date filters.", showClear: true };
    }
    if (tab === "pending") return { title: "All caught up", description: "No submissions are waiting for review. New field proof will appear here when collectors complete tasks." };
    if (tab === "approved") return { title: "No approved submissions yet", description: "Approved submissions will appear here once you review pending proof of work." };
    if (tab === "rejected") return { title: "No rejected submissions", description: "Returned submissions will appear here if proof of work needs revision." };
    return { title: "No submissions found", description: "Submissions will appear here once collectors submit proof of work." };
  })();

  return (
    <>
      <PageHeader title="Submission Review" description="Verify cleanup evidence and approve or return field submissions" />

      <div className="space-y-4 p-5">
        {/* Summary metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Awaiting Review" value={counts.pending} icon={<Clock3 className="h-4 w-4" />} tone="warning" />
          <MetricCard label="Approved" value={counts.approved} icon={<CheckCircle2 className="h-4 w-4" />} tone="success" />
          <MetricCard label="Rejected" value={counts.rejected} icon={<XCircle className="h-4 w-4" />} tone="destructive" />
          <MetricCard label="Average Review Time" value={formatMinutes(avgReviewMinutes)} icon={<Timer className="h-4 w-4" />} />
        </section>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as ReviewTab)}>
          <TabsList>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
            <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search + filters */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search task, collector, zone, or waste type"
              className="h-8 pl-8 text-sm"
            />
          </div>
          <Select value={zone} onValueChange={(v) => setZone(v as Zone | "all")}>
            <SelectTrigger className="h-8 w-[120px] text-sm"><SelectValue placeholder="Zone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              {(["North", "South", "East", "West", "Central"] as Zone[]).map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
            <SelectTrigger className="h-8 w-[130px] text-sm"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={reviewStatus} onValueChange={(v) => setReviewStatus(v as typeof reviewStatus)}>
            <SelectTrigger className="h-8 w-[150px] text-sm"><SelectValue placeholder="Review status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="h-8 w-[150px] text-sm"><SelectValue placeholder="Submission date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past 7 days</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>

        {/* Submission queue */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-5 w-5" />}
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.showClear ? <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button> : undefined}
          />
        ) : (
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Collector</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Waste type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Review status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const task = tasks.find((t) => t.id === s.taskId);
                  const overdue = task ? isTaskOverdue(task) : false;
                  return (
                    <TableRow key={s.id} className="cursor-pointer" onClick={() => openSubmission(s.id)}>
                      <TableCell className="font-medium text-foreground">
                        {s.taskTitle}
                        {overdue && s.status === "pending" && <span className="ml-1.5 text-[11px] text-warning">Overdue task</span>}
                      </TableCell>
                      <TableCell>{s.collector}</TableCell>
                      <TableCell>{s.zone}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatFriendlyDateTime(s.submittedAt)}</TableCell>
                      <TableCell>{s.wasteType}</TableCell>
                      <TableCell>{s.quantityKg} kg</TableCell>
                      <TableCell><PriorityLabel priority={s.priority} /></TableCell>
                      <TableCell><ReviewStatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); openSubmission(s.id); }}
                        >
                          {s.status === "pending" ? "Review" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <SubmissionDetailDrawer
        submission={selected}
        task={selectedTask}
        collector={selectedCollector}
        open={drawerOpen}
        onOpenChange={closeDrawer}
        onToggleChecklist={(key) => selected && submissionStoreActions.toggleChecklistItem(selected.id, key)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

function ReviewStatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "pending") return <StatusBadge status="submitted" />;
  if (status === "approved") return <StatusBadge status="approved" />;
  return <StatusBadge status="rejected" />;
}

function MetricCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone?: "default" | "warning" | "success" | "destructive";
}) {
  const toneClass = { default: "text-muted-foreground", warning: "text-warning", success: "text-success", destructive: "text-destructive" }[tone];
  return (
    <div className="rounded-md border border-border bg-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={toneClass}>{icon}</span>
      </div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}
