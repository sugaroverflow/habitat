"use client";

import { ArrowSquareOut, Heart, ImageSquare, PencilSimple } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { StatusBadge, ITEM_STATUS_LABELS } from "@/components/features/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { normalizeItemStatus } from "@/lib/data";
import type { ItemStatus } from "@/lib/domain";
import type { SeedItem } from "@/lib/seed-data";

const itemStatuses = Object.entries(ITEM_STATUS_LABELS) as Array<[ItemStatus, string]>;

function priceLabel(amount: number | null, currency = "GBP") {
  if (amount === null) return "Price not added";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ItemCard({ item, compact = false }: { item: SeedItem; compact?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [status, setStatus] = useState<ItemStatus>(normalizeItemStatus(item));
  const [note, setNote] = useState(item.assistant_assessment || item.user_notes || "");
  const [price, setPrice] = useState(item.price?.amount?.toString() ?? "");
  const [draft, setDraft] = useState({ name, status, note, price });

  function openEditor() {
    setDraft({ name, status, note, price });
    setEditing(true);
  }

  function save() {
    setName(draft.name.trim());
    setStatus(draft.status);
    setNote(draft.note.trim());
    setPrice(draft.price.trim());
    setEditing(false);
  }

  const numericPrice = price.trim() === "" ? null : Number(price);
  const imageContent = item.image ? (
    <Image src={item.image} alt={name} fill sizes="104px" className="object-contain p-1.5" />
  ) : (
    <>
      <ImageSquare aria-hidden="true" size={24} />
      <span className="absolute inset-x-2 bottom-2 text-center text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        Photo not added
      </span>
    </>
  );
  const imageClassName = "dot-field relative grid min-h-32 place-items-center overflow-hidden border-r border-border/70 text-primary";

  return (
    <>
      <article className="ruled-surface grid min-w-0 grid-cols-[88px_1fr] overflow-hidden rounded-2xl border bg-card sm:grid-cols-[104px_1fr]">
        {item.url ? <a href={item.url} target="_blank" rel="noreferrer" className={imageClassName} aria-label={`Open product page for ${name}`}>{imageContent}</a> : <div className={imageClassName}>{imageContent}</div>}
        <div className="min-w-0 p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <StatusBadge status={status} />
            <div className="flex items-center gap-1">
              {status === "favourite" ? <Heart aria-hidden="true" size={16} weight="fill" className="shrink-0 text-primary" /> : null}
              <Button variant="ghost" size="icon" className="size-9 min-h-9" onClick={openEditor} aria-label={`Edit ${name}`}>
                <PencilSimple aria-hidden="true" size={15} />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.11em] text-muted-foreground">
            {item.category.replaceAll("_", " ")}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.015em]">{name}</h3>
          <p className="mt-1.5 text-xs font-semibold text-primary">{priceLabel(numericPrice !== null && Number.isFinite(numericPrice) ? numericPrice : null, item.price?.currency)}</p>
          {!compact && note ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
          {item.url ? (
            <Button asChild variant="ghost" size="sm" className="mt-2 -ml-3">
              <a href={item.url} target="_blank" rel="noreferrer">
                Product page <ArrowSquareOut aria-hidden="true" size={14} />
              </a>
            </Button>
          ) : null}
        </div>
      </article>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>Edit item</DialogTitle>
            <DialogDescription>Change its name, state, price, or note.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor={`item-name-${item.id}`} className="text-sm font-semibold">Name</label>
              <Input id={`item-name-${item.id}`} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor={`item-status-${item.id}`} className="text-sm font-semibold">State</label>
                <select
                  id={`item-status-${item.id}`}
                  value={draft.status}
                  onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ItemStatus }))}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {itemStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor={`item-price-${item.id}`} className="text-sm font-semibold">Price (£)</label>
                <Input id={`item-price-${item.id}`} inputMode="decimal" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} placeholder="Optional" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor={`item-note-${item.id}`} className="text-sm font-semibold">Note</label>
              <Textarea id={`item-note-${item.id}`} value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} className="min-h-28" />
            </div>
            <p className="text-[11px] text-muted-foreground">Changes stay in this browser session.</p>
            <Button onClick={save} className="w-full" disabled={!draft.name.trim()}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
