import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:pointer-events-none disabled:opacity-50 cursor-pointer will-change-transform",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-slate-200 to-slate-100 px-5 py-3 text-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.42)]",
        secondary:
          "border border-slate-400/25 bg-slate-800/40 px-5 py-3 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:bg-slate-700/40",
        ghost: "text-slate-200 hover:bg-white/10",
        // Grasp variants
        primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] shadow-md hover:-translate-y-0.5",
        danger: "bg-[var(--accent-red)] text-white hover:bg-red-700 shadow-md hover:-translate-y-0.5",
        success: "bg-[var(--accent-green)] text-white hover:bg-green-700 shadow-md hover:-translate-y-0.5",
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
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
