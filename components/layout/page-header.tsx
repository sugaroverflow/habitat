import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex items-start justify-between gap-4 border-b border-border/70 pb-5", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.045em] text-balance sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
