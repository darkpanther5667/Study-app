import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-slate-300/30 bg-slate-700/30 text-slate-100",
        muted: "border-slate-400/25 bg-slate-800/40 text-slate-200",
        success: "border-indigo-300/30 bg-indigo-300/10 text-indigo-100",
        // Grasp variants
        purple: "bg-[var(--brand-light)] text-[var(--brand)]",
        green: "bg-green-100 text-green-700",
        orange: "bg-amber-100 text-amber-700",
        red: "bg-red-100 text-red-700",
        gray: "bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
