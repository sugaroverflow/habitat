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

## 2026-09-01 - Room direction and media-fit audit

### Goal

Use the available desktop width more deliberately, keep every room visibly related to the core floral reference palette, and correct media that reads as broken, cropped, or oversized inside compact cards.

### Changes

- Combined current photos, room description, palette, and plan into one responsive Room Overview: one column on mobile and an asymmetric photo/direction split on desktop.
- Standardised every room palette around the six colours sampled from the shared garden reference: soft sage, olive, garden ochre, faded coral, shell pink, and warm cream.
- Added a concrete four-point plan to every room, covering material, storage, lighting, and styling direction without inventing new decision objects.
- Moved the decision tracker below photos, palette, and inspiration so the room reads from context into choices.
- Reduced inspiration previews and comparison columns, preserved whole pin images instead of cropping landscape references, and made Furniture thumbnails compact squares.
- Moved Ask Home into the persistent header so it no longer covers cards and table rows.
- Reassigned the office cover photo to the Office room and normalised weak sofa and art-TV assets onto consistent 4:3 canvases. Replaced the Squishblocks detail crop with an official full-product image.
- Standardised comparison-table product previews at 112 × 84 px with contained imagery, including the tall bedside-table asset.
- Collapsed candidate display states into Purchased (yay!), Considering, and Rejected, with stronger teal, butter, and red treatments across cards and comparison tables.
- Fixed category matching so uncoupled candidates such as the Maude bedside table land in their named decision group instead of appearing as an empty category.

### Decisions

- Room palettes are subsets of one core palette. Room-specific variation now lives in the plan language and objects rather than unrelated swatch families.
- Missing owned-item photography is represented by an explicit Add photo state; no guessed product image is attached when the exact model or finish is unknown.
- Inspiration uses contain rather than cover because preserving the full reference is more valuable than edge-to-edge crops in a planning tool.
- Detailed imported lifecycle values remain supported in seed data, but the planning UI translates them into the three decision states the user actually needs; edits now use those same three choices.

### Tradeoffs

- Contained landscape pins can show quiet space inside portrait thumbnails, but no longer lose the part of the reference the user saved.
- Several owned pieces and bathroom purchases remain without photos until exact images are supplied or confirmed.
- Comparison tables still scroll horizontally, but smaller columns expose more than one candidate at a time on mobile.

### Risks

- Retailer imagery can change or disappear; the local copies remain the stable display source.
- The exact Shark fan, air purifier, and Monster Hunter chair variants are not known, so image matching remains intentionally incomplete.

### Verification

- A separate review agent inspected the live site at mobile and desktop breakpoints, checked 101 media files and 95 references, and found no missing or corrupt files.
- The agent identified layout, assignment, and weak-asset problems; accepted recommendations were implemented locally and rechecked in a real browser.
- Desktop and 390 × 844 screenshots confirmed the new dual-column room overview, compact Furniture media, smaller comparison columns, and non-overlapping Ask Home trigger.
- A 390 × 844 browser check confirmed the Maude bedside table preview fits its comparison card and that purchased, considering, and rejected states are visually distinct.
- Seed validation, TypeScript, ESLint, diff validation, and the repository privacy scan passed.
- The production Webpack build passed with all 23 routes generated.

### Demo Impact

Rooms now communicate a coherent design direction before presenting long decision tables, while more candidates remain visible during mobile comparison.

### Customer-Facing Context

The app distinguishes a genuinely missing image from a failed image request and avoids silently substituting uncertain product photography.

### Next Recommended Step

Add confirmed photos for the four unpictured owned pieces and the four bathroom purchases, then persist room direction and palette edits alongside item edits.

## 2026-09-03T15:51:01+01:00 - Multi-room decision-record expansion

### Goal

Turn the latest dining, bedroom-storage, hallway, lighting, runner, and TV-wall conversations into focused room comparisons without making the mobile boards feel like unfiltered shopping archives.

### Changes

- Added structured dining-rug, bedroom-chest, hallway-zone, hallway-runner, living-floor-lamp, TV-console, and dining-side-bookcase candidates with prices, dimensions, preference votes, links, and conversation takeaways.
- Updated the room direction and plan copy for the Living Room, Dining Area, Bedroom, and Hallway.
- Added category labels for the new decision groups.
- Added stripped, generated-name product assets for the active candidates, including corrected TV-console, bookcase, bedroom-storage, lamp, bench, and rug imagery.
- Preserved older TV-wall and hallway references in the seed decision history while excluding superseded or purely aspirational pieces from the live comparison tables.

### Decisions

