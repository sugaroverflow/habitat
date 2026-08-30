"use client";

import { Check, PencilSimple, Ruler } from "@phosphor-icons/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SeedData } from "@/lib/seed-data";

export function RoomRecords({
  initialMeasurements,
  initialDecisions,
}: {
  initialMeasurements: SeedData["measurements"];
  initialDecisions: SeedData["decisions"];
}) {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [editing, setEditing] = useState<{ kind: "measurement" | "decision"; id: string } | null>(null);
  const [draft, setDraft] = useState({ label: "", value: "", confidence: "measured", reasoning: "", status: "decided" });

  function editMeasurement(id: string) {
    const record = measurements.find((measurement) => measurement.id === id);
    if (!record) return;
    setEditing({ kind: "measurement", id });
    setDraft({ label: record.label, value: String(record.value_cm), confidence: record.confidence, reasoning: "", status: "decided" });
  }

  function editDecision(id: string) {
    const record = decisions.find((decision) => decision.id === id);
    if (!record) return;
    setEditing({ kind: "decision", id });
    setDraft({ label: record.decision, value: "", confidence: "measured", reasoning: record.reasoning ?? "", status: record.status });
  }

  function save() {
    if (!editing) return;
    if (editing.kind === "measurement") {
      const value = Number(draft.value);
      setMeasurements((current) => current.map((record) => record.id === editing.id ? {
        ...record,
        label: draft.label.trim(),
        value_cm: Number.isFinite(value) ? value : record.value_cm,
        confidence: draft.confidence,
      } : record));
    } else {
      setDecisions((current) => current.map((record) => record.id === editing.id ? {
        ...record,
        decision: draft.label.trim(),
        reasoning: draft.reasoning.trim() || null,
        status: draft.status,
      } : record));
    }
    setEditing(null);
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="ruled-surface overflow-hidden rounded-2xl border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3.5">
            <h2 className="text-base font-semibold">Measurements</h2>
            <Badge variant="outline">{measurements.length}</Badge>
          </header>
          <div className="divide-y divide-border/70">
            {measurements.length ? measurements.map((measurement) => (
              <div key={measurement.id} className="flex items-center gap-3 px-4 py-3">
                <Ruler aria-hidden="true" size={16} className="shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{measurement.label}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">{measurement.confidence}</p>
                </div>
                <strong className="text-sm font-semibold tabular-nums">{measurement.value_cm} cm</strong>
                <Button variant="ghost" size="icon" className="size-9 min-h-9 shrink-0" onClick={() => editMeasurement(measurement.id)} aria-label={`Edit ${measurement.label}`}>
                  <PencilSimple aria-hidden="true" size={15} />
                </Button>
              </div>
            )) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No measurements added.</p>}
          </div>
        </section>

        <section className="ruled-surface overflow-hidden rounded-2xl border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3.5">
            <h2 className="text-base font-semibold">Decisions made</h2>
            <Badge variant="outline">{decisions.length}</Badge>
          </header>
          <div className="divide-y divide-border/70">
            {decisions.length ? decisions.map((decision) => (
              <article key={decision.id} className="flex gap-3 px-4 py-3.5">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Check aria-hidden="true" size={13} weight="bold" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-relaxed">{decision.decision}</p>
                  {decision.reasoning ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.reasoning}</p> : null}
                </div>
                <Button variant="ghost" size="icon" className="size-9 min-h-9 shrink-0" onClick={() => editDecision(decision.id)} aria-label="Edit decision">
                  <PencilSimple aria-hidden="true" size={15} />
                </Button>
              </article>
            )) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">No decisions recorded.</p>}
          </div>
        </section>
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>{editing?.kind === "measurement" ? "Edit measurement" : "Edit decision"}</DialogTitle>
            <DialogDescription>Changes stay in this browser session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="room-record-label" className="text-sm font-semibold">{editing?.kind === "measurement" ? "Label" : "Decision"}</label>
              {editing?.kind === "decision" ? (
                <Textarea id="room-record-label" value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} className="min-h-24" />
              ) : (
                <Input id="room-record-label" value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} />
              )}
            </div>
            {editing?.kind === "measurement" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="room-record-value" className="text-sm font-semibold">Value (cm)</label>
                  <Input id="room-record-value" inputMode="decimal" value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="room-record-confidence" className="text-sm font-semibold">Confidence</label>
                  <select id="room-record-confidence" value={draft.confidence} onChange={(event) => setDraft((current) => ({ ...current, confidence: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="measured">Measured</option>
                    <option value="approximate">Approximate</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="room-record-status" className="text-sm font-semibold">State</label>
                  <select id="room-record-status" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="leaning">Leaning</option>
                    <option value="decided">Decided</option>
                    <option value="decided_direction">Direction decided</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="room-record-reasoning" className="text-sm font-semibold">Reasoning</label>
                  <Textarea id="room-record-reasoning" value={draft.reasoning} onChange={(event) => setDraft((current) => ({ ...current, reasoning: event.target.value }))} className="min-h-24" />
                </div>
              </>
            )}
            <Button onClick={save} disabled={!draft.label.trim()} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
