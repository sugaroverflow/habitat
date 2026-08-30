import {
  ArrowRight,
  ChatCircleText,
  CheckSquareOffset,
  Cube,
  Images,
  ShoppingBagOpen,
  Ruler,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";

const moreLinks = [
  { label: "Pins", description: "Saved images grouped by room", href: "/inspiration", icon: Images },
  { label: "All items", description: "Candidates and purchases across rooms", href: "/shopping", icon: ShoppingBagOpen },
  { label: "Owned items", description: "Furniture and objects you already have", href: "/owned", icon: Cube },
  { label: "Decision list", description: "Open decisions and linked candidates", href: "/needs", icon: CheckSquareOffset },
  { label: "Measurements", description: "Room dimensions and checks still needed", href: "/measurements", icon: Ruler },
  { label: "Conversations", description: "Imported planning summaries", href: "/conversations", icon: ChatCircleText },
] as const;

export const metadata = { title: "More" };

export default function MorePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="More" description="Items, measurements, decisions, and past conversations." />
      <nav className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card" aria-label="All features">
        {moreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-h-[72px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/55">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon aria-hidden="true" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
              </span>
              <ArrowRight aria-hidden="true" size={15} className="text-muted-foreground" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