- Adeline Natural Sage is the dining-rug favourite; Maru Sage is the bedroom-chest favourite; Santiago Blue Cream is the current hallway-runner favourite; Wave is the current floor-lamp favourite.
- The TV-wall direction is a roughly 180 cm two-level console below a floating art TV and soft gallery wall, plus an independent bookcase toward the dining side.
- The live TV-console comparison is limited to Ellie, Elina, Arto, and Cloe. The integrated Ellie, Shelved, Kave Litto, and other historic systems remain useful design evidence but are not current purchase candidates.
- The Hallway is treated as separate functional zones: coat/drop storage, one bench, a decorated BESTA-based closed-storage moment, a wavy mirror, and a washable runner.

### Tradeoffs

- Retail prices and stock are conversation snapshots and must be rechecked before purchase.
- Some reference-only products deliberately have no image because a trustworthy exact product asset was not available.
- Long comparisons still use horizontal swipe on mobile; narrowing the active candidate set keeps that interaction usable.

### Risks

- Retailer URLs and externally sourced product photography can change, although display copies are now local.
- Hallway furniture depth and the final floor-lamp position still need physical placement checks before ordering.
- Votes and edits remain session-only until persistence is added.

### Verification

- Seed JSON parsed with 114 unique items, 19 needs, and 16 decisions; candidate references and local image paths were complete.
- TypeScript, ESLint, diff validation, and the repository privacy scan passed before the production build.
- A 390 × 844 Playwright review covered the Dining Area, Bedroom, Hallway, and Living Room decision boards. It confirmed swipeable tables, consistent thumbnails, active-candidate filtering, and lazy-loaded product images.
- No subagents were used.

### Demo Impact

The room pages now preserve the reasoning that made the original ChatGPT conversations valuable: a user can see the shortlist, the rejected paths, the physical constraint, and the current recommendation without rereading a long chat.

### Customer-Facing Context

The seed remains a sanitized, reviewable source of truth. Images are stored under generated filenames with metadata stripped, and reference-only records are separated from active purchase choices at the data layer.

### Next Recommended Step

Persist item votes, notes, and lifecycle edits, then let Ask Home answer against those edited records rather than the initial seed alone.

## 2026-09-04T23:49:29Z - Rugs, dining, curtains, and kitchen decision consolidation

### Goal

Turn four dense conversation records into focused room decisions without losing the rejected paths or inventing product imagery.

### Changes

- Added the five-item living-room hero-rug comparison led by Nain Trading Keshan 320937 and 266065, plus Rugway Kashan 1128407, Kashan 1098068, and Nain 1095474.
- Preserved the remaining rug research as inactive reference records and collapsed the Thames Oriental Carpets batch into one archive summary.
- Added the dining-table decision tree, chair routes, exact table and chair dimensions, and the conditional Deauville-versus-Maru conclusion.
- Marked the unanswered Etsy pendant listing as inactive while keeping the soft floral or sculptural lighting direction open.
- Added the decided STENFRO white inner layers, focused living- and bedroom-outer-curtain comparisons, and an inactive archive of the superseded curtain research.
- Added the Asilah, Rabat, and Metro Babe kitchen-backsplash comparison, with an explicit sample-first action.
- Added exact, stripped local imagery for Deauville, Swyft, Maru, STENFRO, Cascade, Asilah, and Rabat.
- Updated Ask Home prompts and deterministic replies so the latest purchase and decision records replace the stale Auburn and pendant guidance.
- Updated retrieved agent room context to exclude inactive archive items while keeping them searchable by name.
- Fixed decided needs so the room decision tracker gives them the stronger made treatment.

### Decisions

- Never substitute similar rug imagery. Rugway candidates stay image-free until the exact item image can be verified.
- The living-room hero decision is the first four rugs compared beside the purchased Mythica Sky sofa, with Nain 1095474 as the next tier.
- Deauville is the dining aesthetic favourite only if four chairs tuck and the island route remains comfortable; Maru is the pedestal fallback and Swyft the compact functional fallback.
- Four Halston chairs are preferred if they tuck; two permanent chairs plus two folding Nomads remain the space-saving alternative.
- White STENFRO sheers are decided for both rooms. Cascade teal velvet is the living-room outer benchmark; soft blue or duck-egg blackout is the bedroom direction.
- Asilah is the kitchen favourite, but only a small physical sample should be ordered before full packs because the retailer's colour description is inconsistent.

### Tradeoffs

- Reference items remain in the seed for search and provenance but are hidden from live comparison boards and default agent room retrieval.
- Several active candidates deliberately show an honest no-image state.
- Retail prices are verified or conversation-time snapshots and still need a final basket check before purchase.

### Risks

- The Deauville decision still depends on an in-room four-chair and circulation check.
- The exact Ludlow chair, bedroom soft-blue blackout, Metro Babe tile, and replacement dining pendant links are still missing.
- Rug colour judgments still require a direct comparison with Mythica Sky under the room's actual light.

