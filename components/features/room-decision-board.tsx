"use client";

import { ArrowSquareOut, ChatCircleText, ImageSquare, PencilSimple, Star } from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { DECISION_STATUS_OPTIONS, getDecisionStatus } from "@/components/features/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { normalizeItemStatus } from "@/lib/data";
import type { ItemStatus } from "@/lib/domain";
import type { SeedData, SeedItem } from "@/lib/seed-data";

const categoryLabels: Record<string, string> = {
  appliance: "Home appliances",
  bathroom_accessory: "Bathroom accessories",
  bathroom_shelf: "Shower storage",
  bed: "Bed frame",
  bedside_table: "Bedside tables",
  backsplash: "Backsplash",
  curtain_track: "Curtain tracks",
  curtain: "Curtains",
  desk: "Desk",
  dining_chair: "Dining chairs",
  dining_table: "Dining table",
  chest_of_drawers: "Bedroom storage",
  coat_storage: "Coat and drop zone",
  floor_lamp: "Floor lamp",
  mattress: "Mattress",
  mattress_topper: "Mattress topper",
  mirror: "Mirror",
  office_chair: "Desk chair",
  pendant_light: "Pendant light",
  pillow: "Pillows",
  rug: "Rug",
  runner_rug: "Runner",
  shelving: "TV and display storage",
  shoe_storage: "Shoe storage",
  sideboard: "Closed storage and console",
  sofa: "Seating",
  storage_bench: "Hallway bench",
  soundbar: "Soundbar",
  speaker: "Speakers",
  storage_console: "Hallway storage",
  television: "TV",
  underbed_storage: "Under-bed storage",
  wallpaper: "Wallpaper",
};

function defaultRating(item: SeedItem) {
  if (item.preference_rating) return item.preference_rating;
  const status = normalizeItemStatus(item);
  if (status === "favourite" || status === "arrived" || status === "ordered") return 5;
  if (status === "shortlisted") return 4;
  if (status === "considering") return 3;
  if (status === "rejected" || status === "returned") return 1;
  return 2;
}

const comparisonRows = [
  ["approx_setup_price", "Useful setup"],
  ["size_depth", "Size / depth"],
  ["fabric_direction", "Fabric"],
  ["delivery_stock", "Delivery / stock"],
  ["movie_pit", "Movie pit"],
  ["facing_halves", "Facing halves"],
  ["status_note", "Your status"],
  ["claimed_feel", "Claimed feel"],
  ["pressure_relief", "Pressure relief"],
  ["sink_hug", "Sink / hug"],
  ["underlying_support", "Underlying support"],
  ["casper_similarity", "Casper-ish"],
  ["firmer_than_casper", "Better if you want firmer"],
  ["too_soft_risk", "Too-soft risk"],
  ["rank", "Your ranking"],
  ["uk_sizes", "UK sizes"],
  ["panel_gaming", "Panel / gaming"],
  ["frame", "Frame"],
  ["reviews_catches", "Reviews / catches"],
  ["order_check", "Before ordering"],
  ["audio_path", "Audio path"],
  ["white_finish", "White?"],
  ["audio_depth", "Depth"],
  ["wiring", "Wiring"],
  ["gaming_audio", "Gaming"],
  ["dialogue", "Dialogue"],
  ["music", "Music"],
  ["expansion", "Expansion"],
  ["wall_fit", "For this wall"],
  ["king_price", "King price"],
  ["overall_dimensions", "King dimensions"],
  ["window_fit", "Fit in 353 cm zone"],
  ["construction_fabric", "Construction / fabric"],
  ["storage", "Storage"],
  ["aesthetic_rug", "Aesthetic + rug"],
  ["reviews", "Reviews"],
  ["table_type", "Table type"],
  ["extension", "Extension"],
  ["leaf_storage", "Leaf storage"],
  ["chair_tuck", "Chair tuck"],
  ["room_fit", "Room fit"],
  ["layer", "Layer"],
  ["heading", "Heading / track"],
  ["blackout", "Light control"],
  ["finish", "Finish"],
  ["sample_check", "Before ordering"],
] as const;

