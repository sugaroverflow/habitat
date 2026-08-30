"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ImageSquare, Plus, ShoppingBagOpen } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const captureItems = [
  {
    label: "In-person find",
    description: "Photo, price, and measurements",
    icon: ShoppingBagOpen,
    href: "/shopping?capture=find",
  },
  {
    label: "Pin",
    description: "Image URL and room notes",
    icon: ImageSquare,
    href: "/inspiration?capture=pin",
  },
] as const;

export function AddMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="sm" className="min-h-10 rounded-xl px-3.5">
          <Plus aria-hidden="true" size={16} weight="bold" />
          Add
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-[0_24px_55px_-30px_oklch(0.31_0.06_177/0.55)]"
        >
          <DropdownMenu.Label className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Add to Clover 29
          </DropdownMenu.Label>
          {captureItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenu.Item key={item.label} asChild>
                <Link
                  href={item.href}
                  className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3 outline-none transition-colors hover:bg-secondary/55 focus:bg-secondary/55"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/15 bg-secondary text-primary">
                    <Icon aria-hidden="true" size={17} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{item.description}</span>
                  </span>
                </Link>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
