import { Suspense } from "react";

import { PinLibrary } from "@/components/features/pin-library";
import { inspirationRecords } from "@/lib/data";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "Pins" };

export default function InspirationPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
      <PinLibrary initialPins={inspirationRecords} rooms={seedData.rooms} />
    </Suspense>
  );
}
