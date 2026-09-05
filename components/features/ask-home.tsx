"use client";

import {
  ArrowUp,
  HouseLine,
  Sparkle,
} from "@phosphor-icons/react";
import { FormEvent, useEffect, useState } from "react";

import { ChatKitPanel } from "@/components/features/chatkit-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

const roomNames: Record<string, string> = {
  living_room: "Living Room",
  dining_area: "Dining Area",
  bedroom: "Bedroom",
  office: "Office",
  hallway: "Hallway",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
};

export function AskHome({ pathname }: { pathname: string }) {
  const chatKitEnabled = process.env.NEXT_PUBLIC_CHATKIT_ENABLED === "true";
  const roomId = pathname.match(/^\/rooms\/([^/]+)/)?.[1] ?? null;
  const roomName = roomId ? roomNames[roomId] : null;
  const roomStarterPrompts: Record<string, string[]> = {
    living_room: ["Compare the 55 and 65 inch TCL", "Compare the wall treatments", "What should I measure tomorrow?"],
    dining_area: ["Compare the dining tables", "Which chairs work best?", "What still needs a product?"],
    bedroom: ["Compare the secondary storage", "Compare Egerie and Evelyn", "What should I measure tomorrow?"],
    hallway: ["Compare the storage pairings", "What is the preferred layout?", "Which option stores shoes?"],
    bathroom: ["What should I measure tomorrow?", "What is decided here?", "What is the current bathroom plan?"],
    kitchen: ["Compare the backsplash tiles", "What should I sample first?", "What is the current kitchen plan?"],
  };
  const starterPrompts = roomId && roomStarterPrompts[roomId]
    ? roomStarterPrompts[roomId]
    : roomName
      ? [`Compare the ${roomName.toLowerCase()} options`, "What have I already decided here?", "What would you choose next?"]
      : ["What can I order now?", "Compare the living room sofas", "What decisions are still open?"];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "I can compare saved items and use your room decisions and conversation notes. What are you working through?",
    },
  ]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function openWithContext(event: Event) {
      const prompt = (event as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) setValue(prompt);
      setOpen(true);
    }
    window.addEventListener("clover29:ask-home", openWithContext);
    return () => window.removeEventListener("clover29:ask-home", openWithContext);
  }, []);

  async function submitMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    setError(null);
    setValue("");
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: trimmed },
    ]);
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, roomId }),
      });
      if (!response.ok) throw new Error("Assistant request failed");
      const payload = (await response.json()) as { reply: string };
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", text: payload.reply },
      ]);
    } catch {
      setError("Ask Home could not respond. Your message was not saved.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(value);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-full px-3 sm:px-4"
        >
          <Sparkle aria-hidden="true" size={18} weight="fill" />
          Ask Home
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[82dvh] flex-col overflow-hidden p-0 md:h-[680px]">
        {chatKitEnabled ? (
          <>
            <DialogHeader className="border-b border-border/70">
              <div className="flex items-center gap-2 text-primary">
                <HouseLine aria-hidden="true" size={18} weight="fill" />
                <DialogTitle>{roomName ? `Ask about ${roomName}` : "Ask Home"}</DialogTitle>
              </div>
              <DialogDescription>{roomName ? `Using the items and decisions saved to ${roomName}.` : "Ask about a room, item, or decision."}</DialogDescription>
            </DialogHeader>
            <div className="min-h-0 flex-1">
              <ChatKitPanel />
            </div>
          </>
        ) : (
          <>
        <DialogHeader className="border-b border-border/70">
          <div className="flex items-center gap-2 text-primary">
            <HouseLine aria-hidden="true" size={18} weight="fill" />
            <DialogTitle>{roomName ? `Ask about ${roomName}` : "Ask Home"}</DialogTitle>
          </div>
          <DialogDescription>{roomName ? `Using the items and decisions saved to ${roomName}.` : "Ask about a room, item, or decision."}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-10 whitespace-pre-line rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground"
                  : "mr-5 whitespace-pre-line rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm leading-relaxed text-foreground"
              }
            >
              {message.text}
            </div>
          ))}
          {messages.length === 1 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void submitMessage(prompt)}
                  className="min-h-10 rounded-full border border-border bg-background px-3 text-left text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
          {loading ? (
            <div className="mr-16 space-y-2 rounded-2xl rounded-bl-md bg-muted p-4" aria-label="Ask Home is thinking">
              <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-border" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-border" />
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border/70 bg-background p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4">
          <div className="relative">
            <label htmlFor="ask-home-message" className="sr-only">
              Message Ask Home
            </label>
            <Textarea
              id="ask-home-message"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ask about a room, item, fit, or decision"
              className="min-h-[76px] pr-14"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!value.trim() || loading}
              aria-label="Send message"
              className="absolute bottom-2 right-2 size-10 min-h-10 rounded-lg"
            >
              <ArrowUp aria-hidden="true" size={18} weight="bold" />
            </Button>
          </div>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
