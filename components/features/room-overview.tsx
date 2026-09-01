import Image from "next/image";

import { ROOM_DESCRIPTIONS, ROOM_PALETTES, ROOM_PLANS } from "@/lib/data";
import type { RoomId } from "@/lib/domain";
import type { SeedData } from "@/lib/seed-data";

export function RoomOverview({
  roomId,
  roomName,
  photos,
}: {
  roomId: RoomId;
  roomName: string;
  photos: SeedData["assets"]["photos"];
}) {
  return (
    <section className="grid gap-7 border-y border-border/70 py-6 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] md:gap-8 lg:gap-10">
      <div className="min-w-0">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.035em]">Current room</h2>
        {photos.length ? (
          <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative aspect-[4/3] w-[42vw] max-w-[168px] shrink-0 snap-start overflow-hidden rounded-xl border border-border md:w-auto md:max-w-none">
                <Image
                  src={photo.path}
                  alt={`${roomName} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 767px) 42vw, (max-width: 1023px) 22vw, 180px"
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
      </div>

      <div className="min-w-0 md:border-l md:border-border/70 md:pl-8 lg:pl-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Room direction</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ROOM_DESCRIPTIONS[roomId]}</p>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Palette</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {ROOM_PALETTES[roomId].map((color) => (
              <div key={color.name} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="h-9 border-b border-foreground/8" style={{ backgroundColor: color.value }} />
                <p className="truncate px-2 py-1.5 text-[10px] font-semibold capitalize text-muted-foreground">{color.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Plan</h2>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-2">
            {ROOM_PLANS[roomId].map((point) => (
              <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
                <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
