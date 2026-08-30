"use client";

import {
  ChatCircleText,
  CirclesThreePlus,
  House,
  Images,
  ShoppingBagOpen,
  SquaresFour,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AskHome } from "@/components/features/ask-home";
import { AddMenu } from "@/components/layout/add-menu";
import { cn } from "@/lib/utils";

const desktopNavigation = [
  { label: "Home", href: "/", icon: House },
  { label: "Rooms", href: "/rooms", icon: SquaresFour },
  { label: "Pins", href: "/inspiration", icon: Images },
  { label: "All items", href: "/shopping", icon: ShoppingBagOpen },
  { label: "Conversations", href: "/conversations", icon: ChatCircleText },
] as const;

const mobileNavigation = [
  { label: "Home", href: "/", icon: House },
  { label: "Rooms", href: "/rooms", icon: SquaresFour },
  { label: "Pins", href: "/inspiration", icon: Images },
  { label: "More", href: "/more", icon: CirclesThreePlus },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMobileActive(pathname: string, href: string) {
  if (href !== "/more") return isActive(pathname, href);
  return ["/more", "/shopping", "/owned", "/needs", "/measurements", "/conversations"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/96 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-[1280px] items-center gap-5 border-x border-border/55 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 shrink-0 items-center text-sm font-semibold tracking-[-0.02em]">
            Clover 29
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
            {desktopNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/55 hover:text-foreground",
                    active && "bg-secondary text-primary",
                  )}
                >
                  <Icon aria-hidden="true" size={16} weight={active ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <AddMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-[1280px] border-x border-border/55 px-4 pb-36 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-24">
        {children}
      </main>

      <AskHome />

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/96 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Primary mobile navigation"
      >
        <div className="mx-auto grid h-[68px] max-w-lg grid-cols-4 px-1">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const active = isMobileActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-secondary/60",
                  active && "text-primary",
                )}
              >
                <Icon aria-hidden="true" size={21} weight={active ? "fill" : "regular"} />
                <span className="truncate">{item.label}</span>
                {active ? <span className="absolute bottom-1.5 h-0.5 w-4 rounded-full bg-primary" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
