import { ArrowRight, PushPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { InspirationRecord, RoomId } from "@/lib/domain";

export function RoomPins({ roomId, pins }: { roomId: RoomId; pins: InspirationRecord[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-[-0.035em]">Inspiration</h2>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/inspiration?capture=pin&room=${roomId}`}>Add pin <ArrowRight aria-hidden="true" size={14} /></Link>
        </Button>
      </div>
      <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {pins.map((pin, index) => {
          const preview = (
            <>
              <Image
                src={pin.image}
                alt={pin.title}
                fill
                sizes="(max-width: 768px) 35vw, 142px"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-contain transition-transform duration-300 group-hover:scale-[1.025]"
              />
              <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full border border-primary/15 bg-background/94 text-primary">
                <PushPin aria-hidden="true" size={14} weight="fill" />
              </span>
            </>
          );
          const className = "group relative aspect-[4/5] w-[35vw] max-w-[142px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card";
          return pin.sourceUrl ? (
            <a key={pin.id} href={pin.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${pin.title} source`} className={className}>
              {preview}
            </a>
          ) : (
            <div key={pin.id} className={className}>{preview}</div>
          );
        })}
      </div>
    </section>
  );
}
