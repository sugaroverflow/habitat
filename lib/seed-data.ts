import { z } from "zod";

import { clover29Seed } from "@/seed/seed";

const nullableString = z.string().nullable();

const roomSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    notes: z.string().optional(),
  })
  .passthrough();

const measurementSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    room_id: z.string(),
    type: z.string(),
    value_cm: z.number(),
    confidence: z.string(),
    original: z.string(),
    notes: nullableString,
  })
  .passthrough();

const itemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    room_id: nullableString,
    ownership_status: z.string(),
    status: z.string(),
    purchase_status: z.string(),
    price: z
      .object({ amount: z.number(), currency: z.string() })
      .nullable(),
    dimensions: z.record(z.string(), z.union([z.string(), z.number()])).nullable(),
    url: nullableString,
    image: z.string().optional(),
    active_comparison: z.boolean().optional(),
    preference_rating: z.number().min(1).max(5).optional(),
    comparison: z.record(z.string(), z.string()).optional(),
    user_notes: z.string(),
    assistant_assessment: nullableString,
  })
  .passthrough();

const needSchema = z
  .object({
    id: z.string(),
    room_id: nullableString,
    name: z.string(),
    status: z.string(),
    priority: z.string(),
    requirements: z.array(z.string()),
    candidate_item_ids: z.array(z.string()),
  })
  .passthrough();

const decisionSchema = z
  .object({
    id: z.string(),
    room_id: nullableString,
    topic: z.string(),
    status: z.string(),
    decision: z.string(),
    reasoning: nullableString,
  })
  .passthrough();

const photoSchema = z
  .object({
    id: z.string(),
    kind: z.literal("room_photo"),
    path: z.string(),
    room_id: nullableString,
    status: z.string(),
    privacy: z.object({
      safe_filename: z.boolean(),
      metadata_stripped: z.boolean(),
      visual_reviewed: z.boolean(),
    }),
  })
  .passthrough();

const seedSchema = z.object({
  schema_version: z.string(),
  project: z.object({
    product_name: z.string(),
    home_nickname: z.string(),
    slug: z.string(),
    privacy_mode: z.string(),
    address_fields_allowed: z.literal(false),
    notes: z.string(),
  }),
  design_profile: z.object({
    name: z.string(),
    keywords: z.array(z.string()),
    palette: z.array(z.string()),
    avoid: z.array(z.string()),
    room_specific: z.record(z.string(), z.array(z.string())),
  }),
  rooms: z.array(roomSchema),
  measurements: z.array(measurementSchema),
  items: z.array(itemSchema),
  needs: z.array(needSchema),
  decisions: z.array(decisionSchema),
  conversation_sources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.string(),
      import_status: z.string(),
    }),
  ),
  assets: z.object({
    photos: z.array(photoSchema),
    floorplan: z.object({
      id: z.string(),
      kind: z.literal("floorplan"),
      path: z.string(),
      annotated_path: z.string(),
      status: z.literal("sanitized"),
      notes: z.string(),
    }),
  }),
  privacy_checks: z.record(z.string(), z.boolean()),
});

export const seedData = seedSchema.parse(clover29Seed);
export type SeedData = z.infer<typeof seedSchema>;
export type SeedItem = SeedData["items"][number];
