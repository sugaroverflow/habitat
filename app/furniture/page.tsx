import { ItemCard } from "@/components/features/item-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { normalizeItemStatus } from "@/lib/data";
import { seedData, type SeedItem } from "@/lib/seed-data";

export const metadata = { title: "Furniture" };

function ItemsByRoom({ items }: { items: SeedItem[] }) {
  const roomGroups = [
    ...seedData.rooms.map((room) => ({ id: room.id, name: room.name })),
    { id: null, name: "Flexible" },
  ];

  return (
    <div className="space-y-6">
      {roomGroups.map((room) => {
        const roomItems = items.filter((item) => item.room_id === room.id);
        if (!roomItems.length) return null;

        return (
          <section key={room.id ?? "flexible"}>
            <h3 className="mb-3 text-base font-semibold tracking-[-0.025em]">{room.name}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {roomItems.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function FurniturePage() {
  const owned = seedData.items.filter((item) => item.ownership_status === "owned");
  const confirmed = seedData.items.filter((item) =>
    item.ownership_status !== "owned" && ["ordered", "shipped", "arrived"].includes(normalizeItemStatus(item)),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${owned.length + confirmed.length} tracked items`}
        title="Furniture"
        description="What you own and what is confirmed, grouped by where it needs to live."
        action={<Badge variant="success">{confirmed.length} confirmed</Badge>}
      />

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-3">
          <h2 className="text-xl font-semibold tracking-[-0.035em]">Already yours</h2>
          <span className="text-xs font-semibold text-muted-foreground">{owned.length} items</span>
        </div>
        <ItemsByRoom items={owned} />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-3">
          <h2 className="text-xl font-semibold tracking-[-0.035em]">Confirmed purchases</h2>
          <span className="text-xs font-semibold text-muted-foreground">{confirmed.length} items</span>
        </div>
        <ItemsByRoom items={confirmed} />
      </section>
    </div>
  );
}
