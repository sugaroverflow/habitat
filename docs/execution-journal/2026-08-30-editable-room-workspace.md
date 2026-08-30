## 2026-08-30T21:12:01Z - Editable room workspace and product image correction

### Goal

Make Clover 29 easier to use on a phone: organize work by room, put inspiration and room context before decisions, correct product links and photos, make planning records editable, and remove the Move and demo-oriented interface.

### Changes

- Reduced mobile navigation to Home, Rooms, Pins, and More. Removed the standalone Floor Plan navigation item; room pages link to the measured plan instead.
- Removed the Move route, component, seed records, and database table.
- Removed visual branding marks and demo/privacy callouts from the interface. The header now uses the plain Clover 29 name.
- Reordered room pages to inspiration, compact room photos with palette, open decisions, other items, measurements, and recorded decisions.
- Added browser-session editors for item state/name/price/note, decision tiers and explanations, pins, needs, measurements, and recorded decisions.
- Added all 35 supplied product URLs to the seed. Imported 26 exact-product images and re-encoded them under generated filenames with metadata stripped.
- Added the La Redoute shelving reference, Emma Original Mattress, and second Peking rug records that were missing from the seed.
- Tightened interface copy using the no-AI-slop rules and fixed singular candidate/option labels.

### Decisions

- Keep unverified product photos as explicit placeholders. A blocked retailer page or a generic collection page is not enough evidence to attach an image to a product.
- Keep edits local to the browser for this prototype. The pencil controls establish the interaction model without implying that persistence is already connected.
- Keep privacy enforcement active in sanitization, uploads, the assistant boundary, database shape, and repository checks while removing privacy messaging from the everyday interface.
- Treat room pages as the primary planning surface. Cross-room lists remain secondary views.

### Tradeoffs

- Nine linked records still show placeholders because the source pages did not expose a verifiable exact image: AIF Maison, La Redoute shelving, Tylko, Wallism wallpaper, the Etsy paper pendant, two Etsy Peking rugs, and both Haptic shelves in the saved Pure finish.
- Product images are repository assets rather than a live retailer sync. Retailer image changes will require a reviewed refresh.
- Browser-session edits reset on reload.

### Risks

- External product URLs and source images can expire.
- Haptic exposes blue/dark gallery images for the shelves, so those cards stay empty until the exact Pure-finish images are available.
- The Supabase schema is ready for persistence, but the editing controls are not wired to mutations yet.

### Verification

- `npm run privacy:check` passed after all image imports.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- Next generated 22 routes; `/move` returns 404.
- Playwright checked Home, Living Room, All items, Pins, Decision list, and Measurements at 390 × 844.
- Playwright confirmed that a room candidate can change from Tier 1 to Tier 2 and an ordered item can change to Shipped.
- Visually reviewed a contact sheet of the imported product images and removed a Wallism logo placeholder and two mismatched Haptic finishes.

### Demo Impact

The walkthrough now starts with a room and reads naturally on mobile: inspiration, the real room, its palette, then the decisions. Correct product imagery makes comparisons credible, and pencil actions show that the workspace can change as choices change.

### Customer-Facing Context

The prototype separates reviewed structured data from unsanitized imports. Product imagery is only attached after exact-item verification, and privacy controls remain enforced below the interface. Purchasing is intentionally non-autonomous: the app records and compares choices but does not place orders.

### Next Recommended Step

Connect the existing editors to Supabase mutations, then manually add exact image files for the nine blocked product or finish pages when source images are available.
