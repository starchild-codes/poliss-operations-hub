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

// The nature/category of the reported site, distinct from `wasteType` (the material collected).
export type HotspotType =
  | "Illegal dumping"
  | "Plastic litter"
  | "Organic waste"
  | "Construction debris"
  | "Market waste"
  | "Drainage or canal waste"
  | "Mixed waste"
  | "Other";

export const HOTSPOT_TYPES: HotspotType[] = [
  "Illegal dumping",
  "Plastic litter",
  "Organic waste",
  "Construction debris",
  "Market waste",
  "Drainage or canal waste",
  "Mixed waste",
  "Other",
];

export const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];
export const ZONES: Zone[] = ["North", "South", "East", "West", "Central"];

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
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  zone: Zone;
  status: TaskStatus;
  priority: Priority;
  hotspotType: HotspotType;
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  wasteType: WasteType;
  /** Estimated kilograms of waste for this task. */
  estimatedWasteKg: number;
  instructions?: string;
  internalNotes?: string;
  hasReferencePhoto?: boolean;
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

export interface TaskEvent {
  id: string;
  taskId: string;
  timestamp: string;
  message: string;
}

// Fixed "now" for this pilot snapshot so derived metrics (overdue, daily trends) are deterministic.
export const NOW = "2026-07-13 12:00";

// The signed-in operator shown in the app header — used as the default task creator.
export const CURRENT_OPERATOR = "Ananya Rao";

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

