import { cn } from "@/lib/utils";
import type { TaskStatus, Priority } from "@/lib/mock-data";

const statusStyles: Record<TaskStatus, string> = {
  // Draft/open — grey
  open: "bg-muted text-muted-foreground border-border",
  // Assigned — blue
  assigned: "bg-primary/10 text-primary border-primary/25",
  // In progress — stronger blue
  in_progress: "bg-primary/15 text-primary-dark border-primary/30",
  // Submitted — indigo
  submitted: "bg-indigo/10 text-indigo border-indigo/25",
  // Approved — green
  approved: "bg-success/12 text-success border-success/30",
  // Rejected — red
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
  // Canceled — muted grey-red
  canceled: "bg-muted text-muted-foreground/80 border-border line-through",
};

const statusLabels: Record<TaskStatus, string> = {
  open: "Draft",
  assigned: "Assigned",
  in_progress: "In progress",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  canceled: "Canceled",
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
