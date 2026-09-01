import { PageHeader } from "@/components/layout/page-header";
import { RoomCard } from "@/components/features/room-card";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${seedData.rooms.length} rooms`}
        title="Rooms"
        description="Each room keeps its photos, palette, inspiration, decisions, and item comparisons together."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.15fr_0.85fr]">
        {seedData.rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            itemCount={seedData.items.filter((item) => item.room_id === room.id).length}
            needCount={seedData.needs.filter((need) => need.room_id === room.id).length}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
