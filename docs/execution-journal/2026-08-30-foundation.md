# Habitat foundation — 2026-08-30

## Outcome

Established the mobile-first Clover 29 prototype from the supplied seed data and media. The navigation, key planning views, capture flows, privacy controls, assistant boundary, Supabase model, and Pinterest collection are represented end to end.

## Decisions

- Use a five-destination mobile bar: Home, Rooms, Plan, Shopping, More. Keep all product areas in More and the desktop rail.
- Keep Ask Home persistent and provide a local deterministic responder when OpenAI credentials are absent.
- Make ChatKit opt-in until a workflow ID is configured, while keeping its server-issued client-secret route in place.
- Use the official Pinterest board widget for immediate collection integration. The app separately stores reviewed inspiration meaning because a visual embed is not structured memory.
- Treat `seed/seed.json` as the canonical seed and keep `seed/seed.ts` as a thin typed import.
- Keep Supabase tables single-home and locked by row-level security. No permissive anonymous policies were added.

## Privacy work

- Re-encoded supplied raster media, stripped metadata, and generated filenames.
- Removed unsafe source variants and packaged source archives after producing reviewed replacements.
- Removed identifying text from the measured floor-plan derivative; the sanitized plan is canonical.
- Added a repository scanner covering sensitive text patterns, forbidden schema fields, filenames, likely secrets, and embedded image metadata.
- Assistant input, retrieved objects, and output are sanitized; removed values are never stored for provenance.

## Verification target

Run `npm run privacy:check`, `npm run typecheck`, `npm run lint`, and `npm run build`, then verify the complete demo path at a mobile viewport.

## Walkthrough

1. Open Home for active work, order readiness, measurements, arrivals, and recent additions.
2. Open Conversations for sanitized historical context.
3. Open Living Room for photos, palette, needs, owned items, candidates, measurements, and decisions.
4. Open Inspiration and capture a Pinterest link.
5. Open Shopping, add a 90 × 32 × 75 cm thrift find, and show the 3 cm hallway fit result.
6. Compare the find with the online console candidate.
7. Ask Home what can be ordered now.

## Follow-on work

- Connect Supabase persistence once project credentials are available.
- Configure a ChatKit workflow and enable the hosted panel when desired.
- Add the one-time ChatGPT export selection, extraction, and import-review interface.
