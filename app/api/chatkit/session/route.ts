import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST() {
  const workflowId = process.env.OPENAI_CHATKIT_WORKFLOW_ID;
  if (!process.env.OPENAI_API_KEY || !workflowId) {
    return NextResponse.json({ error: "ChatKit is not configured" }, { status: 503 });
  }

  try {
    const client = new OpenAI();
    const session = await client.beta.chatkit.sessions.create({
      user: "clover-29-user",
      workflow: {
        id: workflowId,
        state_variables: {
          home_alias: "Clover 29",
        },
      },
      chatkit_configuration: {
        automatic_thread_titling: { enabled: true },
        file_upload: { enabled: false },
        history: { enabled: true },
      },
    });
    return NextResponse.json({ client_secret: session.client_secret });
  } catch {
    return NextResponse.json({ error: "Could not create ChatKit session" }, { status: 503 });
  }
}
