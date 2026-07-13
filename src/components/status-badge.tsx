import { cn } from "@/lib/utils";
import type { TaskStatus, Priority } from "@/lib/mock-data";

const statusStyles: Record<TaskStatus, string> = {
  open: "bg-muted text-muted-foreground border-border",
  assigned: "bg-primary/10 text-primary-dark border-primary/20",
  in_progress: "bg-highlight/40 text-primary-dark border-highlight",
  submitted: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-primary/15 text-primary-dark border-primary/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
  canceled: "bg-muted text-muted-foreground border-border line-through",
};

const statusLabels: Record<TaskStatus, string> = {
  open: "Open",
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
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
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