### Verification

- Parsed 182 unique items, 27 needs, and 22 decisions with no duplicate IDs or missing candidate references; Rugway 1098068 appears exactly once.
- TypeScript, ESLint, diff validation, and the repository privacy scan passed.
- The production Webpack build completed with all 23 routes generated.
- A 390 x 844 browser review covered the living-room hero-rug, dining-table, and kitchen-backsplash comparisons. The tables scroll horizontally, exact local assets fit the standardized cells, and deliberate no-image states do not render as broken requests.
- No subagents were used.

### Demo Impact

The room pages now show the actual shortlist, the decision rule, and the next physical check instead of treating every historic link as an equal option.

### Customer-Facing Context

The separation between live candidates and searchable history makes retrieval smaller and more relevant while preserving the sanitized reasoning trail. Exact-image verification is treated as a trust boundary rather than a cosmetic detail.

### Next Recommended Step

Run the Deauville footprint and four-chair tuck check, then update the table decision and re-evaluate the 185 cm dining rug around the winner.

## 2026-09-05T02:03:23+01:00 - Collected hallway, wall treatment, and measurement-day update

### Goal

Replace the hallway's single-unit plan with a collected furniture sequence, capture the new bedroom secondary-storage and living-room wall-treatment decisions, and make tomorrow's physical checks usable from the mobile home screen.

### Changes

- Added Florrie, Gabrielle, Soren, Khari, Sahab, Kirei, Rosie, and Wovena to a focused hallway closed-storage comparison.
- Added exact, metadata-stripped local product imagery for Florrie, Gabrielle, Soren, Kirei, Rosie, and Wovena.
- Moved the 180 cm BESTÅ to fallback status and removed the older 120 cm hack route, overlays, Hattie shoe cabinet, and Kaci sideboard from the live hallway comparison.
- Added a distinct bedroom behind-door / wardrobe-side comparison for Bennett, Agnes, and a conditional slim PAX extension, with exact local Bennett and Agnes imagery.
- Split the living-room wall record into the overall wall scheme, border motifs, middle-wall arch, and making tools so decoration choices do not become mixed with the TV-console decision.
- Added a grouped Measure tomorrow checklist for the Bathroom, Bedroom, and Dining Area, including critical and secondary priority levels.
- Added room summaries to the home screen and room-specific Ask Home prompts and answers for the new decisions.

### Decisions

- The preferred hallway is Beryl + Florrie + Gabrielle; Florrie + Soren is the airier second route and Wovena + Florrie is the functional shoe-storage route.
- The hall should retain deliberate 20–40 cm gaps rather than filling the full run. The 180 cm BESTÅ remains available only if the collected pieces do not provide enough storage.
- Bennett is the aesthetic leader for secondary bedroom storage, Agnes is the value leader, and PAX is relevant only if hanging capacity is the real problem.
- The living-room wall should keep the television and gallery art on a calm sea-blue upper field. A moulded transition with botanical wallpaper below is the current lead; a framed floral frieze is the alternative.
- A single arch belongs on the narrow middle wall. Raised botanical details should be sparse and placed after the television and art.

### Tradeoffs

- Unavailable pieces remain visible because they define the preferred composition, but their saved stock state is explicit.
- Retail prices and stock are snapshots and must be rechecked at the point of purchase.
- Conceptual wall treatments use honest empty-image states because the referenced mockups were not repository assets; no substitute images were invented.

### Risks

- The hallway sequence still needs final placement against door swing and real circulation even though the component widths fit within the recorded hall length.
- The wall treatment should be tested on a sample board before any plaster or filler technique is used at room scale.
- Votes, item edits, and measurement checklist edits remain client-session state rather than persisted data.

### Verification

- Parsed 210 unique items and 32 needs with no missing candidate references.
- TypeScript, ESLint, diff validation, repository privacy scanning, and the production Webpack build passed.
- A 390 × 844 browser review confirmed the grouped measurement checklist, contained local product imagery, and swipeable hallway comparison.
- Ask Home returned the intended narrowed answers for hallway layouts, secondary bedroom storage, living-room wall treatments, and measurement-day priorities.
- No subagents were used.

### Demo Impact

The app now turns three dense conversation threads into separate, decision-shaped interfaces and gives the next visit to the flat a concrete mobile checklist.

### Customer-Facing Context

The hallway reads as a collected sequence rather than a generic storage installation, while the wall and bedroom records retain the reasoning that makes each option meaningful.

### Next Recommended Step

Capture tomorrow's measurements, then resolve the dining-table footprint and use the wardrobe and office-corner dimensions to update the bedroom layout model.
