import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:translate-y-px active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "border border-primary/80 bg-primary px-4 pb-[calc(0.25rem+2px)] pt-1 text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.34),inset_0_-3px_0_oklch(0.31_0.06_177/0.55),0_7px_16px_-11px_oklch(0.31_0.06_177/0.8)] hover:bg-primary/93",
        secondary: "border border-primary/18 bg-secondary px-4 text-secondary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.65)] hover:bg-secondary/76",
        outline:
          "border border-border bg-card px-4 text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.8)] hover:border-primary/45 hover:bg-secondary/45",
        ghost: "px-3 text-foreground hover:bg-muted",
        blush: "bg-accent px-4 text-accent-foreground hover:bg-accent/82",
        destructive:
          "bg-destructive px-4 text-destructive-foreground hover:bg-destructive/9",
      },
      size: {
        default: "h-11",
        sm: "h-9 min-h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-5 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
