# Habitat — Clover 29

A mobile-first, chat-led home planning prototype. It turns room context, measurements, products, inspiration, and decisions into one workspace.

Live: [habitat-amber.vercel.app](https://habitat-amber.vercel.app)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The seeded workspace and local Ask Home responder work without credentials. Supabase, the OpenAI-powered agent, and ChatKit are enabled through `.env.local`; secrets must never be committed.

## Quality gates

```bash
npm run privacy:check
npm run typecheck
npm run lint
npm run build
```

`privacy:check` rejects likely identifying location text, forbidden database fields, unsafe filenames, committed secret-like values, and EXIF/XMP/IPTC image metadata.

## Product shape

- Mobile navigation: Home, Rooms, Pins, More
- Persistent Ask Home action
- Room-first planning: compact inspiration, palette, room photos, open decisions, items, measurements, and saved decisions
- Cross-room item and conversation libraries remain available as secondary views
- Native inspiration pins using direct image URLs, optional source links, room assignment, and reviewed notes
- Editable item states, decision tiers, notes, pins, needs, measurements, and decisions
- Verified product photos stored under generated filenames
- Supabase schema with row-level security enabled and no home address fields
- Responses/Agents SDK endpoint with a credential-free local fallback
- Optional ChatKit UI through `NEXT_PUBLIC_CHATKIT_ENABLED=true`

## Privacy boundary

The repository only uses the alias **Clover 29**. Do not add raw exports, original uploads, delivery screenshots, identifying filenames, addresses, postcodes, home coordinates, or production secrets. Imported content must be sanitized before model processing or persistence; redaction records retain the category, never the removed value.

Pinterest boards are not embedded. Add reviewed pins with a direct image URL and keep the Pinterest pin or original page as the optional source link. New pins remain in the browser session until Supabase persistence is connected.
