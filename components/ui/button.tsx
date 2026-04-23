import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold tracking-[-0.01em] ring-offset-background shadow-[0_1px_0_rgba(17,17,17,0.08)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(179,36,0,0.18)] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(179,36,0,0.2)] hover:opacity-95",
        outline:
          "border-border bg-card/88 text-foreground hover:-translate-y-[2px] hover:border-primary/35 hover:bg-background hover:shadow-[0_12px_24px_rgba(57,44,27,0.08)] hover:text-primary",
        secondary:
          "border-secondary/20 bg-secondary text-secondary-foreground shadow-[0_12px_28px_rgba(18,53,44,0.14)] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(18,53,44,0.18)] hover:opacity-95",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-[0.82rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
