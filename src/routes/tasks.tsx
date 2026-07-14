import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  computeAssignableCollectors, formatFriendlyDate, isTaskOverdue,
  type TaskStatus, type Zone, type Priority, type Task,
} from "@/lib/mock-data";
import { useTaskStore, taskStoreActions, type NewTaskInput } from "@/lib/task-store";
import { useCollectorStore } from "@/lib/collector-store";
import { CreateTaskSheet } from "@/components/tasks/create-task-sheet";
import { TaskDetailDrawer } from "@/components/tasks/task-detail-drawer";
import { Plus, Search, X, ListFilter, MoreHorizontal, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Cleanup Tasks — Polis Systems" },
      { name: "description", content: "Create, assign, and monitor field cleanup operations." },
    ],
  }),
  component: TasksPage,
});

type DateFilter = "any" | "overdue" | "today" | "week";

function nowIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 5);
}

const SUMMARY_CHIPS: { key: string; label: string; match: (t: Task, overdue: boolean) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "open", label: "Draft", match: (t) => t.status === "open" },
  { key: "assigned", label: "Assigned", match: (t) => t.status === "assigned" },
  { key: "in_progress", label: "In Progress", match: (t) => t.status === "in_progress" },
  { key: "submitted", label: "Awaiting Review", match: (t) => t.status === "submitted" },
  { key: "approved", label: "Approved", match: (t) => t.status === "approved" },
  { key: "overdue", label: "Overdue", match: (_t, overdue) => overdue },
];

