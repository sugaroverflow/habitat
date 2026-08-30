import { ArrowRight, Ruler } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { RoomCard } from "@/components/features/room-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { pendingMeasurements } from "@/lib/data";
import { seedData } from "@/lib/seed-data";

function SectionHeading({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-[-0.035em]">{title}</h2>
      <Link href={href} className="flex min-h-9 items-center gap-1 text-xs font-semibold text-primary">
        View all <ArrowRight aria-hidden="true" size={14} />
      </Link>
    </div>
  );
}

export default function OverviewPage() {
  const openDecisions = seedData.needs.filter((need) => need.status !== "resolved");
  const purchases = seedData.items.filter((item) => item.ownership_status === "purchased");
  const featuredRooms = seedData.rooms.filter((room) => ["living_room", "bedroom", "hallway"].includes(room.id));
  const roomNames = new Map(seedData.rooms.map((room) => [room.id, room.name]));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Home"
        title="Clover 29"
        description={`${openDecisions.length} open decisions · ${pendingMeasurements.length} measurements needed · ${purchases.length} purchases tracked`}
      />

      <section>
        <SectionHeading title="Start with a room" href="/rooms" />
        <div className="grid gap-3 lg:grid-cols-3">
          {featuredRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              itemCount={seedData.items.filter((item) => item.room_id === room.id).length}
              needCount={seedData.needs.filter((need) => need.room_id === room.id).length}
              measurementCount={seedData.measurements.filter((measurement) => measurement.room_id === room.id).length}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Decide next" href="/needs" />
        <div className="ruled-surface divide-y divide-border overflow-hidden rounded-2xl border bg-card">
          {openDecisions.slice(0, 5).map((need) => (
            <Link
              key={need.id}
              href={need.room_id ? `/rooms/${need.room_id}#decisions` : "/needs"}
              className="flex min-h-[68px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{need.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {need.room_id ? roomNames.get(need.room_id) : "Whole home"} · {need.candidate_item_ids.length} {need.candidate_item_ids.length === 1 ? "option" : "options"}
                </p>
              </div>
              <Badge variant={need.priority === "high" ? "warning" : "outline"}>{need.priority}</Badge>
              <ArrowRight aria-hidden="true" size={15} className="shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-xl">
        <Link href="/measurements" className="dot-field ruled-surface block rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
          <span className="grid size-10 place-items-center rounded-xl border border-primary/15 bg-warning text-warning-foreground">
            <Ruler aria-hidden="true" size={19} />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-[-0.035em]">Measurements needed</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pendingMeasurements.length} checks still block a fit decision.</p>
          <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">View measurements <ArrowRight aria-hidden="true" size={14} /></span>
        </Link>
      </div>
    </div>
  );
}
