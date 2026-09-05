import { NextResponse } from "next/server";
import { z } from "zod";

import { runHomeAgent } from "@/lib/openai/home-agent";
import { sanitizeText } from "@/lib/privacy/sanitize";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  roomId: z.string().trim().max(80).nullable().optional(),
});

function localReply(message: string, roomId?: string | null) {
  const text = message.toLowerCase();
  if (
    roomId === "living_room" &&
    ["wall treatment", "wall treatments", "frieze", "wallpaper", "plaster", "scallop", "ogee", "jaali", "middle wall", "border"].some((term) => text.includes(term))
  ) {
    return "Current lead — dusty sea-blue above, one moulded decorative divider, and a delicate botanical wallpaper below. It keeps the art TV and gallery on a calm field while bringing pattern and dimension lower down.\nBest alternative — two parallel moulding rails with a restrained floral frieze and colour below. Lotus and palmette is the strongest structured motif; the Mughal vine is softer.\nAdd raised plaster flowers only in selected gaps after the television and art are placed.\nUse one MDF arch on the narrow middle wall, not a repeated arch treatment across the television wall.\n\nThe next decision is wallpaper-lower-field versus raised-frieze—not another all-wall concept.";
  }
  if (
    roomId === "living_room" &&
    ["tv", "television", "frame", "hisense", "tcl", "gallery"].some((term) => text.includes(term))
  ) {
    return "TCL A400 Pro 55 — current favourite at £899. It gives you the best balance of art-TV styling, MiniLED picture quality and 144 Hz gaming; confirm that the retailer's batch includes the ultra-slim mount before ordering.\nSamsung The Frame 55 — £1,299 — the safest, most polished art-mode choice, but costs about £400 more.\nHisense Canvas S7S 55 — £1,099 — gaming-friendly and well framed, but only becomes compelling if discounted below the TCL.\nLG Gallery LX7 — £999 — rejected because its 60 Hz panel is the wrong compromise for gaming.\nSamsung Frame Pro — £1,399 — interesting, but wait for independent 2026 latency testing before paying the premium.";
  }
  if (
    roomId === "living_room" &&
    ["audio", "soundbar", "speaker", "s701", "sonos", "polk", "cambridge"].some((term) => text.includes(term))
  ) {
    return "Samsung S701D — £349 — the cleanest choice for this wall: white, ultra-slim, simple HDMI eARC wiring, with its wall bracket and wireless sub included.\nCambridge Minx Min 22 pair — about £178 — the prettiest stereo route and stronger for positioning and music, but only after choosing and hiding a small HDMI amplifier.\nPolk OWM3 pair — £173 — the value-led wall-speaker option, though visually less delicate.\nSonos Beam Gen 2 — £429 — polished and expandable, but noticeably chunkier beneath an art TV.\n\nFor the least visual and wiring friction, pair the TCL with the S701D. Choose Cambridge only if the separate-speaker look is worth the amplifier and cable plan.";
  }
  if (
    roomId === "living_room" &&
    ["rug", "keshan", "kashan", "nain", "320937", "266065", "1128407", "1098068", "1095474"].some((term) => text.includes(term))
  ) {
    return "Keshan 320937 — £2,814 — favourite #1. It has the strongest dark botanical depth, although it does not bring in the hoped-for teal, green or blush.\nKeshan 266065 — about £3,047 — favourite #2, with excellent contrast and large-room presence.\nRugway Kashan 1128407 — £2,581 — the best value-to-scale option at 310 × 406 cm.\nRugway Kashan 1098068 — £3,033 — almost ideal proportions and only £33 over the cap.\nRugway Nain 1095474 — £2,758 — the next-tier colour option, but smaller at 245 × 345 cm.\n\nCompare the first four directly beside the purchased Mythica Sky sofa. The other rug records are history or palette references, not live choices; Rugway thumbnails stay blank until the exact images can be verified.";
  }
  if (
    roomId === "living_room" &&
    ["curtain", "sheer", "stenfr", "velvet", "cascade", "embroider"].some((term) => text.includes(term))
  ) {
    return "Inner layer — decided: two white IKEA STENFRÖ sheer panels, £15 each.\nOuter favourite — Cascade matte teal velvet, from about £160. It is calm, rich and practical beside Mythica Sky and a patterned hero rug.\nBest embroidered challenger — dusty blue-grey linen with ivory botanical embroidery.\nFavourite motif — blue botanical linen, but its oatmeal ground is too warm.\nSage/mint embroidery remains possible, though it risks making green too dominant with the mint coffee table.\n\nThe decision is teal velvet versus a restrained embroidered linen that can genuinely beat it—not a new broad curtain search.";
  }
  if (text.includes("compare") && roomId === "living_room") {
    return "The Sky chaise-and-ottoman sofa in Mythica Sky is already purchased, so the sofa comparison is closed. The live living-room decisions are the five-rug hero shortlist, teal velvet versus restrained embroidered curtains, the art TV and audio route, the two-level TV console, the blue botanical wall treatment, and the floor lamp. Ask me to compare any one of those and I’ll use its prices, dimensions, status and conversation notes.";
  }
  if (
    roomId === "bedroom" &&
    ["mattress", "otty", "simba", "eve", "emma"].some((term) => text.includes(term))
  ) {
    return "OTTY Original Hybrid — 1st and ordered — strongest firmer-than-Casper option, with very good pressure relief and low too-soft risk.\nSimba Hybrid — 2nd — the closest Casper-like feel and strong nine-zone support, but slightly more softness risk.\nEve Original Hybrid — 3rd — balanced and cushiony, with medium-strong support.\nEmma Original 2026 — 4th — best pressure relief, but the most sink and highest too-soft risk.\n\nThe OTTY Bamboo Charcoal topper is also ordered to add pressure relief without choosing a softer mattress construction.";
  }
  if (
    roomId === "bedroom" &&
    ["curtain", "sheer", "stenfr", "duck", "star"].some((term) => text.includes(term))
  ) {
    return "Inner layer — decided: two white IKEA STENFRÖ sheer panels, matching the living room.\nOuter direction — soft blue or duck-egg blackout, which keeps the pink bedroom dreamy without turning it cottagey.\nPlayful alternative — a plain star-cutout blackout with no attached tulle. The STENFRÖ already supplies the softness.\nThe double-layer star curtain fell behind because the attached tulle reads too princessy.\n\nThe next step is finding the exact soft-blue blackout product, not revisiting the inner layer.";
  }
  if (
    roomId === "bedroom" &&
    ["secondary storage", "bennett", "agnes", "pax", "behind-door", "wardrobe-side"].some((term) => text.includes(term))
  ) {
    return "Bennett — aesthetic leader at £599. It is 120 × 38 × 75cm, arrives assembled, and its oak construction and soft recessed curves suit Evelyn and Maude best; it was out of stock at the saved check.\nAgnes — value leader at £249.99. Its 120 × 40 × 76cm footprint is almost identical, but the oak-effect construction reads heavier and less refined.\nSlim PAX extension — conditional. It only wins if the real problem is hanging capacity rather than folded storage.\n\nFor this secondary zone: Bennett aesthetically, Agnes on value, PAX by storage type.";
  }
  if (text.includes("compare") && roomId === "bedroom") {
    return "Egerie — about £440 — the best overall decision. Its curved ivory bouclé look works with the floral rug, the king fits the measured window zone with 184 cm spare, and the end-lift ottoman solves storage cleanly.\nEvelyn — £419 — the heart choice. It is 10 cm shorter than Egerie, leaves 190 cm spare, and its blush scalloped headboard with pale wood has more personality; the unresolved question is whether low wheeled drawers make the lack of built-in storage acceptable.\nMira is the practical custom-upholstery fallback, while Onda is the strongest colourful option. Chadwell is exceptional value but a more generic silhouette. The MADE concepts, Get Laid and Loaf now sit below the two finalists.\n\nThe next useful decision is not another bed search: it is testing a convincing drawer solution for Evelyn, then choosing Evelyn or Egerie.";
  }
  if (text.includes("compare") && roomId === "bathroom") {
    return "Della Soft Blue Coral remains the favourite: it connects Mineral Green walls to the existing blue towels and keeps the room playful. Ranier and Allura are calmer copper-and-sage alternatives, but both move the room in a more earthy direction.";
  }
  if (
    roomId === "hallway" &&
    ["storage", "pairing", "layout", "florrie", "gabrielle", "soren", "wovena", "besta", "sideboard", "cabinet"].some((term) => text.includes(term))
  ) {
    return "Favourite layout — Beryl 135 + Florrie 80 + Gabrielle 100 = 315cm. It leaves about 135cm of the 450cm hall for deliberate gaps; Florrie can hold shoes and Gabrielle can take tennis, picnic and household overflow.\nAirier layout — Beryl + Florrie + Soren = 290cm. Soren is only 35cm deep and its fluting is a quiet companion to the carving.\nMost functional — Beryl + Wovena + Florrie = 295cm. Wovena gives dedicated shallow shoe storage, but it is still a placeholder for a nicer slim cabinet.\n\nDo not fill the whole run. Keep 20–40cm gaps for art, hooks, a mirror, a plant or lamp. The 180cm BESTÅ is now the storage-first fallback, not the preferred design.";
  }
  if (text.includes("compare") && roomId === "hallway") {
    return "The main hallway comparison is now the three collected storage layouts. For the mirror alone, Yearn is the stronger soft-curve option and Arden is the simpler arch. Ask about storage, mirror, bench or runner and I’ll keep those decisions separate.";
  }
  if (
    roomId === "dining_area" &&
    ["table", "deauville", "swyft", "maru"].some((term) => text.includes(term))
  ) {
    return "Deauville — aesthetic favourite. It is a 130 × 100 cm oval extending to 160 cm, with the leaf confirmed underneath. Choose it if four chairs tuck cleanly and the route past the island stays comfortable.\nMaru Oak — the functional fallback. Its 110 cm round pedestal gives the cleanest chair tuck and extends to 150 cm; leaf storage is still unconfirmed.\nSwyft Table 01 — compact functional alternative at about 120 × 90 cm closed, with hidden leaf storage, but you prefer Deauville's oval shape.\nMaru Sage — the colour-led Maru variant, with more commitment.\n\nThe one useful check is placing a 130 × 100 cm footprint in the nook with four chairs and walking the island route.";
  }
  if (
    roomId === "dining_area" &&
    ["chair", "halston", "nomad", "ludlow", "seating"].some((term) => text.includes(term))
  ) {
    return "Halston speckled stone and oak — favourite permanent chair at £179 each. Four matching chairs are the preferred route if they tuck around the chosen table.\nNomad speckled stone and walnut — £99 sale price in the saved check; the folding fallback if the nook works better with two permanent and two stored guest chairs.\nLudlow ecru and oak — the more decorative scalloped alternative, but it still needs an exact product link and dimensions.\n\nStart with Deauville plus four Halstons; move to the pedestal Maru or folding-chair plan only if the physical tuck test fails.";
  }
  if (text.includes("compare") && roomId === "dining_area") {
    return "The dining nook has three live choices: Deauville versus Maru versus Swyft for the table, Halston versus the folding-chair fallback for seating, and Adeline versus Provence for the rug. The floral pendant direction remains, but the original Etsy listing is archived because the seller never replied and a replacement product is needed.";
  }
  if (
    roomId === "kitchen" &&
    ["tile", "backsplash", "asilah", "rabat", "metro", "sample"].some((term) => text.includes(term))
  ) {
    return "Morocco Asilah — favourite. The glossy elongated zellige pattern sits between mossy green and blue, which should be beautiful against the dark wood and black worktop. Order the small sample first because the product page's colour naming is inconsistent.\nMorocco Rabat — second. The dusty blush is romantic, but makes the kitchen more pastel.\nMetro Babe — third. A clean powder-blue subway tile, now a little safe and coastal beside the Moroccan options.\n\nThe next action is the Asilah sample, not a full-pack order.";
  }
  if (text.includes("what can i order") || text.includes("order now")) {
    return "The four white IKEA STENFRÖ sheer panels are decided, but confirm the final track quantities before ordering. The Della Soft Blue bathroom runner remains a near-decision. For the kitchen, order only the small Asilah colour sample first. Do not order a dining table until the four-chair tuck and island-route check, and do not order a living-room hero rug until the active four are compared beside Mythica Sky.";
  }
  if (text.includes("measure")) {
    return "Tomorrow's critical checks are: bathroom door, cabinet panel, surrounding wall edges and diagonal ceiling; relocated wardrobe footprint and carcasses; the full bedroom office-corner rectangle; the complete bedroom window wall; and a 130 × 100cm dining-table footprint with four chairs and the island route.\n\nSecondary checks are the bedroom bed wall and obstructions, Magnus Pro size, divider depth and height, chair and bed clearances, ceiling height, plus any small bathroom returns that should become Mineral Green. The full grouped checklist is on the Measurements page, linked from Home.";
  }
  if (text.includes("sofa") || text.includes("green") || text.includes("blue")) {
    return "The OPA Living Sky modular three-seat chaise with ottoman in Mythica Sky is purchased. The sofa decision is closed; use Mythica Sky as the fixed reference when comparing the hero rug, curtains, TV wall and lighting.";
  }
  if (text.includes("hallway") || text.includes("cabinet") || text.includes("find")) {
    return "The hallway now favours smaller related pieces rather than one long matching unit: one carved anchor, one quieter companion, and deliberate gaps. Florrie + Gabrielle is the favourite pairing; Florrie + Soren is airier; Wovena + Florrie is the functional shoe-storage route. Keep the 180cm BESTÅ only as the high-capacity fallback.";
  }
  if (roomId) {
    return `I’m using ${roomId.replaceAll("_", " ")} as the current room. Ask me to compare its saved items, summarize what you said about them, or identify the next decision.`;
  }
  return "I can compare saved items, summarize the thinking from your conversations, and help choose what to decide or order next.";
}

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const sanitizedInput = sanitizeText(body.message);
    const reply = process.env.OPENAI_API_KEY
      ? await runHomeAgent(sanitizedInput.text, body.roomId)
      : localReply(sanitizedInput.text, body.roomId);
    const sanitizedOutput = sanitizeText(reply);
    return NextResponse.json({
      reply: sanitizedOutput.text,
      privacy: {
        inputRedacted: sanitizedInput.redacted,
        outputRedacted: sanitizedOutput.redacted,
      },
      mode: process.env.OPENAI_API_KEY ? "agent" : "local",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid assistant request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Ask Home is unavailable" }, { status: 503 });
  }
}
