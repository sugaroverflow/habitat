"use client";

import { ArrowSquareOut, PencilSimple, PushPin } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { InspirationCapture, type CapturedPin } from "@/components/features/inspiration-capture";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InspirationRecord, RoomId } from "@/lib/domain";
import { cn } from "@/lib/utils";

function PinImage({ pin, priority = false }: { pin: InspirationRecord; priority?: boolean }) {
  if (pin.image.startsWith("/")) {
    return (
      <Image
        src={pin.image}
        alt={pin.title}
        fill
        sizes="(max-width: 768px) 50vw, 320px"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="object-cover"
      />
    );
  }
  return (
    // Direct image URLs are user-reviewed before display and are not stored by the prototype yet.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={pin.image} alt={pin.title} referrerPolicy="no-referrer" className="size-full object-cover" />
  );
}

export function PinLibrary({
  initialPins,
  rooms,
}: {
  initialPins: InspirationRecord[];
  rooms: Array<{ id: string; name: string }>;
}) {
  const [pins, setPins] = useState(initialPins);
  const [filter, setFilter] = useState<"all" | RoomId>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", roomId: "", status: "reviewed", whatILike: "" });
  const filtered = filter === "all" ? pins : pins.filter((pin) => pin.roomId === filter || pin.roomId === null);

  function editPin(pin: InspirationRecord) {
    setEditingId(pin.id);
    setDraft({
      title: pin.title,
      roomId: pin.roomId ?? "",
      status: pin.status,
      whatILike: pin.whatILike.join(", "),
    });
  }

  function savePin() {
    if (!editingId) return;
    setPins((current) => current.map((pin) => pin.id === editingId ? {
      ...pin,
      title: draft.title.trim(),
      roomId: draft.roomId ? draft.roomId as RoomId : null,
      status: draft.status as InspirationRecord["status"],
      whatILike: draft.whatILike.split(",").map((value) => value.trim()).filter(Boolean),
    } : pin));
    setEditingId(null);
  }

  function addPin(pin: CapturedPin) {
    setPins((current) => [
      {
        id: `session-${Date.now()}`,
        title: pin.title,
        image: pin.image,
        source: pin.sourceUrl?.includes("pinterest") ? "pinterest" : "reference",
        sourceUrl: pin.sourceUrl,
        roomId: pin.roomId,
        tags: [],
        whatILike: pin.whatILike,
        notNecessarily: [],
        status: "reviewed",
      },
      ...current,
    ]);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`${pins.length} reviewed pins`}
        title="Pins"
        description="Save what you like, where it belongs, and the original link."
        action={<InspirationCapture rooms={rooms} onSave={addPin} />}
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Filter pins by room">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All rooms</Button>
        {rooms.map((room) => (
          <Button key={room.id} size="sm" variant={filter === room.id ? "default" : "outline"} onClick={() => setFilter(room.id as RoomId)}>
            {room.name}
          </Button>
        ))}
      </div>

      <section className="columns-2 gap-3 md:columns-3 xl:columns-4">
        {filtered.map((pin, index) => {
          const room = rooms.find((entry) => entry.id === pin.roomId);
          return (
            <article key={pin.id} className="ruled-surface mb-3 break-inside-avoid overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[4/5] overflow-hidden border-b border-border">
                <PinImage pin={pin} priority={index < 2} />
                <div className="absolute right-2.5 top-2.5 flex gap-1.5">
                  <span className="grid size-8 place-items-center rounded-full border border-primary/15 bg-background/94 text-primary">
                    <PushPin aria-hidden="true" size={14} weight="fill" />
                  </span>
                  <Button variant="secondary" size="icon" className="size-8 min-h-8 rounded-full" onClick={() => editPin(pin)} aria-label={`Edit ${pin.title}`}>
                    <PencilSimple aria-hidden="true" size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{room?.name ?? "Whole home"}</Badge>
                  <Badge variant="outline">{pin.status}</Badge>
                </div>
                <h2 className="mt-2.5 text-sm font-semibold leading-snug">{pin.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{pin.whatILike.join(" · ")}</p>
                {pin.sourceUrl ? (
                  <Button asChild variant="ghost" size="sm" className={cn("mt-2 -ml-3")}>
                    <a href={pin.sourceUrl} target="_blank" rel="noreferrer">Source <ArrowSquareOut aria-hidden="true" size={14} /></a>
                  </Button>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <Dialog open={Boolean(editingId)} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>Edit pin</DialogTitle>
            <DialogDescription>Edit the details you want to carry into the room.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="pin-title" className="text-sm font-semibold">Title</label>
              <Input id="pin-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="pin-room" className="text-sm font-semibold">Room</label>
                <select id="pin-room" value={draft.roomId} onChange={(event) => setDraft((current) => ({ ...current, roomId: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="">Whole home</option>
                  {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="pin-status" className="text-sm font-semibold">State</label>
                <select id="pin-status" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="inbox">Inbox</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="applied">Applied</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-details" className="text-sm font-semibold">What I like</label>
              <Textarea id="pin-details" value={draft.whatILike} onChange={(event) => setDraft((current) => ({ ...current, whatILike: event.target.value }))} placeholder="Separate details with commas" className="min-h-24" />
            </div>
            <p className="text-[11px] text-muted-foreground">Saved in this browser for now.</p>
            <Button onClick={savePin} disabled={!draft.title.trim()} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
