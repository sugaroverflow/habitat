import { ArrowRight, PushPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { InspirationRecord, RoomId } from "@/lib/domain";

export function RoomPins({ roomId, pins }: { roomId: RoomId; pins: InspirationRecord[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Pinned to this room</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">Inspiration</h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/inspiration?capture=pin&room=${roomId}`}>Add pin <ArrowRight aria-hidden="true" size={14} /></Link>
        </Button>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
        {pins.slice(0, 4).map((pin) => (
          <article key={pin.id} className="ruled-surface w-[44vw] max-w-[174px] shrink-0 snap-start overflow-hidden rounded-xl border bg-card sm:w-auto sm:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
              <Image src={pin.image} alt={pin.title} fill sizes="(max-width: 768px) 44vw, 220px" className="object-cover" />
              <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full border border-primary/15 bg-background/94 text-primary">
                <PushPin aria-hidden="true" size={14} weight="fill" />
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold leading-snug">{pin.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{pin.whatILike.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
