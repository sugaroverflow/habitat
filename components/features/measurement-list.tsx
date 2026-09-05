"use client";

import { Check, PencilSimple, Warning } from "@phosphor-icons/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { pendingMeasurements } from "@/lib/data";
import type { SeedData } from "@/lib/seed-data";

function imperial(cm: number) {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainder = Math.round(inches - feet * 12);
  return `${feet}′ ${remainder}″`;
}

const roomNames: Record<string, string> = {
  bathroom: "Bathroom",
  bedroom: "Bedroom",
  dining_area: "Dining nook",
};

export function MeasurementList({ measurements }: { measurements: SeedData["measurements"] }) {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [records, setRecords] = useState(measurements);
  const [pending, setPending] = useState([...pendingMeasurements]);
  const [editing, setEditing] = useState<{ kind: "pending" | "captured"; id: string } | null>(null);
  const [draft, setDraft] = useState({ label: "", value: "", confidence: "measured" });
  const pendingByRoom = Object.entries(
    pending.reduce<Record<string, typeof pending>>((groups, measurement) => {
      (groups[measurement.roomId] ??= []).push(measurement);
      return groups;
    }, {}),
  );
  const criticalCount = pending.filter((measurement) => measurement.priority === "critical").length;

  function editPending(id: string) {
    const record = pending.find((entry) => entry.id === id);
    if (!record) return;
    setEditing({ kind: "pending", id });
    setDraft({ label: record.label, value: "", confidence: "needed" });
  }

  function editCaptured(id: string) {
    const record = records.find((entry) => entry.id === id);
    if (!record) return;
    setEditing({ kind: "captured", id });
    setDraft({ label: record.label, value: String(record.value_cm), confidence: record.confidence });
  }

  function saveMeasurement() {
    if (!editing) return;
    if (editing.kind === "pending") {
      setPending((current) => current.map((record) => record.id === editing.id ? { ...record, label: draft.label.trim() } : record));
    } else {
      const numericValue = Number(draft.value);
      setRecords((current) => current.map((record) => record.id === editing.id ? {
        ...record,
        label: draft.label.trim(),
        value_cm: Number.isFinite(numericValue) ? numericValue : record.value_cm,
        confidence: draft.confidence,
      } : record));
    }
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Display units</p>
        <div className="flex rounded-xl bg-muted p-1">
          <Button
            size="sm"
            variant={unit === "metric" ? "outline" : "ghost"}
            className="min-h-8 h-8 border-0 bg-transparent px-3 data-[active=true]:bg-background"
            data-active={unit === "metric"}
            onClick={() => setUnit("metric")}
          >
            Metric
          </Button>
          <Button
            size="sm"
            variant={unit === "imperial" ? "outline" : "ghost"}
            className="min-h-8 h-8 border-0 bg-transparent px-3 data-[active=true]:bg-background"
            data-active={unit === "imperial"}
            onClick={() => setUnit("imperial")}
          >
            Imperial
          </Button>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Measure tomorrow</h2>
            <p className="mt-1 text-xs text-muted-foreground">Start with the critical checks; the rest can follow if there is time.</p>
          </div>
          <Badge variant="warning">{criticalCount} critical</Badge>
        </div>
        <div className="space-y-5">
          {pendingByRoom.map(([roomId, roomMeasurements]) => (
            <div key={roomId}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{roomNames[roomId] ?? roomId.replaceAll("_", " ")}</h3>
                <span className="text-xs tabular-nums text-muted-foreground">{roomMeasurements.length}</span>
              </div>
              <div className="space-y-2">
                {roomMeasurements.map((measurement) => (
                  <article key={measurement.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${measurement.priority === "critical" ? "border-warning/40 bg-warning/20" : "border-border bg-card"}`}>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${measurement.priority === "critical" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Warning aria-hidden="true" size={17} weight="fill" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{measurement.label}</p>
                      <p className="mt-0.5 text-xs capitalize text-muted-foreground">{measurement.priority}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="size-9 min-h-9 shrink-0" onClick={() => editPending(measurement.id)} aria-label={`Edit ${measurement.label}`}>
                      <PencilSimple aria-hidden="true" size={15} />
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Captured</h2>
          <Badge variant="success">{records.length} measured</Badge>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {records.map((measurement) => (
            <article key={measurement.id} className="flex min-h-[66px] items-center gap-3 px-4 py-3">
              <Check aria-hidden="true" size={16} weight="bold" className="shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{measurement.label}</p>
                <p className="text-[11px] capitalize text-muted-foreground">
                  {measurement.room_id.replaceAll("_", " ")} · {measurement.confidence}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {unit === "metric" ? `${measurement.value_cm} cm` : imperial(measurement.value_cm)}
              </span>
              <Button variant="ghost" size="icon" className="size-9 min-h-9 shrink-0" onClick={() => editCaptured(measurement.id)} aria-label={`Edit ${measurement.label}`}>
                <PencilSimple aria-hidden="true" size={15} />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader className="border-b border-border/70">
            <DialogTitle>Edit measurement</DialogTitle>
            <DialogDescription>{editing?.kind === "pending" ? "Update the measurement you still need." : "Correct the recorded value or confidence."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label htmlFor="measurement-label" className="text-sm font-semibold">Label</label>
              <Input id="measurement-label" value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} />
            </div>
            {editing?.kind === "captured" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="measurement-value" className="text-sm font-semibold">Value (cm)</label>
                  <Input id="measurement-value" inputMode="decimal" value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="measurement-confidence" className="text-sm font-semibold">Confidence</label>
                  <select id="measurement-confidence" value={draft.confidence} onChange={(event) => setDraft((current) => ({ ...current, confidence: event.target.value }))} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="measured">Measured</option>
                    <option value="approximate">Approximate</option>
                  </select>
                </div>
              </div>
            ) : null}
            <p className="text-[11px] text-muted-foreground">Changes stay in this browser session.</p>
            <Button onClick={saveMeasurement} disabled={!draft.label.trim()} className="w-full">Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
