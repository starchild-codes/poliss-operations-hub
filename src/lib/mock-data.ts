export type Zone = "North" | "South" | "East" | "West" | "Central";

export type TaskStatus =
  | "open"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "submitted"
  | "approved"
  | "declined"
  | "rejected"
  | "canceled";
export type Priority = "low" | "medium" | "high" | "urgent";
export type WasteType = "Mixed Municipal" | "Plastic" | "Organic" | "Construction Debris" | "E-Waste" | "Sewage/Sludge";

export interface Collector {
  id: string;
  name: string;
  phone: string;
  zone: Zone;
  active: boolean;
  tasksCompleted: number;
  rating: number;
  /** Historical proof-review approval rate for this collector (0-100). */
  approvalRate: number;
  lastActiveAt: string;
  /** Present only for collectors who have signed up but not yet been approved to take tasks. */
  registrationStatus?: "pending";
}

export interface Task {
  id: string;
  title: string;
  location: string;
  zone: Zone;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  createdAt: string;
  dueAt: string;
  wasteType: WasteType;
  /** Estimated kilograms of waste for this task. */
  estimatedWasteKg: number;
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  collector: string;
  zone: Zone;
  priority: Priority;
  wasteType: WasteType;
  quantityKg: number;
  submittedAt: string;
  /** When a reviewer approved or rejected the submission. Undefined while pending. */
  decidedAt?: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
}

// Fixed "now" for this pilot snapshot so derived metrics (overdue, daily trends) are deterministic.
export const NOW = "2026-07-13 12:00";

// Base collector info. `tasksCompleted` and `approvalRate` are NOT hardcoded here — they are
// derived below from the actual tasks/submissions in this pilot, so they always reconcile with
// what the rest of the dashboard shows (a ~22-task pilot cannot produce collectors with 100+
// completions).
const collectorsBase: Omit<Collector, "tasksCompleted" | "approvalRate">[] = [
  { id: "C-101", name: "Ravi Kumar", phone: "+91 98450 12034", zone: "North", active: true, rating: 4.7, lastActiveAt: "2026-07-13 08:10" },
  { id: "C-102", name: "Anita Sharma", phone: "+91 98860 23112", zone: "South", active: true, rating: 4.5, lastActiveAt: "2026-07-12 19:40" },
  { id: "C-103", name: "Mohammed Irfan", phone: "+91 99012 55461", zone: "East", active: true, rating: 4.8, lastActiveAt: "2026-07-12 18:20" },
  { id: "C-104", name: "Sunita Patil", phone: "+91 98221 88720", zone: "West", active: false, rating: 4.2, lastActiveAt: "2026-07-05 10:00" },
  { id: "C-105", name: "Deepak Yadav", phone: "+91 97401 33298", zone: "Central", active: true, rating: 4.9, lastActiveAt: "2026-07-13 11:05" },
  { id: "C-106", name: "Priya Menon", phone: "+91 98470 91123", zone: "South", active: true, rating: 4.4, lastActiveAt: "2026-07-12 12:20" },
  { id: "C-107", name: "Arjun Reddy", phone: "+91 96320 42200", zone: "East", active: true, rating: 4.3, lastActiveAt: "2026-07-09 11:00" },
  { id: "C-108", name: "Kavita Joshi", phone: "+91 98191 77340", zone: "North", active: true, rating: 4.6, lastActiveAt: "2026-07-13 09:35" },
  { id: "C-109", name: "Farhan Sheikh", phone: "+91 90080 44210", zone: "East", active: false, rating: 0, lastActiveAt: "—", registrationStatus: "pending" },
  { id: "C-110", name: "Meera Nair", phone: "+91 90210 66531", zone: "South", active: false, rating: 0, lastActiveAt: "—", registrationStatus: "pending" },
];

