export type Zone = "North" | "South" | "East" | "West" | "Central";

export type TaskStatus = "open" | "assigned" | "in_progress" | "submitted" | "approved" | "rejected" | "canceled";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Collector {
  id: string;
  name: string;
  phone: string;
  zone: Zone;
  active: boolean;
  tasksCompleted: number;
  rating: number;
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
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  collector: string;
  zone: Zone;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
}

export const collectors: Collector[] = [
  { id: "C-101", name: "Ravi Kumar", phone: "+91 98450 12034", zone: "North", active: true, tasksCompleted: 128, rating: 4.7 },
  { id: "C-102", name: "Anita Sharma", phone: "+91 98860 23112", zone: "South", active: true, tasksCompleted: 96, rating: 4.5 },
  { id: "C-103", name: "Mohammed Irfan", phone: "+91 99012 55461", zone: "East", active: true, tasksCompleted: 154, rating: 4.8 },
  { id: "C-104", name: "Sunita Patil", phone: "+91 98221 88720", zone: "West", active: false, tasksCompleted: 43, rating: 4.2 },
  { id: "C-105", name: "Deepak Yadav", phone: "+91 97401 33298", zone: "Central", active: true, tasksCompleted: 201, rating: 4.9 },
  { id: "C-106", name: "Priya Menon", phone: "+91 98470 91123", zone: "South", active: true, tasksCompleted: 77, rating: 4.4 },
  { id: "C-107", name: "Arjun Reddy", phone: "+91 96320 42200", zone: "East", active: true, tasksCompleted: 62, rating: 4.3 },
  { id: "C-108", name: "Kavita Joshi", phone: "+91 98191 77340", zone: "North", active: true, tasksCompleted: 88, rating: 4.6 },
];

export const tasks: Task[] = [
  { id: "T-2041", title: "Garbage overflow near bus stand", location: "MG Road, Ward 12", zone: "Central", status: "submitted", priority: "high", assignee: "Deepak Yadav", createdAt: "2026-07-11 09:14", dueAt: "2026-07-13 18:00" },
  { id: "T-2042", title: "Illegal dumping cleanup", location: "Yeshwanthpur Industrial Area", zone: "North", status: "in_progress", priority: "urgent", assignee: "Ravi Kumar", createdAt: "2026-07-12 07:22", dueAt: "2026-07-13 12:00" },
  { id: "T-2043", title: "Clogged storm drain", location: "Koramangala 5th Block", zone: "South", status: "assigned", priority: "medium", assignee: "Anita Sharma", createdAt: "2026-07-12 10:03", dueAt: "2026-07-14 17:00" },
  { id: "T-2044", title: "Construction debris removal", location: "Whitefield Main Road", zone: "East", status: "open", priority: "medium", createdAt: "2026-07-12 11:41", dueAt: "2026-07-15 12:00" },
  { id: "T-2045", title: "Market waste pile-up", location: "KR Market, Stall Row 4", zone: "Central", status: "submitted", priority: "high", assignee: "Deepak Yadav", createdAt: "2026-07-11 18:32", dueAt: "2026-07-13 09:00" },
  { id: "T-2046", title: "Plastic dump near lake", location: "Bellandur Lake, East Bund", zone: "East", status: "rejected", priority: "high", assignee: "Mohammed Irfan", createdAt: "2026-07-10 14:00", dueAt: "2026-07-12 18:00" },
  { id: "T-2047", title: "School premises cleanup", location: "Govt. School, Rajajinagar", zone: "West", status: "approved", priority: "low", assignee: "Sunita Patil", createdAt: "2026-07-09 08:15", dueAt: "2026-07-11 17:00" },
  { id: "T-2048", title: "Temple street sweep", location: "Malleshwaram 8th Cross", zone: "North", status: "in_progress", priority: "low", assignee: "Kavita Joshi", createdAt: "2026-07-12 06:40", dueAt: "2026-07-14 12:00" },
  { id: "T-2049", title: "Sewage overflow report", location: "HSR Layout Sector 2", zone: "South", status: "assigned", priority: "urgent", assignee: "Priya Menon", createdAt: "2026-07-12 12:20", dueAt: "2026-07-13 20:00" },
  { id: "T-2050", title: "Roadside garbage bin damaged", location: "Indiranagar 100ft Road", zone: "East", status: "open", priority: "low", createdAt: "2026-07-12 13:00", dueAt: "2026-07-16 12:00" },
  { id: "T-2051", title: "Public toilet cleanup", location: "Majestic Bus Terminal", zone: "Central", status: "canceled", priority: "medium", createdAt: "2026-07-10 09:00", dueAt: "2026-07-12 18:00" },
];

export const submissions: Submission[] = [
  { id: "S-511", taskId: "T-2041", taskTitle: "Garbage overflow near bus stand", collector: "Deepak Yadav", zone: "Central", submittedAt: "2026-07-12 16:22", status: "pending", note: "Cleared 3 bins, photos attached." },
  { id: "S-512", taskId: "T-2045", taskTitle: "Market waste pile-up", collector: "Deepak Yadav", zone: "Central", submittedAt: "2026-07-12 17:04", status: "pending", note: "Stall row 4 cleared." },
  { id: "S-513", taskId: "T-2046", taskTitle: "Plastic dump near lake", collector: "Mohammed Irfan", zone: "East", submittedAt: "2026-07-11 15:40", status: "rejected", note: "Photos unclear, revisit needed." },
  { id: "S-514", taskId: "T-2047", taskTitle: "School premises cleanup", collector: "Sunita Patil", zone: "West", submittedAt: "2026-07-10 12:11", status: "approved", note: "Verified by ward officer." },
];

export const kpis = {
  activeTasks: 42,
  awaitingReview: 8,
  completedToday: 27,
  activeCollectors: 34,
};

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