function TasksPage() {
  const { tasks } = useTaskStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [collectorFilter, setCollectorFilter] = useState<string>("all");
  const [zone, setZone] = useState<Zone | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [activeChip, setActiveChip] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const collectors = useCollectorStore();
  const collectorNames = useMemo(() => Array.from(new Set(collectors.map((c) => c.name))), [collectors]);
  const assignableCollectorNames = useMemo(() => computeAssignableCollectors(collectors).map((c) => c.name), [collectors]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const overdue = isTaskOverdue(t);
      const chip = SUMMARY_CHIPS.find((c) => c.key === activeChip);
      if (chip && !chip.match(t, overdue)) return false;
      if (status !== "all" && t.status !== status) return false;
      if (collectorFilter !== "all" && t.assignee !== collectorFilter) return false;
      if (zone !== "all" && t.zone !== zone) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (dateFilter === "overdue" && !overdue) return false;
      if (dateFilter === "today" && t.dueAt.slice(0, 10) !== nowIso().slice(0, 10)) return false;
      if (dateFilter === "week") {
        const due = new Date(t.dueAt.replace(" ", "T")).getTime();
        const now = Date.now();
        if (due < now || due > now + 7 * 86_400_000) return false;
      }
      if (query) {
        const haystack = `${t.title} ${t.location} ${t.assignee ?? ""} ${t.id}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [tasks, query, status, collectorFilter, zone, priority, dateFilter, activeChip]);

  const filtersActive = status !== "all" || collectorFilter !== "all" || zone !== "all" || priority !== "all" || dateFilter !== "any" || query !== "" || activeChip !== "all";

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setCollectorFilter("all");
    setZone("all");
    setPriority("all");
    setDateFilter("any");
    setActiveChip("all");
  }

  function openDrawer(task: Task) {
    setSelectedTask(task);
    setDrawerOpen(true);
  }

  function handleCreate(input: NewTaskInput) {
    const task = taskStoreActions.createTask(input, nowIso());
    toast.success("Task created", { description: `${task.title} was added${task.assignee ? ` and assigned to ${task.assignee}` : " as a draft"}.` });
  }

  function handleEdit(taskId: string, patch: Partial<NewTaskInput>) {
    taskStoreActions.editTask(taskId, patch, nowIso());
    toast.success("Task updated");
  }

  function handleDrawerAction(action: "edit" | "assign" | "reassign" | "cancel" | "resubmit" | "export", collector?: string) {
    if (!selectedTask) return;
    const now = nowIso();
    if (action === "edit") {
      setEditingTask(selectedTask);
      setDrawerOpen(false);
      setCreateOpen(true);
      return;
    }
    if (action === "assign" && collector) {
      taskStoreActions.assignCollector(selectedTask.id, collector, now);
      toast.success("Collector assigned", { description: `${selectedTask.title} assigned to ${collector}.` });
    }
    if (action === "reassign" && collector) {
      taskStoreActions.reassignCollector(selectedTask.id, collector, now);
      toast.success("Collector reassigned", { description: `${selectedTask.title} is now with ${collector}.` });
    }
    if (action === "cancel") {
      taskStoreActions.cancelTask(selectedTask.id, now);
      toast("Task canceled", { description: `${selectedTask.title} was canceled.` });
      setDrawerOpen(false);
    }
    if (action === "resubmit") {
      taskStoreActions.requestResubmission(selectedTask.id, now);
      toast.success("Resubmission requested", { description: `${selectedTask.assignee ?? "The collector"} will be notified.` });
    }
    if (action === "export") {
      toast.success("Record exported", { description: "A summary export would be generated here in production." });
    }
    const refreshed = tasks.find((t) => t.id === selectedTask.id);
    if (refreshed) setSelectedTask(refreshed);
  }

  function confirmQuickCancel() {
    if (!cancelTargetId) return;
    taskStoreActions.cancelTask(cancelTargetId, nowIso());
    toast("Task canceled");
    setCancelTargetId(null);
  }

  const liveSelectedTask = selectedTask ? tasks.find((t) => t.id === selectedTask.id) ?? selectedTask : null;

  return (
    <>
      <PageHeader
        title="Cleanup Tasks"
        description="Create, assign, and monitor field cleanup operations"
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => { setEditingTask(null); setCreateOpen(true); }}>
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        }
      />

      <div className="space-y-4 p-5">
        {/* Summary strip */}
        <div className="flex flex-wrap gap-2">
          {SUMMARY_CHIPS.map((chip) => {
            const count = tasks.filter((t) => chip.match(t, isTaskOverdue(t))).length;
            const active = activeChip === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setActiveChip(active ? "all" : chip.key)}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary-dark"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {chip.key === "overdue" && <AlertTriangle className="h-3 w-3" />}
                {chip.label}
                <span className="tabular-nums text-foreground">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
          <div className="relative min-w-0 flex-1 basis-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location, or collector"
              className="h-9 pl-8"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus | "all")}>
            <SelectTrigger className="h-9 w-[9.5rem]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Draft</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={collectorFilter} onValueChange={setCollectorFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Collector" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All collectors</SelectItem>
              {collectorNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={zone} onValueChange={(v) => setZone(v as Zone | "all")}>
            <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Zone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              <SelectItem value="North">North</SelectItem>
              <SelectItem value="South">South</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="West">West</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
            <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Due date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any due date</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="week">Due this week</SelectItem>
            </SelectContent>
          </Select>
          {filtersActive && (
            <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <ListFilter className="h-3.5 w-3.5" /> {filtered.length} of {tasks.length} tasks
          </span>
        </div>

        {/* Table */}
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first cleanup task to start assigning field work."
            action={<Button size="sm" onClick={() => { setEditingTask(null); setCreateOpen(true); }}>Create Task</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No tasks match your filters"
            description="Try adjusting or clearing your filters to see more tasks."
            action={<Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <div className="overflow-auto rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[200px]">Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Hotspot type</TableHead>
                  <TableHead>Assigned collector</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => {
                  const overdue = isTaskOverdue(t);
                  return (
                    <TableRow key={t.id} className="cursor-pointer" onClick={() => openDrawer(t)}>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">{t.title}</div>
                        <div className="text-xs text-muted-foreground">{t.location}</div>
                      </TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell><PriorityLabel priority={t.priority} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.hotspotType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.assignee ?? <span className="italic">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.zone}</TableCell>
                      <TableCell className={overdue ? "text-xs font-medium text-destructive" : "text-xs text-muted-foreground"}>
                        <span className="inline-flex items-center gap-1">
                          {overdue && <AlertTriangle className="h-3 w-3" />}
                          {formatFriendlyDate(t.dueAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatFriendlyDate(t.updatedAt)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDrawer(t)}>View details</DropdownMenuItem>
                            {t.status === "open" && (
                              <DropdownMenuItem onClick={() => { setEditingTask(t); setCreateOpen(true); }}>Edit</DropdownMenuItem>
                            )}
                            {(t.status === "open" || t.status === "assigned" || t.status === "declined") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setCancelTargetId(t.id)}
                                >
                                  Cancel task
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateTaskSheet
        open={createOpen}
        onOpenChange={(open) => { setCreateOpen(open); if (!open) setEditingTask(null); }}
        editingTask={editingTask}
        collectorOptions={assignableCollectorNames}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />

      <TaskDetailDrawer
        task={liveSelectedTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        collectors={computeAssignableCollectors()}
        onAction={handleDrawerAction}
      />

      <AlertDialog open={!!cancelTargetId} onOpenChange={(open) => !open && setCancelTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this task?</AlertDialogTitle>
            <AlertDialogDescription>This task will be marked canceled. This can't be undone from here.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep task</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmQuickCancel}
            >
              Cancel task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
