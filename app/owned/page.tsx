import { Cube } from "@phosphor-icons/react/dist/ssr";

import { ItemCard } from "@/components/features/item-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "Things I Own" };

export default function OwnedPage() {
  const owned = seedData.items.filter((item) => item.ownership_status === "owned");
  const unassigned = owned.filter((item) => item.room_id === null);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${owned.length} items`}
        title="Owned items"
        description="Pieces you already own, grouped by their intended room."
        action={<Badge variant="success">{owned.length} owned</Badge>}
      />
      {unassigned.length ? (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/35 bg-warning/18 p-4">
          <Cube aria-hidden="true" size={19} className="mt-0.5 text-warning-foreground" />
          <div>
            <p className="text-sm font-semibold">{unassigned.length} items need a room</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Assign each item to the room where it belongs.</p>
          </div>
        </div>
      ) : null}
      {seedData.rooms.map((room) => {
        const roomItems = owned.filter((item) => item.room_id === room.id);
        if (!roomItems.length) return null;
        return (
          <section key={room.id}>
            <h2 className="mb-3 text-lg font-semibold tracking-[-0.035em]">{room.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {roomItems.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          </section>
        );
      })}
      {unassigned.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-[-0.035em]">Room not set</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {unassigned.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
