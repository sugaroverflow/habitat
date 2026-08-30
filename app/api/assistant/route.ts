import { NextResponse } from "next/server";
import { z } from "zod";

import { runHomeAgent } from "@/lib/openai/home-agent";
import { pendingMeasurements } from "@/lib/data";
import { sanitizeText } from "@/lib/privacy/sanitize";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

function localReply(message: string) {
  const text = message.toLowerCase();
  if (text.includes("what can i order") || text.includes("order now")) {
    return "Three items are close: the Della Soft Blue bathroom runner, the IKEA VIDGA track, and the large paper flower pendant. Confirm the runner size and ceiling installation first. I would hold the main sofa and hallway console until their blocking measurements and comfort checks are complete.";
  }
  if (text.includes("measure")) {
    return `Three checks remain: ${pendingMeasurements.map((measurement) => measurement.label).join(", ")}. The hallway console depth is the most useful next measurement because it unlocks fit checks for storage finds.`;
  }
  if (text.includes("sofa") || text.includes("green") || text.includes("blue")) {
    return "Auburn remains the benchmark, but the green direction works especially well with the existing floral rug. Keep the sofa muted rather than pastel, and prioritize a supportive back over the lowest silhouette.";
  }
  if (text.includes("hallway") || text.includes("cabinet") || text.includes("find")) {
    return "For the hallway console location, 35 cm is the useful-depth limit. A cabinet that is 32 cm deep fits with 3 cm to spare. I would still check door swing and the item’s condition before replacing the custom-console candidate.";
  }
  return "I can help with rooms, items, measurements, fit, decisions, and what to order next. Try asking about the sofa, hallway storage, or a room measurement.";
}

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const sanitizedInput = sanitizeText(body.message);
    const reply = process.env.OPENAI_API_KEY
      ? await runHomeAgent(sanitizedInput.text)
      : localReply(sanitizedInput.text);
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