export const tasks: Task[] = [
  { id: "T-2041", title: "Garbage overflow near bus stand", location: "MG Road, Ward 12", zone: "Central", status: "submitted", priority: "high", assignee: "Deepak Yadav", createdAt: "2026-07-11 09:14", dueAt: "2026-07-13 18:00", wasteType: "Mixed Municipal", estimatedWasteKg: 180 },
  { id: "T-2042", title: "Illegal dumping cleanup", location: "Yeshwanthpur Industrial Area", zone: "North", status: "in_progress", priority: "urgent", assignee: "Ravi Kumar", createdAt: "2026-07-12 07:22", dueAt: "2026-07-13 12:00", wasteType: "Construction Debris", estimatedWasteKg: 620 },
  { id: "T-2043", title: "Clogged storm drain", location: "Koramangala 5th Block", zone: "South", status: "assigned", priority: "medium", assignee: "Anita Sharma", createdAt: "2026-07-12 10:03", dueAt: "2026-07-14 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 95 },
  { id: "T-2044", title: "Construction debris removal", location: "Whitefield Main Road", zone: "East", status: "open", priority: "medium", createdAt: "2026-07-12 11:41", dueAt: "2026-07-15 12:00", wasteType: "Construction Debris", estimatedWasteKg: 340 },
  { id: "T-2045", title: "Market waste pile-up", location: "KR Market, Stall Row 4", zone: "Central", status: "submitted", priority: "high", assignee: "Deepak Yadav", createdAt: "2026-07-11 18:32", dueAt: "2026-07-13 09:00", wasteType: "Organic", estimatedWasteKg: 210 },
  { id: "T-2046", title: "Plastic dump near lake", location: "Bellandur Lake, East Bund", zone: "East", status: "rejected", priority: "high", assignee: "Mohammed Irfan", createdAt: "2026-07-10 14:00", dueAt: "2026-07-12 18:00", wasteType: "Plastic", estimatedWasteKg: 150 },
  { id: "T-2047", title: "School premises cleanup", location: "Govt. School, Rajajinagar", zone: "West", status: "approved", priority: "low", assignee: "Sunita Patil", createdAt: "2026-07-09 08:15", dueAt: "2026-07-11 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 60 },
  { id: "T-2048", title: "Temple street sweep", location: "Malleshwaram 8th Cross", zone: "North", status: "in_progress", priority: "low", assignee: "Kavita Joshi", createdAt: "2026-07-12 06:40", dueAt: "2026-07-14 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 40 },
  { id: "T-2049", title: "Sewage overflow report", location: "HSR Layout Sector 2", zone: "South", status: "assigned", priority: "urgent", assignee: "Priya Menon", createdAt: "2026-07-12 12:20", dueAt: "2026-07-13 20:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 500 },
  { id: "T-2050", title: "Roadside garbage bin damaged", location: "Indiranagar 100ft Road", zone: "East", status: "open", priority: "low", createdAt: "2026-07-12 13:00", dueAt: "2026-07-16 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 25 },
  { id: "T-2051", title: "Public toilet cleanup", location: "Majestic Bus Terminal", zone: "Central", status: "canceled", priority: "medium", createdAt: "2026-07-10 09:00", dueAt: "2026-07-12 18:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 80 },

  { id: "T-2052", title: "Riverside plastic cleanup", location: "Hebbal Lake Bund", zone: "North", status: "accepted", priority: "high", assignee: "Ravi Kumar", createdAt: "2026-07-07 09:00", dueAt: "2026-07-14 12:00", wasteType: "Plastic", estimatedWasteKg: 300 },
  { id: "T-2053", title: "Park litter collection", location: "Sankey Tank Park", zone: "North", status: "accepted", priority: "medium", assignee: "Kavita Joshi", createdAt: "2026-07-08 10:00", dueAt: "2026-07-15 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 70 },
  { id: "T-2054", title: "E-waste pickup request", location: "Whitefield Tech Park", zone: "East", status: "declined", priority: "medium", assignee: "Arjun Reddy", createdAt: "2026-07-09 11:00", dueAt: "2026-07-16 12:00", wasteType: "E-Waste", estimatedWasteKg: 120 },
  { id: "T-2055", title: "Community hall cleanup", location: "Jayanagar 4th Block", zone: "South", status: "assigned", priority: "low", assignee: "Priya Menon", createdAt: "2026-07-10 09:30", dueAt: "2026-07-17 12:00", wasteType: "Organic", estimatedWasteKg: 50 },
  { id: "T-2056", title: "Lakeside debris clearance", location: "Madiwala Lake", zone: "South", status: "in_progress", priority: "medium", assignee: "Anita Sharma", createdAt: "2026-07-11 08:00", dueAt: "2026-07-14 12:00", wasteType: "Construction Debris", estimatedWasteKg: 400 },
  { id: "T-2057", title: "Industrial estate cleanup", location: "Peenya Industrial Area", zone: "East", status: "submitted", priority: "high", assignee: "Mohammed Irfan", createdAt: "2026-07-10 07:00", dueAt: "2026-07-12 20:00", wasteType: "Construction Debris", estimatedWasteKg: 550 },
  { id: "T-2058", title: "Highway shoulder cleanup", location: "Tumkur Road Service Lane", zone: "North", status: "approved", priority: "medium", assignee: "Ravi Kumar", createdAt: "2026-07-07 08:00", dueAt: "2026-07-09 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 210 },
  { id: "T-2059", title: "Ward 5 plastic removal", location: "Shivajinagar Ward 5", zone: "Central", status: "approved", priority: "high", assignee: "Deepak Yadav", createdAt: "2026-07-08 09:00", dueAt: "2026-07-10 17:00", wasteType: "Plastic", estimatedWasteKg: 260 },
  { id: "T-2060", title: "Canal desilting support", location: "Vrishabhavathi Canal", zone: "Central", status: "approved", priority: "medium", assignee: "Deepak Yadav", createdAt: "2026-07-09 10:00", dueAt: "2026-07-11 17:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 700 },
  { id: "T-2061", title: "Community park cleanup", location: "Ejipura Park", zone: "South", status: "approved", priority: "low", assignee: "Anita Sharma", createdAt: "2026-07-11 09:00", dueAt: "2026-07-13 17:00", wasteType: "Organic", estimatedWasteKg: 90 },
  { id: "T-2062", title: "Railway underpass cleanup", location: "Yeshwanthpur Underpass", zone: "North", status: "approved", priority: "high", assignee: "Kavita Joshi", createdAt: "2026-07-13 08:00", dueAt: "2026-07-13 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 150 },
];

export const submissions: Submission[] = [
  { id: "S-511", taskId: "T-2041", taskTitle: "Garbage overflow near bus stand", collector: "Deepak Yadav", zone: "Central", priority: "high", wasteType: "Mixed Municipal", quantityKg: 180, submittedAt: "2026-07-12 16:22", status: "pending", note: "Cleared 3 bins, photos attached." },
  { id: "S-512", taskId: "T-2045", taskTitle: "Market waste pile-up", collector: "Deepak Yadav", zone: "Central", priority: "high", wasteType: "Organic", quantityKg: 210, submittedAt: "2026-07-12 17:04", status: "pending", note: "Stall row 4 cleared." },
  { id: "S-513", taskId: "T-2046", taskTitle: "Plastic dump near lake", collector: "Mohammed Irfan", zone: "East", priority: "high", wasteType: "Plastic", quantityKg: 150, submittedAt: "2026-07-11 15:40", decidedAt: "2026-07-11 16:00", status: "rejected", note: "Photos unclear, revisit needed." },
  { id: "S-514", taskId: "T-2047", taskTitle: "School premises cleanup", collector: "Sunita Patil", zone: "West", priority: "low", wasteType: "Mixed Municipal", quantityKg: 60, submittedAt: "2026-07-10 12:11", decidedAt: "2026-07-11 09:00", status: "approved", note: "Verified by ward officer." },
  { id: "S-515", taskId: "T-2057", taskTitle: "Industrial estate cleanup", collector: "Mohammed Irfan", zone: "East", priority: "high", wasteType: "Construction Debris", quantityKg: 550, submittedAt: "2026-07-12 18:00", status: "pending", note: "Debris bagged, awaiting truck pickup confirmation." },
  { id: "S-516", taskId: "T-2058", taskTitle: "Highway shoulder cleanup", collector: "Ravi Kumar", zone: "North", priority: "medium", wasteType: "Mixed Municipal", quantityKg: 210, submittedAt: "2026-07-08 17:00", decidedAt: "2026-07-09 10:00", status: "approved", note: "Shoulder cleared both directions." },
  { id: "S-517", taskId: "T-2059", taskTitle: "Ward 5 plastic removal", collector: "Deepak Yadav", zone: "Central", priority: "high", wasteType: "Plastic", quantityKg: 260, submittedAt: "2026-07-09 16:00", decidedAt: "2026-07-10 09:00", status: "approved", note: "Segregated for recycling pickup." },
  { id: "S-518", taskId: "T-2060", taskTitle: "Canal desilting support", collector: "Deepak Yadav", zone: "Central", priority: "medium", wasteType: "Sewage/Sludge", quantityKg: 700, submittedAt: "2026-07-10 17:30", decidedAt: "2026-07-11 11:00", status: "approved", note: "Desilted 40m stretch, verified by engineer." },
  { id: "S-519", taskId: "T-2061", taskTitle: "Community park cleanup", collector: "Anita Sharma", zone: "South", priority: "low", wasteType: "Organic", quantityKg: 90, submittedAt: "2026-07-12 15:00", decidedAt: "2026-07-12 18:00", status: "approved", note: "Leaf litter and organic waste composted on-site." },
  { id: "S-520", taskId: "T-2062", taskTitle: "Railway underpass cleanup", collector: "Kavita Joshi", zone: "North", priority: "high", wasteType: "Mixed Municipal", quantityKg: 150, submittedAt: "2026-07-13 09:30", decidedAt: "2026-07-13 11:00", status: "approved", note: "Underpass cleared before evening commute." },
];

// `tasksCompleted` = approved tasks assigned to this collector; `approvalRate` = approved ÷
// (approved + rejected) submissions for this collector. Both computed from the data above so a
// ~22-task pilot never shows an individual collector with more completions than the pilot has
// tasks.
export const collectors: Collector[] = collectorsBase.map((c) => {
  const tasksCompleted = tasks.filter((t) => t.assignee === c.name && t.status === "approved").length;
  const decided = submissions.filter((s) => s.collector === c.name && (s.status === "approved" || s.status === "rejected"));
  const approvalRate = decided.length ? Math.round((decided.filter((s) => s.status === "approved").length / decided.length) * 100) : 0;
  return { ...c, tasksCompleted, approvalRate };
});

// --- Legacy aggregates kept for the Reports page (untouched by the Overview rebuild). ---

export const weeklyCompleted = [
  { day: "Mon", value: 18 },
  { day: "Tue", value: 24 },
  { day: "Wed", value: 21 },
  { day: "Thu", value: 30 },
  { day: "Fri", value: 27 },
  { day: "Sat", value: 33 },
  { day: "Sun", value: 15 },
];

export const zoneBreakdown: { zone: Zone; open: number; done: number }[] = [
  { zone: "North", open: 9, done: 41 },
  { zone: "South", open: 7, done: 38 },
  { zone: "East", open: 12, done: 44 },
  { zone: "West", open: 5, done: 22 },
  { zone: "Central", open: 9, done: 51 },
];

// --- Derived data for the Operations Overview page. Everything below is computed from the ---
// --- arrays above so the page never hardcodes a total; see replit.md for a metric-by-metric ---
// --- explanation of how each number here is produced. ---

// Statuses that are "closed" for good — a task here will never move again.
const CLOSED_STATUSES: TaskStatus[] = ["approved", "rejected", "declined", "canceled"];
// Statuses a task can still be overdue in (it hasn't reached a closed/final state).
const OPEN_PIPELINE_STATUSES: TaskStatus[] = ["open", "assigned", "accepted", "in_progress", "submitted"];
// A task has moved past acceptance once it's accepted or further along the happy path.
const ACCEPTED_OR_LATER_STATUSES: TaskStatus[] = ["accepted", "in_progress", "submitted", "approved", "rejected"];

const priorityRank: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

function toTimestamp(dateStr: string): number {
  return new Date(dateStr.replace(" ", "T")).getTime();
}

function dateKey(dateStr: string): string {
  return dateStr.slice(0, 10);
}

/** Formats a "YYYY-MM-DD HH:mm" mock timestamp for display, e.g. "Today, 9:30 AM". Storage stays ISO-like; only the UI is friendly. */
export function formatFriendlyDateTime(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const target = new Date(`${datePart}T${timePart}`);
  const timeLabel = target.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const todayKey = dateKey(NOW);
  const yesterdayKey = new Date(toTimestamp(NOW) - 86_400_000).toISOString().slice(0, 10);
  if (datePart === todayKey) return `Today, ${timeLabel}`;
  if (datePart === yesterdayKey) return `Yesterday, ${timeLabel}`;
  return `${target.toLocaleDateString("en-US", { day: "numeric", month: "short" })}, ${timeLabel}`;
}

// Open Tasks: not yet approved, rejected, declined, or canceled.
export const openTasksCount = tasks.filter((t) => !CLOSED_STATUSES.includes(t.status)).length;
// Awaiting Review: tasks a collector has submitted proof for, sitting in the reviewer's queue.
export const awaitingReviewCount = tasks.filter((t) => t.status === "submitted").length;
// Approved Tasks: verified complete.
export const approvedTasksCount = tasks.filter((t) => t.status === "approved").length;
// Active Collectors: currently able to take assignments.
export const activeCollectorsCount = collectors.filter((c) => c.active).length;

// Completion Rate: of tasks that ever got assigned (i.e. excluding drafts and canceled), how many
// have reached submitted, approved, or rejected — a sense of how far the pipeline is moving.
const assignedOrLaterTasks = tasks.filter((t) => t.status !== "open" && t.status !== "canceled");
const reachedReviewTasks = tasks.filter((t) => t.status === "submitted" || t.status === "approved" || t.status === "rejected");
export const completionRate = assignedOrLaterTasks.length
  ? Math.round((reachedReviewTasks.length / assignedOrLaterTasks.length) * 100)
  : 0;

// Acceptance Rate: of tasks a collector responded to, the share they accepted rather than declined.
const acceptedOrLaterCount = tasks.filter((t) => ACCEPTED_OR_LATER_STATUSES.includes(t.status)).length;
const declinedCount = tasks.filter((t) => t.status === "declined").length;
export const acceptanceRate = acceptedOrLaterCount + declinedCount
  ? Math.round((acceptedOrLaterCount / (acceptedOrLaterCount + declinedCount)) * 100)
  : 0;

// Estimated Waste Collected: approved submissions only — the only quantities that are verified.
export const estimatedWasteCollectedKg = submissions
  .filter((s) => s.status === "approved")
  .reduce((sum, s) => sum + s.quantityKg, 0);

// Overdue Tasks: past their due date and not yet approved, canceled, declined, or rejected.
export const overdueTasksCount = tasks.filter(
  (t) => OPEN_PIPELINE_STATUSES.includes(t.status) && toTimestamp(t.dueAt) < toTimestamp(NOW),
).length;

export const totalCollectorsCount = collectors.length;
export const pendingRegistrationCount = collectors.filter((c) => c.registrationStatus === "pending").length;
export const collectorsAssignedTodayCount = new Set(
  tasks.filter((t) => t.assignee && dateKey(t.createdAt) === dateKey(NOW)).map((t) => t.assignee),
).size;
// Distinct collectors who have at least one submission still awaiting a review decision — a
// different count than `awaitingReviewCount` above (that one counts tasks, this counts people).
export const collectorsWithPendingSubmissionsCount = new Set(
  submissions.filter((s) => s.status === "pending").map((s) => s.collector),
).size;

export const topCollectors = [...collectors]
  .filter((c) => c.active)
  .sort((a, b) => b.tasksCompleted - a.tasksCompleted || toTimestamp(b.lastActiveAt) - toTimestamp(a.lastActiveAt))
  .slice(0, 3);

// Last 7 days of pipeline activity: tasks that picked up an assignee (Assigned), submissions
// filed (Submitted), and submissions that cleared review (Approved), bucketed by calendar day.
const last7Days: string[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(toTimestamp(NOW) - (6 - i) * 86_400_000);
  return d.toISOString().slice(0, 10);
});

export const cleanupActivity = last7Days.map((day) => {
  const label = new Date(`${day}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
  return {
    day,
    label,
    assigned: tasks.filter((t) => t.assignee && dateKey(t.createdAt) === day).length,
    submitted: submissions.filter((s) => dateKey(s.submittedAt) === day).length,
    approved: submissions.filter((s) => s.status === "approved" && s.decidedAt && dateKey(s.decidedAt) === day).length,
  };
});

const statusOrder: TaskStatus[] = ["open", "assigned", "accepted", "in_progress", "submitted", "approved", "declined", "rejected", "canceled"];
const statusDisplayLabel: Record<TaskStatus, string> = {
  open: "Draft",
  assigned: "Assigned",
  accepted: "Accepted",
  in_progress: "In Progress",
  submitted: "Submitted",
  approved: "Approved",
  declined: "Declined",
  rejected: "Rejected",
  canceled: "Canceled",
};

export const taskStatusBreakdown = statusOrder.map((status) => ({
  status,
  label: statusDisplayLabel[status],
  count: tasks.filter((t) => t.status === status).length,
}));

export const tasksNeedingReview = submissions
  .filter((s) => s.status === "pending")
  .sort((a, b) => toTimestamp(b.submittedAt) - toTimestamp(a.submittedAt))
  .slice(0, 3);

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "assigned" | "accepted" | "declined" | "submitted" | "approved" | "rejected";
}

// Hand-authored feed of the most recent real events already present in tasks/submissions above,
// ordered newest-first — not randomly generated.
export const recentActivity: ActivityItem[] = [
  { id: "A-1", message: "Railway underpass cleanup was approved", timestamp: "2026-07-13 11:00", type: "approved" },
  { id: "A-2", message: "Kavita Joshi submitted proof for Railway underpass cleanup", timestamp: "2026-07-13 09:30", type: "submitted" },
  { id: "A-3", message: "Mohammed Irfan submitted proof for Industrial estate cleanup", timestamp: "2026-07-12 18:00", type: "submitted" },
  { id: "A-4", message: "Community park cleanup was approved", timestamp: "2026-07-12 18:00", type: "approved" },
  { id: "A-5", message: "Deepak Yadav submitted proof for Market waste pile-up", timestamp: "2026-07-12 17:04", type: "submitted" },
];

export interface CleanupLocation {
  zone: Zone;
  openTasks: number;
  completedTasks: number;
  hotspotType: WasteType;
  highestPriorityTask: string | null;
}

export const cleanupLocations: CleanupLocation[] = (["North", "South", "East", "West", "Central"] as Zone[]).map((zone) => {
  const zoneTasks = tasks.filter((t) => t.zone === zone);
  const inFlight = zoneTasks.filter((t) => OPEN_PIPELINE_STATUSES.includes(t.status));

  const wasteTally = new Map<WasteType, number>();
  for (const t of zoneTasks) wasteTally.set(t.wasteType, (wasteTally.get(t.wasteType) ?? 0) + 1);
  const hotspotType = [...wasteTally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mixed Municipal";

  const highestPriorityTask = [...inFlight].sort((a, b) => {
    const byPriority = priorityRank[b.priority] - priorityRank[a.priority];
    return byPriority !== 0 ? byPriority : toTimestamp(a.dueAt) - toTimestamp(b.dueAt);
  })[0];

  return {
    zone,
    openTasks: inFlight.length,
    completedTasks: zoneTasks.filter((t) => t.status === "approved").length,
    hotspotType,
    highestPriorityTask: highestPriorityTask ? highestPriorityTask.title : null,
  };
});
