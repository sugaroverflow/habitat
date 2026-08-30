import { Badge } from "@/components/ui/badge";
import type { ItemStatus } from "@/lib/domain";

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  saved: "Saved",
  considering: "Considering",
  shortlisted: "Shortlisted",
  favourite: "Favourite",
  ordered: "Ordered",
  shipped: "Shipped",
  arrived: "Arrived",
  returned: "Returned",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ItemStatus }) {
  const variant =
    status === "favourite"
      ? "accent"
      : status === "ordered" || status === "shipped"
        ? "warning"
        : status === "arrived"
          ? "success"
          : status === "rejected" || status === "returned"
            ? "outline"
            : "default";

  return <Badge variant={variant}>{ITEM_STATUS_LABELS[status]}</Badge>;
}
