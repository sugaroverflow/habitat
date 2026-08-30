import { ArrowRight, Ruler } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seedData } from "@/lib/seed-data";

const roomHotspots = [
  { id: "bedroom", label: "Bedroom", left: "26%", top: "27%" },
  { id: "living_room", label: "Living", left: "66%", top: "30%" },
  { id: "dining_area", label: "Dining", left: "70%", top: "48%" },
  { id: "kitchen", label: "Kitchen", left: "61%", top: "58%" },
  { id: "bathroom", label: "Bath", left: "66%", top: "70%" },
  { id: "hallway", label: "Hall", left: "45%", top: "75%" },
] as const;

export const metadata = { title: "Floor Plan" };

export default function FloorPlanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Plan"
        description="Tap a room to view its photos, items, pins, and measurements."
      />

      <Tabs defaultValue="clean">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="clean" className="flex-1 sm:flex-none">Room map</TabsTrigger>
          <TabsTrigger value="measured" className="flex-1 sm:flex-none">Measured plan</TabsTrigger>
        </TabsList>
        <TabsContent value="clean">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-6">
            <div className="relative aspect-[1500/1612]">
              <Image
                src="/media/floor-plan.png"
                alt="Floor plan for Clover 29"
                fill
                priority
                sizes="(max-width: 768px) 95vw, 760px"
                className="object-contain"
              />
              {roomHotspots.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  style={{ left: room.left, top: room.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25 bg-background/94 px-2.5 py-1.5 text-[10px] font-bold text-primary shadow-sm backdrop-blur-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-xs"
                >
                  {room.label}
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="measured">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-6">
            <div className="relative aspect-[1086/1235]">
              <Image
                src="/media/floor-plan-measured.png"
                alt="Floor plan with working measurements"
                fill
                sizes="(max-width: 768px) 95vw, 760px"
                className="object-contain"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Attached measurements</h2>
          <Badge variant="outline">{seedData.measurements.length} captured</Badge>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {seedData.measurements.slice(0, 6).map((measurement) => (
            <Link
              key={measurement.id}
              href={`/rooms/${measurement.room_id}`}
              className="flex min-h-[62px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/55"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                <Ruler aria-hidden="true" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{measurement.label}</p>
                <p className="text-[11px] text-muted-foreground">{measurement.original}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">{measurement.value_cm} cm</span>
              <ArrowRight aria-hidden="true" size={14} className="text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
