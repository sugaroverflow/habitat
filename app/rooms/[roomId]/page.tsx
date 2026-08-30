import { ArrowLeft, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemCard } from "@/components/features/item-card";
import { RoomDecisionBoard } from "@/components/features/room-decision-board";
import { RoomPins } from "@/components/features/room-pins";
import { RoomRecords } from "@/components/features/room-records";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ROOM_PALETTES,
  getRoom,
  roomDecisions,
  roomInspiration,
  roomItems,
  roomMeasurements,
  roomNeeds,
  roomPhotos,
} from "@/lib/data";
import type { RoomId } from "@/lib/domain";

export function generateStaticParams() {
  return [
    "living_room",
    "dining_area",
    "bedroom",
    "office",
    "hallway",
    "bathroom",
    "kitchen",
  ].map((roomId) => ({ roomId }));
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = getRoom(roomId);
  if (!room) notFound();

  const typedRoomId = roomId as RoomId;
  const photos = roomPhotos(roomId);
  const items = roomItems(roomId);
  const needs = roomNeeds(roomId);
  const measurements = roomMeasurements(roomId);
  const decisions = roomDecisions(roomId);
  const pins = roomInspiration(roomId);
  const candidateIds = new Set(needs.flatMap((need) => need.candidate_item_ids));
  const otherItems = items.filter((item) => !candidateIds.has(item.id));

  return (
    <div className="space-y-9">
      <div>
        <Link href="/rooms" className="mb-5 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft aria-hidden="true" size={14} /> All rooms
        </Link>
        <PageHeader
          eyebrow={`${needs.length} open decisions · ${items.length} items`}
          title={room.name}
          description={room.notes ?? "Pins, photos, decisions, and measurements for this room."}
        />
      </div>

      <RoomPins roomId={typedRoomId} pins={pins} />

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Current room</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">Room photos</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/floor-plan"><MapTrifold aria-hidden="true" size={15} /> Measured plan</Link>
          </Button>
        </div>
        {photos.length ? (
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative aspect-[4/3] w-[46vw] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-xl border border-border sm:w-auto sm:max-w-none">
                <Image
                  src={photo.path}
                  alt={`${room.name} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 46vw, 240px"
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
        <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card px-3 py-2.5">
          <span className="shrink-0 text-xs font-semibold">Palette</span>
          <div className="flex min-w-0 gap-2 overflow-x-auto py-0.5">
            {ROOM_PALETTES[typedRoomId].map((color) => (
              <span key={color.name} className="inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 text-[11px] font-medium">
                <span className="size-2.5 rounded-full border border-foreground/10" style={{ backgroundColor: color.value }} />
                {color.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <RoomDecisionBoard needs={needs} items={items} />

      {otherItems.length ? (
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Owned or kept for reference</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">Other room items</h2>
            </div>
            <Badge variant="outline">{otherItems.length}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {otherItems.map((item) => <ItemCard key={item.id} item={item} compact />)}
          </div>
        </section>
      ) : null}

      <RoomRecords initialMeasurements={measurements} initialDecisions={decisions} />
    </div>
  );
}
