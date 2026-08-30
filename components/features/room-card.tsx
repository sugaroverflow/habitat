import { ArrowRight, CheckCircle, Ruler } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { ROOM_COVERS, ROOM_PALETTES } from "@/lib/data";
import type { RoomId } from "@/lib/domain";
import type { SeedData } from "@/lib/seed-data";

export function RoomCard({
  room,
  itemCount,
  needCount,
  measurementCount,
  priority = false,
}: {
  room: SeedData["rooms"][number];
  itemCount: number;
  needCount: number;
  measurementCount: number;
  priority?: boolean;
}) {
  const roomId = room.id as RoomId;

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group ruled-surface grid min-h-40 grid-cols-[39%_1fr] overflow-hidden rounded-2xl border bg-card outline-none transition-[transform,border-color,box-shadow] hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px sm:min-h-52"
    >
      <div className="relative min-h-full overflow-hidden border-r border-border">
        <Image
          src={ROOM_COVERS[roomId]}
          alt={`${room.name} before decorating`}
          fill
          sizes="(max-width: 768px) 39vw, 340px"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
      </div>
      <div className="flex min-w-0 flex-col p-4 sm:p-5">
        <div className="flex gap-1" aria-label={`${room.name} palette`}>
          {ROOM_PALETTES[roomId].slice(0, 5).map((colour) => (
            <span
              key={colour.name}
              title={colour.name}
              className="size-3 rounded-full border border-foreground/10"
              style={{ backgroundColor: colour.value }}
            />
          ))}
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em]">{room.name}</h2>
        {room.notes ? (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {room.notes}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle aria-hidden="true" size={13} /> {needCount} decisions
          </span>
          <span className="flex items-center gap-1">
            <Ruler aria-hidden="true" size={13} /> {measurementCount}
          </span>
          <span>{itemCount} items</span>
        </div>
        <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
          View room <ArrowRight aria-hidden="true" size={14} />
        </span>
      </div>
    </Link>
  );
}
