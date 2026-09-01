## 2026-08-31T22:53:09Z - Decision-led room comparisons

### Goal

Make the mobile room experience more useful than a product catalogue by organising saved context around decisions, comparisons, and room-specific conversation.

### Changes

- Reordered room pages around the decision workflow: room status, decision tracker, current photos, palette, inspiration, and categorised item comparisons.
- Replaced disconnected option cards with horizontally scrollable comparison tables for categories such as main sofa, TV storage, rug, and bed.
- Added five-star preference voting, editable item captions and states, linked product images, and retailer prices where an official page exposed a reliable current value.
- Made Ask Home room-aware and added category-level Ask actions that open the assistant with a comparison prompt already prepared.
- Reduced primary navigation to Home, Rooms, and History; removed measurement work from the visible workflow and added Bathroom to featured rooms.
- Updated seed captions with relevant conversation takeaways and removed the generated “Other room item” grouping.

### Decisions

- Decisions and needs are the organisational spine. Products remain in named category boxes so their price, fit, preference, and conversation history can be compared in one place.
- Measurements are hidden from the primary UI because there are no missing-measurement tasks. Existing dimensions remain available internally for fit reasoning.
- Inspiration pins remain image-only and horizontally scrollable on mobile; context belongs in decisions and item comparisons rather than repeated pin captions.
- The local assistant provides deterministic room-specific comparison summaries when an OpenAI key is unavailable. The runtime agent receives the current room ID and retrieves items, needs, and decisions for that room.

### Tradeoffs

- Voting and inline edits currently update browser state only; they are interaction-complete for the prototype but are not yet persisted to Supabase.
- Retail prices are seed snapshots, not live price tracking. Items without a reliable official price deliberately show a link to check the product page instead of a guessed value.
- Comparison tables use horizontal scrolling on narrow screens to preserve readable row labels and full product context.

### Risks

- Retailer prices, sale states, and product availability can change after the seed snapshot.
- The assistant becomes genuinely durable only after edits, votes, and chat-derived conclusions share a persisted structured store.
- Existing direct routes outside the simplified primary navigation remain reachable by URL, although they are no longer part of the main mobile journey.

### Verification

- TypeScript, ESLint, and the repository privacy check passed.
- The production build passed with Next.js's documented Webpack flag. The default Turbopack build could not bind a local process/port in the sandbox.
- Validated the 390 x 844 mobile flow in a real browser: room ordering, Bathroom presence, History navigation, category scrolling, linked images, five-star voting, edit controls, and contextual Ask Home comparisons.
- Confirmed no browser console warnings or errors in the final room view.
- No subagents were used.

### Demo Impact

The demo now shows why structured memory is valuable: a room opens directly onto the decisions being made, candidates can be compared against conversation takeaways, and Ask Home starts with the room or item category already in context.

### Customer-Facing Context

The assistant is bounded to selected room context and sanitized seed data. It does not purchase products or perform external side effects. Deterministic comparison fallbacks keep the core demo useful without an active model integration.

### Next Recommended Step

Persist votes, inline edits, and assistant-saved conclusions in Supabase so the decision history survives refreshes and becomes shared context for future conversations.

## 2026-08-31T23:00:10Z - Structured mattress comparison

### Goal

Record the completed mattress choice without losing the evidence behind it.

### Changes

- Marked the OTTY Original Hybrid mattress and Bamboo Charcoal topper as ordered and added a made Bedroom decision.
- Added Simba Hybrid and Eve Original Hybrid to the mattress category alongside OTTY and Emma Original 2026.
- Stored the supplied feel, pressure relief, sink, support, Casper similarity, softness risk, and ranking as structured comparison fields.
- Added those fields as optional comparison rows in room tables and used the supplied ranking to initialise preference votes and column order.
- Added sanitized official product imagery for Simba and Eve and a mattress-aware local Ask Home response.

### Decisions

Comparison evidence belongs on item records rather than only in conversation prose, so the same facts can appear in the table and assistant context.

### Tradeoffs

Order totals and delivery dates were not inferred because they were not supplied. Current prices are therefore left unset.

### Risks

The order state is durable in seed data, but future edits and votes made through the UI remain browser-session-only.

### Verification

The seed parses against its schema. TypeScript, ESLint, privacy scanning, diff checks, and the production Webpack build passed. The two added product images were re-encoded without metadata after the privacy scanner rejected their first copies.

### Demo Impact

The Bedroom now demonstrates how a conversation table becomes durable decision memory: the winning product, alternatives, reasoning, and purchase state remain visible together.

### Customer-Facing Context

The app distinguishes user-supplied comparison judgments from retailer-linked product records and does not invent missing order details.

### Next Recommended Step

Persist future order updates and post-arrival comfort notes so the comparison can be evaluated against the real ownership experience.

## 2026-08-31T23:07:44Z - Active sofa shortlist refresh

### Goal

Replace the stale main-sofa comparison with the user's current 15-option evaluation while retaining superseded research as history.

### Changes

- Added Carlyle, Kate, Sky, Romy, King Aura, John Lewis Flow, Zaya, Flom, King 1977, and Squishblocks product records.
- Updated Auburn, Nala, Keira, Wolke, and Malmo with the latest useful-setup price, physical configuration, fabric direction, availability, movie-pit score, facing-halves score, and current conclusion.
- Generalised item comparison fields so room tables can render category-specific evidence beyond mattresses.
- Added an `active_comparison` flag: Lisbon, Miyo, and Maison remain searchable seed history but no longer appear in the active Main sofa table.
- Added generated, metadata-stripped local images sourced from the official retailer pages for the ten new candidates.
- Updated the room-aware assistant fallback to recommend an in-stock Auburn module investigation before comparing Carlyle and Nala.

