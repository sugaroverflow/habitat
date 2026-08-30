import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

import { seedData } from "@/lib/seed-data";
import { PRIVACY_INSTRUCTIONS } from "@/lib/privacy/policy";
import { removeSensitiveFields, sanitizeText } from "@/lib/privacy/sanitize";

const roomTool = tool({
  name: "get_room",
  description: "Get a room and the needs and decisions currently attached to it.",
  parameters: z.object({ room_id: z.string() }),
  execute: ({ room_id }) =>
    removeSensitiveFields({
      room: seedData.rooms.find((room) => room.id === room_id) ?? null,
      needs: seedData.needs.filter((need) => need.room_id === room_id),
      decisions: seedData.decisions.filter((decision) => decision.room_id === room_id),
    }),
});

const measurementTool = tool({
  name: "get_measurements",
  description: "Get sanitized measurements, optionally narrowed to one room.",
  parameters: z.object({ room_id: z.string().nullable() }),
  execute: ({ room_id }) =>
    removeSensitiveFields(
      room_id
        ? seedData.measurements.filter((measurement) => measurement.room_id === room_id)
        : seedData.measurements,
    ),
});

const itemSearchTool = tool({
  name: "search_items",
  description: "Search owned items and shopping candidates by name, category, room, or comments.",
  parameters: z.object({ query: z.string(), room_id: z.string().nullable() }),
  execute: ({ query, room_id }) => {
    const term = query.toLowerCase();
    return removeSensitiveFields(
      seedData.items
        .filter((item) => !room_id || item.room_id === room_id)
        .filter((item) =>
          `${item.name} ${item.category} ${item.user_notes} ${item.assistant_assessment ?? ""}`
            .toLowerCase()
            .includes(term),
        )
        .slice(0, 8),
    );
  },
});

const needTool = tool({
  name: "get_needs",
  description: "Get active home needs and their candidate item IDs.",
  parameters: z.object({ room_id: z.string().nullable() }),
  execute: ({ room_id }) =>
    removeSensitiveFields(
      room_id ? seedData.needs.filter((need) => need.room_id === room_id) : seedData.needs,
    ),
});

const fitTool = tool({
  name: "check_fit",
  description: "Compare an item's dimensions with a maximum width, depth, and height in centimetres.",
  parameters: z.object({
    item_width_cm: z.number(),
    item_depth_cm: z.number(),
    item_height_cm: z.number(),
    max_width_cm: z.number().nullable(),
    max_depth_cm: z.number().nullable(),
    max_height_cm: z.number().nullable(),
  }),
  execute: (input) => {
    const checks = [
      ["width", input.item_width_cm, input.max_width_cm],
      ["depth", input.item_depth_cm, input.max_depth_cm],
      ["height", input.item_height_cm, input.max_height_cm],
    ] as const;
    const results = checks.map(([axis, value, maximum]) => ({
      axis,
      fits: maximum === null ? null : value <= maximum,
      spare_cm: maximum === null ? null : Number((maximum - value).toFixed(1)),
    }));
    return { fits: results.every((result) => result.fits !== false), results };
  },
});

export const homeAgent = new Agent({
  name: "Ask Home",
  model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
  instructions: `${PRIVACY_INSTRUCTIONS}

Be concise, warm, and specific. Retrieve only what is relevant. Distinguish
measured facts from assumptions. Never claim that an item fits without using
measurements. Do not make purchases or persist changes. Offer a clear user
action for any proposed mutation.`,
  tools: [roomTool, measurementTool, itemSearchTool, needTool, fitTool],
});

export async function runHomeAgent(input: string) {
  const sanitized = sanitizeText(input);
  const result = await run(homeAgent, sanitized.text, { maxTurns: 6 });
  const output = typeof result.finalOutput === "string" ? result.finalOutput : JSON.stringify(result.finalOutput);
  return sanitizeText(output).text;
}
