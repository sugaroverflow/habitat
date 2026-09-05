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
  const featuredRooms = seedData.rooms.filter((room) => ["living_room", "bedroom", "bathroom", "hallway"].includes(room.id));
  const roomNames = new Map(seedData.rooms.map((room) => [room.id, room.name]));
  const tomorrowChecks = Object.entries(
    pendingMeasurements.reduce<Record<string, typeof pendingMeasurements>>((groups, measurement) => {
      (groups[measurement.roomId] ??= []).push(measurement);
      return groups;
    }, {}),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Home"
        title="Clover 29"
        description={`${openDecisions.length} open decisions · ${purchases.length} purchases tracked`}
      />

      <section>
        <SectionHeading title="Start with a room" href="/rooms" />
        <div className="grid gap-3 md:grid-cols-2">
          {featuredRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              itemCount={seedData.items.filter((item) => item.room_id === room.id).length}
              needCount={seedData.needs.filter((need) => need.room_id === room.id).length}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Measure tomorrow" href="/measurements" />
        <div className="ruled-surface divide-y divide-border overflow-hidden rounded-2xl border bg-card">
          {tomorrowChecks.map(([roomId, measurements]) => (
            <Link
              key={roomId}
              href="/measurements"
              className="flex min-h-[64px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/25 text-warning-foreground">
                <Ruler aria-hidden="true" size={17} weight="fill" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{roomNames.get(roomId) ?? roomId.replaceAll("_", " ")}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {measurements.length} {measurements.length === 1 ? "check" : "checks"}
                </p>
              </div>
              <Badge variant="warning">{measurements.filter((measurement) => measurement.priority === "critical").length} critical</Badge>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Decision tracker" href="/needs" />
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

    </div>
  );
}
