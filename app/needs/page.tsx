import { NeedList } from "@/components/features/need-list";
import { PageHeader } from "@/components/layout/page-header";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "Decision list" };

export default function NeedsPage() {
  const sorted = [...seedData.needs].sort((a, b) => (a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${seedData.needs.length} open`}
        title="Decision list"
        description="Requirements and candidates, grouped by room."
      />
      <NeedList initialNeeds={sorted} />
    </div>
  );
}
