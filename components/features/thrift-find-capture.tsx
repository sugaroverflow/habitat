"use client";

import {
  ArrowLeft,
  ArrowsLeftRight,
  Camera,
  Check,
  CheckCircle,
  Ruler,
  Tag,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Step = "capture" | "assessment" | "compare";

async function stripImageMetadata(file: File) {
  const bitmap = await createImageBitmap(file);
  const maximumSide = 1600;
  const scale = Math.min(1, maximumSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing unavailable");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Image processing failed"))),
      "image/jpeg",
      0.9,
    );
  });
  return URL.createObjectURL(blob);
}

function ComparisonRow({ label, thrift, online }: { label: string; thrift: string; online: string }) {
  return (
    <div className="grid grid-cols-[0.72fr_1fr_1fr] gap-2 border-t border-border py-3 text-xs">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="leading-relaxed">{thrift}</span>
      <span className="leading-relaxed">{online}</span>
    </div>
  );
}

export function ThriftFindCapture() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(searchParams.get("capture") === "find");
  const [step, setStep] = useState<Step>("capture");
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [title, setTitle] = useState("Vintage painted cabinet");
  const [price, setPrice] = useState("45");
  const [width, setWidth] = useState("90");
  const [depth, setDepth] = useState("32");
  const [height, setHeight] = useState("75");
  const [notes, setNotes] = useState("Potential hallway storage");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const spareDepth = useMemo(() => 35 - Number(depth || 0), [depth]);
  const fits = spareDepth >= 0;

  async function onImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    setImageError(null);
    try {
      const nextPreview = await stripImageMetadata(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(nextPreview);
    } catch {
      setImageError("This image could not be processed. Choose a different file.");
    } finally {
      setProcessing(false);
      event.target.value = "";
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImageError(null);
    setStep("assessment");
  }

  function reset() {
    setStep("capture");
    setImageError(null);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Tag aria-hidden="true" size={17} weight="fill" /> Add find
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader className="border-b border-border/70">
          <DialogTitle>{step === "capture" ? "Add a find" : step === "assessment" ? "It fits" : "Compare options"}</DialogTitle>
          <DialogDescription>
            {step === "capture"
              ? "Quick capture for something found in person."
              : step === "assessment"
                ? "Checked against the hallway console location."
                : "Vintage find beside the current online candidate."}
          </DialogDescription>
        </DialogHeader>

        {step === "capture" ? (
          <form onSubmit={onSubmit} className="space-y-4 p-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Photo</label>
              <label className="relative flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40 text-center transition-colors hover:bg-muted">
                {preview ? (
                  <Image src={preview} alt="Preview of thrift find" fill unoptimized className="object-cover" />
                ) : (
                  <span className="px-6 text-xs text-muted-foreground">
                    <Camera aria-hidden="true" size={25} className="mx-auto mb-2" />
                    {processing ? "Preparing photo..." : "Choose a photo"}
                  </span>
                )}
                <input type="file" accept="image/*" onChange={onImage} className="sr-only" />
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="find-title" className="text-sm font-semibold">Item</label>
              <Input id="find-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="find-price" className="text-sm font-semibold">Price (£)</label>
                <Input id="find-price" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="find-shop" className="text-sm font-semibold">Shop</label>
                <Input id="find-shop" defaultValue="Vintage shop" />
              </div>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Dimensions (cm)</legend>
              <div className="grid grid-cols-3 gap-2">
                <div><label htmlFor="find-width" className="mb-1 block text-[11px] text-muted-foreground">Width</label><Input id="find-width" inputMode="decimal" value={width} onChange={(event) => setWidth(event.target.value)} required /></div>
                <div><label htmlFor="find-depth" className="mb-1 block text-[11px] text-muted-foreground">Depth</label><Input id="find-depth" inputMode="decimal" value={depth} onChange={(event) => setDepth(event.target.value)} required /></div>
                <div><label htmlFor="find-height" className="mb-1 block text-[11px] text-muted-foreground">Height</label><Input id="find-height" inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value)} required /></div>
              </div>
            </fieldset>
            <div className="space-y-2">
              <label htmlFor="find-notes" className="text-sm font-semibold">Notes</label>
              <Textarea id="find-notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-20" />
            </div>
            {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
            <Button type="submit" className="w-full" disabled={processing}>Check this find</Button>
          </form>
        ) : null}

        {step === "assessment" ? (
          <div className="space-y-5 p-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {preview ? <div className="relative aspect-[16/10]"><Image src={preview} alt="Thrift find" fill unoptimized className="object-cover" /></div> : null}
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm font-semibold text-primary">£{price}</p></div>
                  <Badge variant={fits ? "success" : "warning"}>{fits ? "Fits" : "Too deep"}</Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{width} × {depth} × {height} cm · Hallway storage</p>
              </div>
            </div>
            <div className={fits ? "rounded-2xl bg-secondary p-4" : "rounded-2xl bg-warning/25 p-4"}>
              <div className="flex gap-3">
                {fits ? <CheckCircle aria-hidden="true" size={22} weight="fill" className="shrink-0 text-success" /> : <Ruler aria-hidden="true" size={22} className="shrink-0 text-warning-foreground" />}
                <div>
                  <p className="text-sm font-semibold">{fits ? `It fits with ${spareDepth} cm of spare depth.` : `It is ${Math.abs(spareDepth)} cm too deep.`}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The hallway location has a 35 cm useful-depth limit. This could replace the current custom-console candidate.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setStep("capture")}><ArrowLeft aria-hidden="true" size={15} /> Edit</Button>
              <Button onClick={() => setStep("compare")}><ArrowsLeftRight aria-hidden="true" size={16} /> Compare</Button>
            </div>
          </div>
        ) : null}

        {step === "compare" ? (
          <div className="p-5">
            <div className="grid grid-cols-[0.72fr_1fr_1fr] gap-2 pb-3 text-xs font-bold">
              <span />
              <span>Vintage find</span>
              <span>Tylko console</span>
            </div>
            <ComparisonRow label="Price" thrift={`£${price}`} online="Not captured" />
            <ComparisonRow label="Size" thrift={`${width} × ${depth} × ${height} cm`} online="Custom configuration" />
            <ComparisonRow label="Fit" thrift={fits ? `${spareDepth} cm spare depth` : "Too deep"} online="Depends on configuration" />
            <ComparisonRow label="Aesthetic" thrift="Characterful, painted, one-off" online="Clean, modern, customizable" />
            <ComparisonRow label="Storage" thrift="Useful closed cabinet" online="Strongest configurable storage" />
            <ComparisonRow label="Risk" thrift="Condition needs checking" online="Price and final size unknown" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setStep("assessment")}><ArrowLeft aria-hidden="true" size={15} /> Back</Button>
              <Button onClick={() => setOpen(false)}><Check aria-hidden="true" size={16} weight="bold" /> Save find</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
