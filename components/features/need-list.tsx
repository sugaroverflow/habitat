"use client";

import { ArrowRight, CheckCircle, Circle, LinkSimple, PencilSimple, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SeedData } from "@/lib/seed-data";

type Need = SeedData["needs"][number];

export function NeedList({ initialNeeds }: { initialNeeds: Need[] }) {
  const [needs, setNeeds] = useState(initialNeeds);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", priority: "medium", status: "open", requirements: "" });

  function editNeed(need: Need) {
    setEditingId(need.id);
    setDraft({ name: need.name, priority: need.priority, status: need.status, requirements: need.requirements.join("\n") });
  }

  function saveNeed() {
    if (!editingId) return;
    setNeeds((current) => current.map((need) => need.id === editingId ? {
      ...need,
      name: draft.name.trim(),
      priority: draft.priority,
      status: draft.status,
      requirements: draft.requirements.split("\n").map((value) => value.trim()).filter(Boolean),
    } : need));
    setEditingId(null);
  }

  return (
    <>
      <div className="space-y-3">
        {needs.map((need) => (
          <article key={need.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className={need.status === "near_decision" ? "grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground" : "grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"}>
                {need.status === "near_decision" ? <CheckCircle aria-hidden="true" size={18} weight="fill" /> : need.priority === "high" ? <Warning aria-hidden="true" size={18} /> : <Circle aria-hidden="true" size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold">{need.name}</h2>
                    <Badge variant={need.priority === "high" ? "warning" : "outline"}>{need.priority}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="size-9 min-h-9 shrink-0" onClick={() => editNeed(need)} aria-label={`Edit ${need.name}`}>
                    <PencilSimple aria-hidden="true" size={15} />
                  </Button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{need.requirements.join(" · ")}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <LinkSimple aria-hidden="true" size={14} /> {need.candidate_item_ids.length} {need.candidate_item_ids.length === 1 ? "candidate" : "candidates"}
                  </span>
                  {need.room_id ? (
                    <Link href={`/rooms/${need.room_id}`} className="flex min-h-9 items-center gap-1 text-xs font-semibold text-primary">
                      View room <ArrowRight aria-hidden="true" size={14} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={Boolean(editingId)} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>Edit decision</DialogTitle>
            <DialogDescription>Change its state, priority, or requirements.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="need-name" className="text-sm font-semibold">Name</label>
              <Input id="need-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="need-status" className="text-sm font-semibold">State</label>
                <select id="need-status" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="open">Open</option>
                  <option value="decision_in_progress">In progress</option>
                  <option value="near_decision">Nearly decided</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="need-priority" className="text-sm font-semibold">Priority</label>
                <select id="need-priority" value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="need-requirements" className="text-sm font-semibold">Requirements</label>
              <Textarea id="need-requirements" value={draft.requirements} onChange={(event) => setDraft((current) => ({ ...current, requirements: event.target.value }))} className="min-h-32" />
              <p className="text-[11px] text-muted-foreground">Use one requirement per line. Changes stay in this browser session.</p>
            </div>
            <Button onClick={saveNeed} disabled={!draft.name.trim()} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
