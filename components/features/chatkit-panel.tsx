"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import Script from "next/script";

export function ChatKitPanel() {
  const chatkit = useChatKit({
    api: {
      getClientSecret: async () => {
        const response = await fetch("/api/chatkit/session", { method: "POST" });
        if (!response.ok) throw new Error("ChatKit session unavailable");
        const payload = (await response.json()) as { client_secret: string };
        return payload.client_secret;
      },
    },
    theme: {
      colorScheme: "light",
      radius: "round",
      density: "compact",
      typography: { baseSize: 15, fontFamily: "Avenir Next, Segoe UI, sans-serif" },
    },
    frameTitle: "Ask Home",
  });

  return (
    <>
      <Script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" strategy="afterInteractive" />
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </>
  );
}
