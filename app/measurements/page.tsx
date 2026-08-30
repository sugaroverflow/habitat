import { MeasurementList } from "@/components/features/measurement-list";
import { PageHeader } from "@/components/layout/page-header";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "Measurements" };

export default function MeasurementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${seedData.measurements.length} saved`}
        title="Measurements"
        description="Room dimensions and the checks still needed before buying."
      />
      <MeasurementList measurements={seedData.measurements} />
    </div>
  );
}
