import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-700/40 via-slate-600/30 to-slate-700/40",
        className,
      )}
    />
  );
}
