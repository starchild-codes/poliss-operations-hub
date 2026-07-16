import { cn } from "@/lib/utils";
import type { TaskStatus, Priority } from "@/lib/mock-data";

const statusStyles: Record<TaskStatus, string> = {
  // Draft/open — grey
  open: "bg-muted text-muted-foreground border-border",
  // Assigned — blue
  assigned: "bg-primary/10 text-primary border-primary/25",
  // Accepted by collector — teal
  accepted: "bg-teal/10 text-teal border-teal/25",
  // In progress — stronger blue
  in_progress: "bg-primary/15 text-primary-dark border-primary/30",
  // Submitted — indigo
  submitted: "bg-indigo/10 text-indigo border-indigo/25",
  // Approved — green
  approved: "bg-success/12 text-success border-success/30",
  // Declined by collector — amber
  declined: "bg-warning/10 text-warning border-warning/25",
  // Rejected — red
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
  // Canceled — muted grey-red
  canceled: "bg-muted text-muted-foreground/80 border-border line-through",
};

const statusLabels: Record<TaskStatus, string> = {
  open: "Draft",
  assigned: "Assigned",
  accepted: "Accepted",
  in_progress: "In progress",
  submitted: "Submitted",
  approved: "Approved",
  declined: "Declined",
  rejected: "Rejected",
  canceled: "Canceled",
};

// Solid background classes for chart contexts (e.g. the Overview status breakdown bar), reusing
// the same semantic color as the badge above so status colors stay consistent app-wide.
export const statusBarColor: Record<TaskStatus, string> = {
  open: "bg-muted-foreground/30",
  assigned: "bg-primary",
  accepted: "bg-teal",
  in_progress: "bg-primary-dark",
  submitted: "bg-indigo",
  approved: "bg-success",
  declined: "bg-warning",
  rejected: "bg-destructive",
  canceled: "bg-muted-foreground/60",
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

const priorityStyles: Record<Priority, string> = {
  low: "text-muted-foreground",
  medium: "text-foreground",
  high: "text-warning",
  urgent: "text-destructive font-semibold",
};

export function PriorityLabel({ priority }: { priority: Priority }) {
  return (
    <span className={cn("text-xs capitalize", priorityStyles[priority])}>
      {priority}
    </span>
  );
}
