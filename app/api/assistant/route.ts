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
  if (text.includes("compare") && roomId === "living_room") {
    return "Auburn — #1 at £2,749 — still the favourite look and a 5/5 match for both the movie pit and facing-halves layouts. First investigate a custom build using the Auburn modules and stool that can dispatch quickly.\nCarlyle — £1,679.96 — the functional sleeper hit and strongest value fallback, also scoring 5/5 for both layouts; the warm beige fabric is the compromise.\nNala — £2,199 + £450 stool — the best Sofa Club option aesthetically and another full-score layout, with an estimated 2–3 week lead time.\nKate and Romy also have ideal architecture, but Kate's fabric is too warm and Romy is unavailable. King Aura is worth revisiting because you already liked the sit.\n\nThe clearest next action is to price and confirm an in-stock Auburn module configuration, then compare it directly with Carlyle on fabric warmth and total delivery date.";
  }
  if (
    roomId === "bedroom" &&
    ["mattress", "otty", "simba", "eve", "emma"].some((term) => text.includes(term))
  ) {
    return "OTTY Original Hybrid — 1st and ordered — strongest firmer-than-Casper option, with very good pressure relief and low too-soft risk.\nSimba Hybrid — 2nd — the closest Casper-like feel and strong nine-zone support, but slightly more softness risk.\nEve Original Hybrid — 3rd — balanced and cushiony, with medium-strong support.\nEmma Original 2026 — 4th — best pressure relief, but the most sink and highest too-soft risk.\n\nThe OTTY Bamboo Charcoal topper is also ordered to add pressure relief without choosing a softer mattress construction.";
  }
  if (text.includes("compare") && roomId === "bedroom") {
    return "Egerie — about £440 — the best overall decision. Its curved ivory bouclé look works with the floral rug, the king fits the measured window zone with 184 cm spare, and the end-lift ottoman solves storage cleanly.\nEvelyn — £419 — the heart choice. It is 10 cm shorter than Egerie, leaves 190 cm spare, and its blush scalloped headboard with pale wood has more personality; the unresolved question is whether low wheeled drawers make the lack of built-in storage acceptable.\nMira is the practical custom-upholstery fallback, while Onda is the strongest colourful option. Chadwell is exceptional value but a more generic silhouette. The MADE concepts, Get Laid and Loaf now sit below the two finalists.\n\nThe next useful decision is not another bed search: it is testing a convincing drawer solution for Evelyn, then choosing Evelyn or Egerie.";
  }
  if (text.includes("compare") && roomId === "bathroom") {
    return "Della Soft Blue Coral remains the favourite: it connects Mineral Green walls to the existing blue towels and keeps the room playful. Ranier and Allura are calmer copper-and-sage alternatives, but both move the room in a more earthy direction.";
  }
  if (text.includes("compare") && roomId === "hallway") {
    return "For the mirror, Yearn is the stronger soft-curve option at £209. Arden is £149.25 and gives you an arch instead; choose it if the oval feels too gentle beside the console.";
  }
  if (text.includes("compare") && roomId === "dining_area") {
    return "The paper flower pendant remains the clear favourite. It has more character and fits the playful brief better than the Dazuma reference, which the conversation already moved away from.";
  }
  if (text.includes("what can i order") || text.includes("order now")) {
    return "The Della Soft Blue bathroom runner, IKEA VIDGA track, and paper flower pendant are the clearest current choices. The room measurements are already recorded; the remaining checks are preference, installation, and comfort rather than missing dimensions.";
  }
  if (text.includes("measure")) {
    return "There are no missing measurement tasks in the current plan. I can still use the recorded dimensions when you ask whether an item fits.";
  }
  if (text.includes("sofa") || text.includes("green") || text.includes("blue")) {
    return "Auburn remains the benchmark, but the green direction works especially well with the existing floral rug. Keep the sofa muted rather than pastel, and prioritize a supportive back over the lowest silhouette.";
  }
  if (text.includes("hallway") || text.includes("cabinet") || text.includes("find")) {
    return "For the hallway console location, 35 cm is the useful-depth limit. A cabinet that is 32 cm deep fits with 3 cm to spare. I would still check door swing and the item’s condition before replacing the custom-console candidate.";
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
