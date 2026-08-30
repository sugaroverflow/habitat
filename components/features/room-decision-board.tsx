"use client";

import { ArrowSquareOut, ImageSquare, PencilSimple, Plus } from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { ITEM_STATUS_LABELS } from "@/components/features/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { normalizeItemStatus } from "@/lib/data";
import type { ItemStatus } from "@/lib/domain";
import type { SeedData, SeedItem } from "@/lib/seed-data";

const itemStatuses = Object.entries(ITEM_STATUS_LABELS) as Array<[ItemStatus, string]>;

function tier(status: ItemStatus) {
  if (status === "arrived") return { label: "Owned", variant: "success" as const };
  if (status === "ordered" || status === "shipped") return { label: "Bought", variant: "success" as const };
  if (status === "favourite") return { label: "Tier 1", variant: "default" as const };
  if (status === "shortlisted") return { label: "Tier 2", variant: "secondary" as const };
  if (status === "considering") return { label: "Tier 3", variant: "outline" as const };
  if (status === "rejected" || status === "returned") return { label: "Passed", variant: "outline" as const };
  return { label: "Saved", variant: "outline" as const };
}

export function RoomDecisionBoard({
  needs,
  items,
}: {
  needs: SeedData["needs"];
  items: SeedItem[];
}) {
  const initialNotes = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, item.assistant_assessment || item.user_notes || ""])),
    [items],
  );
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(
    () => Object.fromEntries(items.map((item) => [item.id, normalizeItemStatus(item)])),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ note: string; status: ItemStatus }>({ note: "", status: "saved" });
  const editingItem = items.find((item) => item.id === editingId) ?? null;

  function startEditing(item: SeedItem) {
    setEditingId(item.id);
    setDraft({ note: notes[item.id] ?? "", status: statuses[item.id] ?? normalizeItemStatus(item) });
  }

  function saveChanges() {
    if (!editingId) return;
    setNotes((current) => ({ ...current, [editingId]: draft.note.trim() }));
    setStatuses((current) => ({ ...current, [editingId]: draft.status }));
    setEditingId(null);
  }

  return (
    <section id="decisions" className="scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Compare the options</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">Open decisions</h2>
        </div>
        <Badge variant="outline">{needs.length} open</Badge>
      </div>

      <div className="space-y-4">
        {needs.length ? needs.map((need) => {
          const candidates = need.candidate_item_ids
            .map((itemId) => items.find((item) => item.id === itemId))
            .filter((item): item is SeedItem => Boolean(item));

          return (
            <article key={need.id} className="ruled-surface overflow-hidden rounded-2xl border bg-card">
              <header className="border-b border-border/70 px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.02em]">{need.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {need.requirements.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <Badge variant={need.priority === "high" ? "warning" : "outline"}>{need.priority}</Badge>
                </div>
              </header>

              {candidates.length ? (
                <div className="dot-field -mr-px flex snap-x gap-3 overflow-x-auto p-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
                  {candidates.map((item) => {
                    const itemTier = tier(statuses[item.id] ?? normalizeItemStatus(item));
                    const note = notes[item.id];
                    return (
                      <div
                        key={item.id}
                        className="w-[76vw] max-w-[290px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_24px_-22px_oklch(0.31_0.06_177/0.55)] sm:w-auto sm:max-w-none"
                      >
                        <div className="relative grid aspect-[16/9] place-items-center overflow-hidden border-b border-border bg-secondary/35 text-primary">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 76vw, 320px" className="object-contain p-2" />
                          ) : (
                            <>
                              <ImageSquare aria-hidden="true" size={25} />
                              <span className="absolute bottom-2 text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Photo not added</span>
                            </>
                          )}
                          <Badge variant={itemTier.variant} className="absolute left-2.5 top-2.5">{itemTier.label}</Badge>
                        </div>
                        <div className="p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            {item.category.replaceAll("_", " ")}
                          </p>
                          <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{item.name}</h4>
                          <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-relaxed text-muted-foreground">
                            {note || "No explanation yet."}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/65 pt-2">
                            <Button variant="ghost" size="sm" className="-ml-3" onClick={() => startEditing(item)}>
                              <PencilSimple aria-hidden="true" size={14} />
                              Edit
                            </Button>
                            {item.url ? (
                              <Button asChild variant="ghost" size="icon" className="size-9 min-h-9" aria-label={`Open ${item.name}`}>
                                <a href={item.url} target="_blank" rel="noreferrer">
                                  <ArrowSquareOut aria-hidden="true" size={15} />
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="dot-field px-4 py-8 text-center">
                  <p className="text-sm font-semibold">No items saved for this decision</p>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    Add an option and it will appear here with its note and tier.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <a href="/shopping"><Plus aria-hidden="true" size={14} /> View all items</a>
                  </Button>
                </div>
              )}
            </article>
          );
        }) : (
          <div className="dot-field rounded-2xl border border-dashed px-5 py-10 text-center">
            <p className="text-sm font-semibold">Nothing to decide right now</p>
            <p className="mt-1 text-xs text-muted-foreground">Add a decision when this room needs one.</p>
          </div>
        )}
      </div>

      <Dialog open={Boolean(editingItem)} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>Edit candidate</DialogTitle>
            <DialogDescription>{editingItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="candidate-state" className="text-sm font-semibold">State</label>
              <select
                id="candidate-state"
                value={draft.status}
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ItemStatus }))}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {itemStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="item-explanation" className="text-sm font-semibold">Why it is ranked here</label>
              <Textarea
                id="item-explanation"
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                placeholder="Add the trade-off, fit concern, or reason you prefer it."
                className="min-h-28"
              />
              <p className="text-[11px] text-muted-foreground">Saved in this browser for now.</p>
            </div>
            <Button onClick={saveChanges} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
