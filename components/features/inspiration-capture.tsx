"use client";

import { CheckCircle, ImageSquare, Plus } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InspirationRecord, RoomId } from "@/lib/domain";

export type CapturedPin = Pick<InspirationRecord, "title" | "image" | "sourceUrl" | "roomId" | "whatILike">;

export function InspirationCapture({
  rooms,
  onSave,
}: {
  rooms: Array<{ id: string; name: string }>;
  onSave: (pin: CapturedPin) => void;
}) {
  const searchParams = useSearchParams();
  const requestedRoom = searchParams.get("room");
  const [open, setOpen] = useState(["pin", "pinterest"].includes(searchParams.get("capture") ?? ""));
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [roomId, setRoomId] = useState(requestedRoom ?? rooms[0]?.id ?? "living_room");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validWebUrl(value: string) {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!validWebUrl(imageUrl) || (sourceUrl && !validWebUrl(sourceUrl))) throw new Error("Invalid URL");
      onSave({
        title: title.trim(),
        image: imageUrl.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        roomId: roomId as RoomId,
        whatILike: notes.split(",").map((note) => note.trim()).filter(Boolean),
      });
      setError(null);
      setSaved(true);
    } catch {
      setError("Add a valid image URL. The source link is optional.");
    }
  }

  function reset() {
    setSaved(false);
    setTitle("");
    setImageUrl("");
    setSourceUrl("");
    setNotes("");
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus aria-hidden="true" size={16} /> Add pin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b border-border/70">
          <DialogTitle>Add a pin</DialogTitle>
          <DialogDescription>Save the image, source, room, and the details worth keeping.</DialogDescription>
        </DialogHeader>
        {!saved ? (
          <form onSubmit={submit} className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="pin-title" className="text-sm font-semibold">Title</label>
              <Input id="pin-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Painted cabinet with floral detail" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-image-url" className="text-sm font-semibold">Image URL</label>
              <div className="relative">
                <ImageSquare aria-hidden="true" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                <Input id="pin-image-url" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://.../image.jpg" className="pl-10" required />
              </div>
              <p className="text-[11px] text-muted-foreground">Use a direct image link rather than a board link.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-source-url" className="text-sm font-semibold">Source link <span className="font-normal text-muted-foreground">optional</span></label>
              <Input id="pin-source-url" type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Pinterest pin or original page" />
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-room" className="text-sm font-semibold">Room</label>
              <select
                id="pin-room"
                value={roomId}
                onChange={(event) => setRoomId(event.target.value)}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-notes" className="text-sm font-semibold">What I like</label>
              <Textarea id="pin-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="jade finish, painted florals, layered objects" required />
              <p className="text-[11px] text-muted-foreground">Separate details with commas.</p>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full">Save pin</Button>
          </form>
        ) : (
          <div className="space-y-4 p-5">
            <div className="flex gap-3 rounded-2xl border border-primary/20 bg-secondary p-4">
              <CheckCircle aria-hidden="true" size={22} weight="fill" className="shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Pin added</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Added to the selected room.</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
