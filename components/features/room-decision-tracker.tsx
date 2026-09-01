"use client";

import { PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { SeedData } from "@/lib/seed-data";

export function RoomDecisionTracker({ needs, initialDecisions }: { needs: SeedData["needs"]; initialDecisions: SeedData["decisions"] }) {
  const [decisions, setDecisions] = useState(initialDecisions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = decisions.find((decision) => decision.id === editingId) ?? null;
  const [draft, setDraft] = useState({ decision: "", reasoning: "", status: "decided" });

  function editDecision(id: string) {
    const decision = decisions.find((record) => record.id === id);
    if (!decision) return;
    setEditingId(id);
    setDraft({ decision: decision.decision, reasoning: decision.reasoning ?? "", status: decision.status });
  }

  function save() {
    if (!editingId) return;
    setDecisions((current) => current.map((decision) => decision.id === editingId ? { ...decision, decision: draft.decision.trim(), reasoning: draft.reasoning.trim() || null, status: draft.status } : decision));
    setEditingId(null);
  }

  return (
    <section aria-labelledby="decision-tracker-title">
      <div className="mb-3 flex items-center justify-between gap-3"><h2 id="decision-tracker-title" className="text-sm font-semibold">Decision tracker</h2><p className="text-[11px] text-muted-foreground">Open and made</p></div>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {needs.map((need) => <Link key={need.id} href={`#decision-${need.id}`} className="flex w-[210px] shrink-0 snap-start items-start gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/45 active:translate-y-px"><Badge variant="warning">open</Badge><span className="line-clamp-2 text-xs font-semibold leading-relaxed">{need.name}</span></Link>)}
        {decisions.map((decision) => {
          const open = decision.status === "leaning";
          return <button key={decision.id} type="button" onClick={() => editDecision(decision.id)} className={`flex w-[230px] shrink-0 snap-start items-start gap-2 rounded-xl border p-3 text-left transition-colors hover:border-primary/45 active:translate-y-px ${open ? "border-border bg-card" : "border-success/25 bg-success/8"}`}><Badge variant={open ? "warning" : "success"}>{open ? "open" : "made"}</Badge><span className="line-clamp-2 min-w-0 flex-1 text-xs font-semibold leading-relaxed">{decision.decision}</span><PencilSimple aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-muted-foreground" /></button>;
        })}
        {needs.length === 0 && decisions.length === 0 ? <p className="text-xs text-muted-foreground">No decisions tracked yet.</p> : null}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70"><DialogTitle>Edit decision</DialogTitle><DialogDescription>Keep the conclusion and its reasoning together.</DialogDescription></DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2"><label htmlFor="tracked-decision" className="text-sm font-semibold">Decision</label><Textarea id="tracked-decision" value={draft.decision} onChange={(event) => setDraft((current) => ({ ...current, decision: event.target.value }))} className="min-h-24" /></div>
            <div className="space-y-2"><label htmlFor="tracked-state" className="text-sm font-semibold">State</label><select id="tracked-state" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="leaning">Open</option><option value="decided">Made</option><option value="decided_direction">Direction made</option></select></div>
            <div className="space-y-2"><label htmlFor="tracked-reasoning" className="text-sm font-semibold">Reasoning</label><Textarea id="tracked-reasoning" value={draft.reasoning} onChange={(event) => setDraft((current) => ({ ...current, reasoning: event.target.value }))} className="min-h-24" /></div>
            <Button onClick={save} disabled={!draft.decision.trim()} className="w-full">Save decision</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
