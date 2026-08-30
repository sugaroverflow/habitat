"use client";

import { ArrowRight, ChatCircleText, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ConversationPreview } from "@/lib/domain";

export function ConversationList({ conversations }: { conversations: ConversationPreview[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((conversation) =>
      `${conversation.title} ${conversation.summary} ${conversation.topics.join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  }, [conversations, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass aria-hidden="true" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="conversation-search" className="sr-only">Search conversations</label>
        <Input
          id="conversation-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search boucle, hallway, rugs..."
          className="pl-10"
        />
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {filtered.map((conversation) => (
          <article key={conversation.id} className="group flex gap-3 px-4 py-4 sm:px-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <ChatCircleText aria-hidden="true" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{conversation.title}</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{conversation.date}</p>
                </div>
                <ArrowRight aria-hidden="true" size={15} className="mt-1 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{conversation.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {conversation.topics.map((topic) => <Badge key={topic} variant="outline">{topic}</Badge>)}
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold">No matching conversations</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a room, material, product, or decision.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