### Decisions

The two layout scores remain independent comparison criteria; they do not overwrite the user's separate five-star preference vote. Historical candidates are hidden rather than deleted.

### Tradeoffs

Approximate and configuration-dependent prices are retained as text. The numeric price field is used only where the supplied setup resolves to a useful total or lower bound.

### Risks

Stock, delivery windows, sale prices, fabric counts, and module availability are snapshots and require reconfirmation before purchase.

### Verification

Official retailer pages were used to resolve product links and images. The seed was checked for an exact 15-item Main sofa candidate list. TypeScript, ESLint, the privacy scan, and diff validation passed. The production build passed with Next.js's documented Webpack flag. No subagents were used.

### Demo Impact

The Living Room now demonstrates a serious decision process rather than a bookmark grid: the table shows why visually appealing sofas fail or advance against two concrete room-use modes.

### Customer-Facing Context

User judgments and time-sensitive retailer facts remain explicit comparison evidence. The assistant summarises the table but does not place orders or treat availability as guaranteed.

### Next Recommended Step

Confirm Castlery's exact in-stock Auburn module configuration and landed delivery date, then record that quote beside Carlyle and Nala.

## 2026-08-31T23:13:46Z - Room-specific Pinterest import

### Goal

Add the user's selected Pinterest references to the correct room feeds without relying on embedded Pinterest UI or retaining external image metadata.

### Changes

- Added seven Living Room, four Hallway, three Dining Area, and two Bedroom inspiration records in the supplied order.
- Resolved each Pinterest pin page to its image asset, converted every image to a generated local filename, auto-oriented it, and stripped embedded metadata.
- Retained the supplied Pinterest or direct Pinimg URL as provenance on each record.
- Made room pins open their original source in a new tab while remaining image-only in the interface.

### Decisions

New pins remain in `inbox` status. Visual tags and accessible titles describe what is shown, but `whatILike` and `notNecessarily` remain empty until the user expresses those judgments.

### Tradeoffs

Pinterest images are stored as local demo assets for reliability. They are not synchronised with the board and will not reflect later changes at the source.

### Risks

External Pinterest pins may be removed or change ownership. The retained source URL provides provenance, while the local copy keeps the prototype stable.

### Verification

All 16 images were visually reviewed in a contact sheet for room assignment and duplication. TypeScript, ESLint, diff validation, and the repository privacy scan passed; the privacy scan confirmed the converted assets contain no rejected metadata. No subagents were used.

### Demo Impact

Each relevant room now starts with the user's real visual references and the pin strip can return to the source without showing a Pinterest iframe.

### Customer-Facing Context

The import separates source provenance from the sanitized local display asset. No original filename, filesystem path, or embedded location metadata is exposed in the app.

### Next Recommended Step

Capture short `what I like` notes for the strongest pins so Ask Home can distinguish inspiration attributes from elements the user does not want copied.

## 2026-09-01 - Furniture inventory and expanded room decisions

### Goal

Give owned and purchased pieces a clear home in the main navigation, and preserve the detailed bed, art-TV, and TV-audio comparisons supplied in conversation.

### Changes

- Added Furniture to the desktop and four-item mobile navigation.
- Added a room-grouped Furniture page containing the six known owned pieces and all eight confirmed or backordered purchases.
- Corrected the Secretlab MAGNUS Pro name and expanded the placement notes for the sleeper sofa, floral rug, desk, chair, fan, and air purifier.
- Expanded the Bedroom bed decision to eleven candidates, including structured king dimensions, storage, aesthetic, review, and measured-zone fit rows.
- Added five art-TV candidates and four TV-audio candidates to dedicated Living Room decision tables with local product imagery.
- Added room-aware Ask Home summaries for the TV, audio, and two-bed finalist decisions.

### Decisions

- Furniture is the durable inventory view: items already owned and purchases that are committed belong together, while undecided candidates remain in their room comparison tables.
- Egerie and Evelyn are the two bed finalists. A usable low-drawer solution is the remaining question for Evelyn.
- TCL A400 Pro is the current art-TV favourite, subject to confirming the exact wall mount in the retailer's box. Samsung S701D is the lowest-friction audio choice.
- Generic MADE bed references remain without retailer links or images rather than attaching uncertain product data.

### Tradeoffs

- Furniture edits reuse the prototype's session-only editor; they are not persisted after refresh.
- Bathroom hooks and shelves appear under Furniture because they are confirmed purchases even though they are fixtures rather than freestanding furniture.
- Retail prices and availability are snapshots and must be checked before ordering.

### Risks

- Product pages and sale prices can change after the seed snapshot.
- The inventory will become incomplete again unless new purchases are promoted from room decisions into a persisted store.

### Verification

- Seed JSON validation, TypeScript, ESLint, diff validation, and the repository privacy scan passed.
- The production Webpack build passed and statically generated the new Furniture route.
- A 390 × 844 browser pass confirmed the four-item mobile nav, all 14 Furniture records, pencil controls, eleven-bed comparison, five-TV comparison, and four-option audio comparison.
- Browser console output contained development-mode information only; no warnings or errors were reported.
- No subagents were used.

### Demo Impact

The mobile nav now answers two separate questions cleanly: Rooms shows what is still being worked through, while Furniture shows what is already owned or committed.

### Customer-Facing Context

Every Furniture card can be edited through the same pencil control used elsewhere. Changes currently last for the browser session.

### Next Recommended Step

Persist item state, notes, prices, and votes so purchasing a candidate automatically moves it into Furniture and keeps the decision history attached.
