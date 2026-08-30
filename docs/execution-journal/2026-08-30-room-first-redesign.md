# Room-first redesign — 2026-08-30

## Outcome

Reworked Clover 29 around Rooms → Items. The mobile app now puts inspiration, room photos, and pending decisions in one room view.

## Decisions

- Use four mobile destinations: Home, Rooms, Pins, and More.
- Keep Pins, All items, Owned items, Measurements, and Conversations as secondary libraries.
- Replace the Pinterest board embed with reviewed native pins. A pin accepts a direct image URL, an optional source link, a room, and the specific details worth keeping.
- Show no product or owned-item photo unless the seed contains a verified photo for that record.
- Use explicit Tier 1, Tier 2, and Tier 3 labels for pending options. Seed assessments supply the initial explanation; missing or outdated explanations can be edited in the room.
- Keep prototype edits to pin records and tier explanations in browser state until Supabase persistence is connected.

## Privacy work

- Kept the sanitized room photos, floor plans, and reviewed inspiration assets as the only visible media.
- Retained the image-review confirmation in pin and in-person-find capture.
- Avoided storing external pin input or temporary explanation edits in the repository.
- Preserved the repository-wide ban on address, postcode, home coordinates, delivery details, and identifying media metadata.

## Verification

- `npm run privacy:check` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with all 23 static and dynamic routes generated.
- Checked Home, Bedroom, Pins, All items, the global Add menu, and the explanation editor at 390 × 844.
- Checked the Home layout and desktop navigation at 1440 × 900.
- Ran the no-AI-slop pattern check across interface copy; no listed patterns remained.

## Walkthrough

1. Open Home and choose a room.
2. Open Bedroom or Living Room to show photos, the palette, pinned references, and item tiers.
3. Edit a candidate explanation from its decision card.
4. Open Pins and add a direct image URL with a room and “What I like” notes.
5. Open All items to show honest photo placeholders for records without verified imagery.
6. Edit an item state from its pencil action.
7. Ask Home what can be ordered now.

## Follow-on work

- Connect Supabase persistence for pins, explanation edits, and item status changes.
- Add verified product and owned-item images to their exact records.
- Add room-aware item capture beyond the focused in-person-find demo.