// Raw task fields. `updatedAt` is filled in below (after `submissions` exists) from the latest
// related submission event, so it is derived rather than hand-typed.
const tasksBase: Omit<Task, "updatedAt">[] = [
  { id: "T-2041", title: "Garbage overflow near bus stand", description: "Overflowing municipal bin attracting stray animals near the bus stand.", location: "MG Road, Ward 12", latitude: 12.9756, longitude: 77.6068, zone: "Central", status: "submitted", priority: "high", hotspotType: "Mixed waste", assignee: "Deepak Yadav", createdBy: "Ananya Rao", createdAt: "2026-07-11 09:14", dueAt: "2026-07-13 18:00", wasteType: "Mixed Municipal", estimatedWasteKg: 180, instructions: "Coordinate with the bus stand supervisor before starting.", hasReferencePhoto: true },
  { id: "T-2042", title: "Illegal dumping cleanup", description: "Construction waste dumped overnight on the industrial access road.", location: "Yeshwanthpur Industrial Area", latitude: 13.0284, longitude: 77.5407, zone: "North", status: "in_progress", priority: "urgent", hotspotType: "Illegal dumping", assignee: "Ravi Kumar", createdBy: "Ananya Rao", createdAt: "2026-07-12 07:22", dueAt: "2026-07-13 12:00", wasteType: "Construction Debris", estimatedWasteKg: 620, instructions: "Requires a truck for debris removal; contact depot for scheduling." },
  { id: "T-2043", title: "Clogged storm drain", description: "Storm drain blocked with plastic and silt, causing waterlogging after rain.", location: "Koramangala 5th Block", latitude: 12.9346, longitude: 77.6146, zone: "South", status: "assigned", priority: "medium", hotspotType: "Drainage or canal waste", assignee: "Anita Sharma", createdBy: "Ananya Rao", createdAt: "2026-07-12 10:03", dueAt: "2026-07-14 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 95 },
  { id: "T-2044", title: "Construction debris removal", description: "Leftover rubble from a nearby renovation blocking the footpath.", location: "Whitefield Main Road", latitude: 12.9698, longitude: 77.7500, zone: "East", status: "open", priority: "medium", hotspotType: "Construction debris", createdBy: "Ananya Rao", createdAt: "2026-07-12 11:41", dueAt: "2026-07-15 12:00", wasteType: "Construction Debris", estimatedWasteKg: 340 },
  { id: "T-2045", title: "Market waste pile-up", description: "Vegetable and organic waste piling up between market stalls.", location: "KR Market, Stall Row 4", latitude: 12.9634, longitude: 77.5785, zone: "Central", status: "submitted", priority: "high", hotspotType: "Market waste", assignee: "Deepak Yadav", createdBy: "Ananya Rao", createdAt: "2026-07-11 18:32", dueAt: "2026-07-13 09:00", wasteType: "Organic", estimatedWasteKg: 210, instructions: "Coordinate with stall owners for early-morning access." },
  { id: "T-2046", title: "Plastic dump near lake", description: "Plastic bottles and packaging washed up along the lake bund.", location: "Bellandur Lake, East Bund", latitude: 12.9260, longitude: 77.6762, zone: "East", status: "rejected", priority: "high", hotspotType: "Plastic litter", assignee: "Mohammed Irfan", createdBy: "Ananya Rao", createdAt: "2026-07-10 14:00", dueAt: "2026-07-12 18:00", wasteType: "Plastic", estimatedWasteKg: 150, internalNotes: "Second attempt needed — resubmission requested after unclear photos." },
  { id: "T-2047", title: "School premises cleanup", description: "General cleanup of the school compound ahead of the term restart.", location: "Govt. School, Rajajinagar", latitude: 12.9915, longitude: 77.5540, zone: "West", status: "approved", priority: "low", hotspotType: "Mixed waste", assignee: "Sunita Patil", createdBy: "Ananya Rao", createdAt: "2026-07-09 08:15", dueAt: "2026-07-11 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 60 },
  { id: "T-2048", title: "Temple street sweep", description: "Flower and food waste accumulation after the weekend festival.", location: "Malleshwaram 8th Cross", latitude: 13.0067, longitude: 77.5730, zone: "North", status: "in_progress", priority: "low", hotspotType: "Mixed waste", assignee: "Kavita Joshi", createdBy: "Ananya Rao", createdAt: "2026-07-12 06:40", dueAt: "2026-07-14 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 40 },
  { id: "T-2049", title: "Sewage overflow report", description: "Manhole overflow reported by residents, needs urgent attention.", location: "HSR Layout Sector 2", latitude: 12.9121, longitude: 77.6446, zone: "South", status: "assigned", priority: "urgent", hotspotType: "Drainage or canal waste", assignee: "Priya Menon", createdBy: "Ananya Rao", createdAt: "2026-07-12 12:20", dueAt: "2026-07-13 20:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 500, instructions: "Coordinate with the water board before entering the manhole area." },
  { id: "T-2050", title: "Roadside garbage bin damaged", description: "Damaged bin spilling waste onto the footpath.", location: "Indiranagar 100ft Road", latitude: 12.9719, longitude: 77.6412, zone: "East", status: "open", priority: "low", hotspotType: "Mixed waste", createdBy: "Ananya Rao", createdAt: "2026-07-12 13:00", dueAt: "2026-07-16 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 25 },
  { id: "T-2051", title: "Public toilet cleanup", description: "Deep cleaning requested for the public toilet block at the bus terminal.", location: "Majestic Bus Terminal", latitude: 12.9767, longitude: 77.5713, zone: "Central", status: "canceled", priority: "medium", hotspotType: "Other", createdBy: "Ananya Rao", createdAt: "2026-07-10 09:00", dueAt: "2026-07-12 18:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 80, internalNotes: "Canceled — contractor handled this directly." },

  { id: "T-2052", title: "Riverside plastic cleanup", description: "Plastic waste collecting along the lake bund after recent rains.", location: "Hebbal Lake Bund", latitude: 13.0453, longitude: 77.5950, zone: "North", status: "accepted", priority: "high", hotspotType: "Plastic litter", assignee: "Ravi Kumar", createdBy: "Ananya Rao", createdAt: "2026-07-07 09:00", dueAt: "2026-07-14 12:00", wasteType: "Plastic", estimatedWasteKg: 300 },
  { id: "T-2053", title: "Park litter collection", description: "Weekend litter buildup around the walking track and play area.", location: "Sankey Tank Park", latitude: 13.0067, longitude: 77.5730, zone: "North", status: "accepted", priority: "medium", hotspotType: "Mixed waste", assignee: "Kavita Joshi", createdBy: "Ananya Rao", createdAt: "2026-07-08 10:00", dueAt: "2026-07-15 12:00", wasteType: "Mixed Municipal", estimatedWasteKg: 70 },
  { id: "T-2054", title: "E-waste pickup request", description: "Decommissioned office electronics awaiting scheduled pickup.", location: "Whitefield Tech Park", latitude: 12.9698, longitude: 77.7500, zone: "East", status: "declined", priority: "medium", hotspotType: "Other", assignee: "Arjun Reddy", createdBy: "Ananya Rao", createdAt: "2026-07-09 11:00", dueAt: "2026-07-16 12:00", wasteType: "E-Waste", estimatedWasteKg: 120, internalNotes: "Collector declined — requires specialized handling, reassignment pending." },
  { id: "T-2055", title: "Community hall cleanup", description: "Post-event cleanup for the community hall and adjoining grounds.", location: "Jayanagar 4th Block", latitude: 12.9254, longitude: 77.5931, zone: "South", status: "assigned", priority: "low", hotspotType: "Organic waste", assignee: "Priya Menon", createdBy: "Ananya Rao", createdAt: "2026-07-10 09:30", dueAt: "2026-07-17 12:00", wasteType: "Organic", estimatedWasteKg: 50 },
  { id: "T-2056", title: "Lakeside debris clearance", description: "Construction rubble dumped near the lake walking path.", location: "Madiwala Lake", latitude: 12.9187, longitude: 77.6144, zone: "South", status: "in_progress", priority: "medium", hotspotType: "Construction debris", assignee: "Anita Sharma", createdBy: "Ananya Rao", createdAt: "2026-07-11 08:00", dueAt: "2026-07-14 12:00", wasteType: "Construction Debris", estimatedWasteKg: 400 },
  { id: "T-2057", title: "Industrial estate cleanup", description: "Scrap and debris accumulation along the estate's internal road.", location: "Peenya Industrial Area", latitude: 13.0284, longitude: 77.5407, zone: "East", status: "submitted", priority: "high", hotspotType: "Construction debris", assignee: "Mohammed Irfan", createdBy: "Ananya Rao", createdAt: "2026-07-10 07:00", dueAt: "2026-07-12 20:00", wasteType: "Construction Debris", estimatedWasteKg: 550, hasReferencePhoto: true },
  { id: "T-2058", title: "Highway shoulder cleanup", description: "Litter and debris along the service lane shoulder.", location: "Tumkur Road Service Lane", latitude: 13.0450, longitude: 77.5220, zone: "North", status: "approved", priority: "medium", hotspotType: "Mixed waste", assignee: "Ravi Kumar", createdBy: "Ananya Rao", createdAt: "2026-07-07 08:00", dueAt: "2026-07-09 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 210 },
  { id: "T-2059", title: "Ward 5 plastic removal", description: "Plastic waste segregation and removal drive for Ward 5.", location: "Shivajinagar Ward 5", latitude: 12.9857, longitude: 77.6057, zone: "Central", status: "approved", priority: "high", hotspotType: "Plastic litter", assignee: "Deepak Yadav", createdBy: "Ananya Rao", createdAt: "2026-07-08 09:00", dueAt: "2026-07-10 17:00", wasteType: "Plastic", estimatedWasteKg: 260 },
  { id: "T-2060", title: "Canal desilting support", description: "Silt and solid waste removal along a 40m canal stretch.", location: "Vrishabhavathi Canal", latitude: 12.9550, longitude: 77.5220, zone: "Central", status: "approved", priority: "medium", hotspotType: "Drainage or canal waste", assignee: "Deepak Yadav", createdBy: "Ananya Rao", createdAt: "2026-07-09 10:00", dueAt: "2026-07-11 17:00", wasteType: "Sewage/Sludge", estimatedWasteKg: 700 },
  { id: "T-2061", title: "Community park cleanup", description: "Leaf litter and organic waste cleanup ahead of the weekend event.", location: "Ejipura Park", latitude: 12.9401, longitude: 77.6357, zone: "South", status: "approved", priority: "low", hotspotType: "Organic waste", assignee: "Anita Sharma", createdBy: "Ananya Rao", createdAt: "2026-07-11 09:00", dueAt: "2026-07-13 17:00", wasteType: "Organic", estimatedWasteKg: 90 },
  { id: "T-2062", title: "Railway underpass cleanup", description: "Waste clearance ahead of the evening commute at the underpass.", location: "Yeshwanthpur Underpass", latitude: 13.0284, longitude: 77.5407, zone: "North", status: "approved", priority: "high", hotspotType: "Mixed waste", assignee: "Kavita Joshi", createdBy: "Ananya Rao", createdAt: "2026-07-13 08:00", dueAt: "2026-07-13 17:00", wasteType: "Mixed Municipal", estimatedWasteKg: 150 },
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

function toTimestamp(dateStr: string): number {
  return new Date(dateStr.replace(" ", "T")).getTime();
}

// `updatedAt` is derived, not hand-typed: it's the latest of a task's creation time and any
// submission activity (submitted/decided) linked to it, so "Last updated" reflects real activity.
export const tasks: Task[] = tasksBase.map((t) => {
  const related = submissions.filter((s) => s.taskId === t.id);
  const candidates = [t.createdAt, ...related.map((s) => s.submittedAt), ...related.flatMap((s) => (s.decidedAt ? [s.decidedAt] : []))];
  const updatedAt = candidates.reduce((latest, ts) => (toTimestamp(ts) > toTimestamp(latest) ? ts : latest), t.createdAt);
  return { ...t, updatedAt };
});

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

// Only collectors able to take on new work — used when assigning/reassigning a task.
export const assignableCollectors = collectors.filter((c) => c.active && !c.registrationStatus);

// Natural-language event history, generated from the task + its linked submission so it always
// matches the task's actual status rather than being hand-authored per task.
function buildInitialEvents(t: Task, submission: Submission | undefined): TaskEvent[] {
  const events: TaskEvent[] = [
    { id: `${t.id}-E1`, taskId: t.id, timestamp: t.createdAt, message: `Task created by ${t.createdBy}` },
  ];
  if (t.assignee) {
    events.push({ id: `${t.id}-E2`, taskId: t.id, timestamp: t.createdAt, message: `Assigned to ${t.assignee}` });
  }
  if (t.status === "accepted" || t.status === "in_progress" || t.status === "submitted" || t.status === "approved" || t.status === "rejected") {
    events.push({ id: `${t.id}-E3`, taskId: t.id, timestamp: t.createdAt, message: `${t.assignee} accepted the task` });
  }
  if (t.status === "declined") {
    events.push({ id: `${t.id}-E3`, taskId: t.id, timestamp: t.updatedAt, message: `${t.assignee} declined the task` });
  }
  if (t.status === "in_progress" || t.status === "submitted" || t.status === "approved" || t.status === "rejected") {
    events.push({ id: `${t.id}-E4`, taskId: t.id, timestamp: t.createdAt, message: `${t.assignee} started work` });
  }
  if (submission) {
    events.push({ id: `${t.id}-E5`, taskId: t.id, timestamp: submission.submittedAt, message: `${t.assignee} submitted proof of work` });
    if (submission.status === "approved") {
      events.push({ id: `${t.id}-E6`, taskId: t.id, timestamp: submission.decidedAt ?? submission.submittedAt, message: "Submission approved" });
    } else if (submission.status === "rejected") {
      events.push({ id: `${t.id}-E6`, taskId: t.id, timestamp: submission.decidedAt ?? submission.submittedAt, message: "Submission rejected — resubmission requested" });
    }
  }
  if (t.status === "canceled") {
    events.push({ id: `${t.id}-E7`, taskId: t.id, timestamp: t.updatedAt, message: "Task canceled by operator" });
  }
  return events.sort((a, b) => toTimestamp(a.timestamp) - toTimestamp(b.timestamp));
}

export const initialTaskEvents: TaskEvent[] = tasks.flatMap((t) =>
  buildInitialEvents(t, submissions.find((s) => s.taskId === t.id)),
);

// The only mock status transitions a person can trigger manually from the Tasks UI in this phase.
// Every other transition (accepted, in_progress, submitted, and review decisions) happens via
// WhatsApp or the Review page and is out of scope here.
export const taskTransitions: Record<TaskStatus, TaskStatus[]> = {
  open: ["assigned", "canceled"],
  assigned: ["canceled"],
  accepted: ["canceled"],
  in_progress: ["canceled"],
  submitted: [],
  approved: [],
  declined: ["assigned"],
  rejected: ["canceled"],
  canceled: [],
};

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

// --- Derived data for the Operations Overview page. Metrics below are exposed as `compute*` ---
// --- functions (default-parameterized on the base `tasks` array) so the Tasks workspace can ---
// --- create/edit/assign/cancel tasks at runtime and Overview stays in sync — both read from ---
// --- the same live task list via `src/lib/task-store.ts` rather than a frozen snapshot. ---

// Statuses that are "closed" for good — a task here will never move again.
const CLOSED_STATUSES: TaskStatus[] = ["approved", "rejected", "declined", "canceled"];
// Statuses a task can still be overdue in (it hasn't reached a closed/final state).
const OPEN_PIPELINE_STATUSES: TaskStatus[] = ["open", "assigned", "accepted", "in_progress", "submitted"];
// A task has moved past acceptance once it's accepted or further along the happy path.
const ACCEPTED_OR_LATER_STATUSES: TaskStatus[] = ["accepted", "in_progress", "submitted", "approved", "rejected"];

const priorityRank: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

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

/** Formats a "YYYY-MM-DD HH:mm" mock timestamp as a plain date, e.g. "13 Jul 2026". */
export function formatFriendlyDate(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const target = new Date(`${datePart}T${timePart ?? "00:00"}`);
  return target.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function isTaskOverdue(t: Task): boolean {
  return OPEN_PIPELINE_STATUSES.includes(t.status) && toTimestamp(t.dueAt) < toTimestamp(NOW);
}

// Open Tasks: not yet approved, rejected, declined, or canceled.
export function computeOpenTasksCount(tasksList: Task[] = tasks): number {
  return tasksList.filter((t) => !CLOSED_STATUSES.includes(t.status)).length;
}
// Awaiting Review: tasks a collector has submitted proof for, sitting in the reviewer's queue.
export function computeAwaitingReviewCount(tasksList: Task[] = tasks): number {
  return tasksList.filter((t) => t.status === "submitted").length;
}
// Approved Tasks: verified complete.
export function computeApprovedTasksCount(tasksList: Task[] = tasks): number {
  return tasksList.filter((t) => t.status === "approved").length;
}

// Active Collectors: currently able to take assignments.
export const activeCollectorsCount = collectors.filter((c) => c.active).length;
export const totalCollectorsCount = collectors.length;
export const pendingRegistrationCount = collectors.filter((c) => c.registrationStatus === "pending").length;

// Completion Rate: of tasks that ever got assigned (i.e. excluding drafts and canceled), how many
// have reached submitted, approved, or rejected — a sense of how far the pipeline is moving.
export function computeCompletionRate(tasksList: Task[] = tasks): number {
  const assignedOrLater = tasksList.filter((t) => t.status !== "open" && t.status !== "canceled");
  const reachedReview = tasksList.filter((t) => t.status === "submitted" || t.status === "approved" || t.status === "rejected");
  return assignedOrLater.length ? Math.round((reachedReview.length / assignedOrLater.length) * 100) : 0;
}

// Acceptance Rate: of tasks a collector responded to, the share they accepted rather than declined.
export function computeAcceptanceRate(tasksList: Task[] = tasks): number {
  const acceptedOrLater = tasksList.filter((t) => ACCEPTED_OR_LATER_STATUSES.includes(t.status)).length;
  const declined = tasksList.filter((t) => t.status === "declined").length;
  return acceptedOrLater + declined ? Math.round((acceptedOrLater / (acceptedOrLater + declined)) * 100) : 0;
}

// Estimated Waste Collected: approved submissions only — the only quantities that are verified.
export const estimatedWasteCollectedKg = submissions
  .filter((s) => s.status === "approved")
  .reduce((sum, s) => sum + s.quantityKg, 0);

// Overdue Tasks: past their due date and not yet approved, canceled, declined, or rejected.
export function computeOverdueTasksCount(tasksList: Task[] = tasks): number {
  return tasksList.filter(isTaskOverdue).length;
}

export function computeCollectorsAssignedTodayCount(tasksList: Task[] = tasks): number {
  return new Set(
    tasksList.filter((t) => t.assignee && dateKey(t.createdAt) === dateKey(NOW)).map((t) => t.assignee),
  ).size;
}

// Distinct collectors who have at least one submission still awaiting a review decision — a
// different count than `computeAwaitingReviewCount` above (that one counts tasks, this counts people).
export const collectorsWithPendingSubmissionsCount = new Set(
  submissions.filter((s) => s.status === "pending").map((s) => s.collector),
).size;

export function computeTopCollectors(tasksList: Task[] = tasks, collectorsList: Collector[] = collectors) {
  const withLiveCompletions = collectorsList.map((c) => ({
    ...c,
    tasksCompleted: tasksList.filter((t) => t.assignee === c.name && t.status === "approved").length,
  }));
  return withLiveCompletions
    .filter((c) => c.active)
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted || toTimestamp(b.lastActiveAt) - toTimestamp(a.lastActiveAt))
    .slice(0, 3);
}

// Last 7 days of pipeline activity: tasks that picked up an assignee (Assigned), submissions
// filed (Submitted), and submissions that cleared review (Approved), bucketed by calendar day.
const last7Days: string[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(toTimestamp(NOW) - (6 - i) * 86_400_000);
  return d.toISOString().slice(0, 10);
});

export function computeCleanupActivity(tasksList: Task[] = tasks, submissionsList: Submission[] = submissions) {
  return last7Days.map((day) => {
    const label = new Date(`${day}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
    return {
      day,
      label,
      assigned: tasksList.filter((t) => t.assignee && dateKey(t.createdAt) === day).length,
      submitted: submissionsList.filter((s) => dateKey(s.submittedAt) === day).length,
      approved: submissionsList.filter((s) => s.status === "approved" && s.decidedAt && dateKey(s.decidedAt) === day).length,
    };
  });
}

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

export function computeTaskStatusBreakdown(tasksList: Task[] = tasks) {
  return statusOrder.map((status) => ({
    status,
    label: statusDisplayLabel[status],
    count: tasksList.filter((t) => t.status === status).length,
  }));
}

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

export function computeCleanupLocations(tasksList: Task[] = tasks): CleanupLocation[] {
  return ZONES.map((zone) => {
    const zoneTasks = tasksList.filter((t) => t.zone === zone);
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
}

let taskIdCounter = Math.max(...tasks.map((t) => Number(t.id.split("-")[1]))) + 1;
export function nextTaskId(): string {
  return `T-${taskIdCounter++}`;
}
