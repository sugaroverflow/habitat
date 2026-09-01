import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RoomDecisionBoard } from "@/components/features/room-decision-board";
import { RoomDecisionTracker } from "@/components/features/room-decision-tracker";
import { RoomOverview } from "@/components/features/room-overview";
import { RoomPins } from "@/components/features/room-pins";
import { getRoom, roomDecisions, roomInspiration, roomItems, roomNeeds, roomPhotos } from "@/lib/data";
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

      <RoomOverview roomId={typedRoomId} roomName={room.name} photos={photos} />

      <RoomPins roomId={typedRoomId} pins={pins} />

      <RoomDecisionTracker needs={needs} initialDecisions={decisions} />

      <RoomDecisionBoard needs={needs} items={items} />
    </div>
  );
}