function priceLabel(amount: number | null, currency = "GBP") {
  if (amount === null) return "Check product page";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function dimensionsLabel(dimensions: SeedItem["dimensions"]) {
  if (!dimensions) return "Not listed";
  return Object.entries(dimensions)
    .map(([key, value]) => `${key.replaceAll("_", " ")} ${value}`)
    .join(" · ");
}

interface DecisionGroup {
  id: string;
  name: string;
  status: "open" | "made";
  requirements: string[];
  items: SeedItem[];
}

function buildGroups(needs: SeedData["needs"], items: SeedItem[]) {
  const activeItems = items.filter((item) => item.active_comparison !== false);
  const used = new Set<string>();
  const groups: DecisionGroup[] = needs.map((need) => {
    const candidates = need.candidate_item_ids
      .map((itemId) => activeItems.find((item) => item.id === itemId))
      .filter((item): item is SeedItem => Boolean(item));
    candidates.forEach((item) => used.add(item.id));
    return {
      id: need.id,
      name: need.name,
      status: need.status === "resolved" || need.status === "decided" ? "made" : "open",
      requirements: need.requirements,
      items: candidates,
    };
  });

  for (const item of activeItems.filter((candidate) => !used.has(candidate.id))) {
    const categoryName = (categoryLabels[item.category] ?? item.category.replaceAll("_", " ")).toLowerCase();
    const matchingGroup = item.ownership_status === "owned" ? undefined : groups.find((group) =>
      group.items.some((candidate) => candidate.category === item.category) ||
      group.name.toLowerCase().includes(categoryName.split(" ")[0]),
    );
    if (matchingGroup) {
      matchingGroup.items.push(item);
      used.add(item.id);
      continue;
    }

    const categoryGroup = groups.find((group) => group.id === `category-${item.category}`);
    if (categoryGroup) {
      categoryGroup.items.push(item);
    } else {
      const status = normalizeItemStatus(item);
      groups.push({
        id: `category-${item.category}`,
        name: categoryLabels[item.category] ?? item.category.replaceAll("_", " "),
        status: ["arrived", "ordered", "rejected", "returned"].includes(status) ? "made" : "open",
        requirements: [],
        items: [item],
      });
    }
    used.add(item.id);
  }

  for (const group of groups) {
    if (group.items.some((item) => item.preference_rating)) {
      group.items.sort((a, b) => (b.preference_rating ?? 0) - (a.preference_rating ?? 0));
    }
  }

  return groups;
}

function Stars({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return (
    <div className="flex items-center" aria-label={`${label}: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="grid size-7 place-items-center rounded-lg text-primary transition-transform hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.94]"
          aria-label={`Rate ${label} ${star} out of 5`}
        >
          <Star aria-hidden="true" size={16} weight={star <= value ? "fill" : "regular"} />
        </button>
      ))}
    </div>
  );
}

export function RoomDecisionBoard({ needs, items }: { needs: SeedData["needs"]; items: SeedItem[] }) {
  const groups = useMemo(() => buildGroups(needs, items), [items, needs]);
  const [names, setNames] = useState<Record<string, string>>(() => Object.fromEntries(items.map((item) => [item.id, item.name])));
  const [captions, setCaptions] = useState<Record<string, string>>(() => Object.fromEntries(items.map((item) => [item.id, item.assistant_assessment || ""])));
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => Object.fromEntries(items.map((item) => [item.id, item.user_notes || ""])));
  const [prices, setPrices] = useState<Record<string, number | null>>(() => Object.fromEntries(items.map((item) => [item.id, item.price?.amount ?? null])));
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => Object.fromEntries(items.map((item) => [item.id, normalizeItemStatus(item)])));
  const [ratings, setRatings] = useState<Record<string, number>>(() => Object.fromEntries(items.map((item) => [item.id, defaultRating(item)])));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", caption: "", userNote: "", price: "", status: "saved" as ItemStatus });
  const editingItem = items.find((item) => item.id === editingId) ?? null;

  function startEditing(item: SeedItem) {
    setEditingId(item.id);
    setDraft({
      name: names[item.id] ?? item.name,
      caption: captions[item.id] ?? "",
      userNote: userNotes[item.id] ?? "",
      price: prices[item.id]?.toString() ?? "",
      status: getDecisionStatus(statuses[item.id] ?? normalizeItemStatus(item)).value,
    });
  }

  function saveChanges() {
    if (!editingId) return;
    const amount = draft.price.trim() === "" ? null : Number(draft.price);
    setNames((current) => ({ ...current, [editingId]: draft.name.trim() }));
    setCaptions((current) => ({ ...current, [editingId]: draft.caption.trim() }));
    setUserNotes((current) => ({ ...current, [editingId]: draft.userNote.trim() }));
    setPrices((current) => ({ ...current, [editingId]: Number.isFinite(amount) ? amount : null }));
    setStatuses((current) => ({ ...current, [editingId]: draft.status }));
    setEditingId(null);
  }

  return (
    <section id="decisions" className="scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">Decision tracker</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">Compare items</h2>
        </div>
        <p className="max-w-44 text-right text-[11px] leading-relaxed text-muted-foreground">Swipe across to compare each category.</p>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <article id={`decision-${group.id}`} key={group.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card">
            <header className="flex items-start justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
              <div>
                <h3 className="text-base font-semibold tracking-[-0.02em]">{group.name}</h3>
                {group.requirements.length ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.requirements.slice(0, 3).join(" · ")}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.dispatchEvent(new CustomEvent("clover29:ask-home", { detail: { prompt: `Help me compare the ${group.name.toLowerCase()} options.` } }))}
                >
                  <ChatCircleText aria-hidden="true" size={14} /> Ask
                </Button>
                <Badge variant={group.status === "open" ? "warning" : "success"}>{group.status}</Badge>
              </div>
            </header>

            {group.items.length ? (
              <div className="overflow-x-auto">
                <table className="w-max min-w-full border-collapse text-left text-xs">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 w-24 min-w-24 border-r border-border bg-card p-3 align-bottom text-[10px] font-bold uppercase tracking-[0.11em] text-muted-foreground">Item</th>
                      {group.items.map((item) => {
                        const name = names[item.id] ?? item.name;
                        return (
                      <th key={item.id} className="w-[164px] min-w-[164px] border-r border-border/70 p-3 align-top last:border-r-0">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noreferrer" className="group/photo relative mx-auto block aspect-[4/3] w-28 overflow-hidden rounded-xl border border-border bg-secondary/25">
                                {item.image ? <Image src={item.image} alt={name} fill sizes="112px" className="object-contain p-2 transition-transform duration-300 group-hover/photo:scale-[1.025]" /> : <ImageSquare aria-hidden="true" size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />}
                                <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full border border-border bg-background/95 text-primary"><ArrowSquareOut aria-hidden="true" size={14} /></span>
                              </a>
                            ) : (
                              <div className="relative mx-auto grid aspect-[4/3] w-28 place-items-center overflow-hidden rounded-xl border border-border bg-secondary/25 text-primary">
                                {item.image ? <Image src={item.image} alt={name} fill sizes="112px" className="object-contain p-2" /> : <ImageSquare aria-hidden="true" size={24} />}
                              </div>
                            )}
                            <div className="mt-3 flex items-start gap-2">
                              <h4 className="line-clamp-3 min-w-0 flex-1 text-sm font-semibold leading-snug">{name}</h4>
                              <Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-9 min-h-9 shrink-0" onClick={() => startEditing(item)} aria-label={`Edit ${name}`}><PencilSimple aria-hidden="true" size={15} /></Button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 font-semibold text-muted-foreground">Your vote</th>
                      {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 last:border-r-0"><Stars value={ratings[item.id] ?? 0} label={names[item.id] ?? item.name} onChange={(value) => setRatings((current) => ({ ...current, [item.id]: value }))} /></td>)}
                    </tr>
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 font-semibold text-muted-foreground">Price</th>
                      {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 font-semibold text-primary last:border-r-0">{priceLabel(prices[item.id] ?? null, item.price?.currency)}</td>)}
                    </tr>
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 font-semibold text-muted-foreground">State</th>
                      {group.items.map((item) => {
                        const decisionStatus = getDecisionStatus(statuses[item.id] ?? normalizeItemStatus(item));
                        return <td key={item.id} className={`border-r border-border/70 p-3 last:border-r-0 ${decisionStatus.surface}`}><Badge variant={decisionStatus.variant} className="whitespace-nowrap">{decisionStatus.label}</Badge></td>;
                      })}
                    </tr>
                    {comparisonRows.map(([key, label]) => group.items.some((item) => item.comparison?.[key]) ? (
                      <tr key={key}>
                        <th className="sticky left-0 z-10 border-r border-border bg-card p-3 align-top font-semibold text-muted-foreground">{label}</th>
                        {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 align-top leading-relaxed text-foreground last:border-r-0">{item.comparison?.[key] ?? "—"}</td>)}
                      </tr>
                    ) : null)}
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 align-top font-semibold text-muted-foreground">Chat takeaway</th>
                      {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 align-top leading-relaxed text-foreground last:border-r-0">{captions[item.id] || "No takeaway recorded yet."}</td>)}
                    </tr>
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 align-top font-semibold text-muted-foreground">You said</th>
                      {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 align-top leading-relaxed text-muted-foreground last:border-r-0">{userNotes[item.id] || "No note recorded yet."}</td>)}
                    </tr>
                    <tr>
                      <th className="sticky left-0 z-10 border-r border-border bg-card p-3 align-top font-semibold text-muted-foreground">Dimensions</th>
                      {group.items.map((item) => <td key={item.id} className="border-r border-border/70 p-3 align-top leading-relaxed text-muted-foreground last:border-r-0">{dimensionsLabel(item.dimensions)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dot-field px-5 py-9 text-center"><p className="text-sm font-semibold">No items saved yet</p><p className="mt-1 text-xs text-muted-foreground">Add the first candidate when you find one.</p></div>
            )}
          </article>
        ))}
        {groups.length === 0 ? (
          <div className="dot-field rounded-2xl border border-dashed border-border px-5 py-10 text-center">
            <p className="text-sm font-semibold">Nothing to compare yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add an item when this room needs a decision.</p>
          </div>
        ) : null}
      </div>

      <Dialog open={Boolean(editingItem)} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70"><DialogTitle>Edit item</DialogTitle><DialogDescription>Update the comparison without leaving the room.</DialogDescription></DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2"><label htmlFor="comparison-name" className="text-sm font-semibold">Name</label><Input id="comparison-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><label htmlFor="comparison-state" className="text-sm font-semibold">State</label><select id="comparison-state" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ItemStatus }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">{DECISION_STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              <div className="space-y-2"><label htmlFor="comparison-price" className="text-sm font-semibold">Price (£)</label><Input id="comparison-price" inputMode="decimal" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} placeholder="Optional" /></div>
            </div>
            <div className="space-y-2"><label htmlFor="comparison-user-note" className="text-sm font-semibold">You said</label><Textarea id="comparison-user-note" value={draft.userNote} onChange={(event) => setDraft((current) => ({ ...current, userNote: event.target.value }))} className="min-h-24" /></div>
            <div className="space-y-2"><label htmlFor="comparison-caption" className="text-sm font-semibold">Chat takeaway</label><Textarea id="comparison-caption" value={draft.caption} onChange={(event) => setDraft((current) => ({ ...current, caption: event.target.value }))} placeholder="Add the trade-off or recommendation from the conversation." className="min-h-24" /></div>
            <p className="text-[11px] text-muted-foreground">Votes and edits last for this browser session.</p>
            <Button onClick={saveChanges} disabled={!draft.name.trim()} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
