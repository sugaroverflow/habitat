import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RoomDecisionBoard } from "@/components/features/room-decision-board";
import { RoomDecisionTracker } from "@/components/features/room-decision-tracker";
import { RoomPins } from "@/components/features/room-pins";
import { ROOM_PALETTES, getRoom, roomDecisions, roomInspiration, roomItems, roomNeeds, roomPhotos } from "@/lib/data";
import type { RoomId } from "@/lib/domain";

export function generateStaticParams() {
  return ["living_room", "dining_area", "bedroom", "office", "hallway", "bathroom", "kitchen"].map((roomId) => ({ roomId }));
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = getRoom(roomId);
  if (!room) notFound();

  const typedRoomId = roomId as RoomId;
  const photos = roomPhotos(roomId);
  const items = roomItems(roomId);
  const needs = roomNeeds(roomId);
  const decisions = roomDecisions(roomId);
  const pins = roomInspiration(roomId);
  const madeCount = decisions.filter((decision) => decision.status !== "leaning").length;
  const openCount = needs.length + decisions.filter((decision) => decision.status === "leaning").length;

  return (
    <div className="space-y-9">
      <header>
        <Link href="/rooms" className="mb-5 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft aria-hidden="true" size={14} /> All rooms
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Room</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{room.name}</h1>
          </div>
          <p className="pb-1 text-xs font-medium text-muted-foreground">{openCount} open · {madeCount} made</p>
        </div>
      </header>

      <RoomDecisionTracker needs={needs} initialDecisions={decisions} />

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.035em]">Current room</h2>
        {photos.length ? (
          <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative aspect-[4/3] w-[42vw] max-w-[168px] shrink-0 snap-start overflow-hidden rounded-xl border border-border">
                <Image
                  src={photo.path}
                  alt={`${room.name} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 42vw, 180px"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="dot-field rounded-2xl border border-dashed border-border px-5 py-10 text-center">
            <p className="text-sm font-semibold">No room photos yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add one when you have it.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.035em]">Palette</h2>
        <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {ROOM_PALETTES[typedRoomId].map((color) => (
            <div key={color.name} className="w-28 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-20 border-b border-border" style={{ backgroundColor: color.value }} />
              <p className="px-3 py-2.5 text-xs font-semibold capitalize">{color.name}</p>
            </div>
          ))}
        </div>
      </section>

      <RoomPins roomId={typedRoomId} pins={pins} />

      <RoomDecisionBoard needs={needs} items={items} />
    </div>
  );
}
