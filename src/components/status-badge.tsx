import { Badge } from "@/components/ui/badge";

type ReviewStatus = "pending" | "approved" | "rejected";

const labelMap: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const variantMap: Record<ReviewStatus, "warning" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}
