import { Badge } from "@/components/ui/badge";
import type { ItemStatus } from "@/lib/domain";

export const DECISION_STATUS_OPTIONS: Array<[ItemStatus, string]> = [
  ["arrived", "Purchased (yay!)"],
  ["considering", "Considering"],
  ["rejected", "Rejected"],
];

export function getDecisionStatus(status: ItemStatus) {
  if (status === "ordered" || status === "shipped" || status === "arrived") {
    return {
      label: "Purchased (yay!)",
      value: "arrived" as const,
      variant: "success" as const,
      surface: "bg-success/12",
    };
  }

  if (status === "rejected" || status === "returned") {
    return {
      label: "Rejected",
      value: "rejected" as const,
      variant: "destructive" as const,
      surface: "bg-destructive/8",
    };
  }

  return {
    label: "Considering",
    value: "considering" as const,
    variant: "warning" as const,
    surface: "bg-warning/30",
  };
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const decisionStatus = getDecisionStatus(status);

  return <Badge variant={decisionStatus.variant} className="whitespace-nowrap">{decisionStatus.label}</Badge>;
}
