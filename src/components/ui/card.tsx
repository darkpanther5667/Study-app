import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = 'glass' | 'grasp';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

function Card({ className, variant = 'glass', ...props }: CardProps) {
  const baseClasses = variant === 'grasp'
    ? "bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    : "glass rounded-2xl border border-white/12 shadow-[0_10px_28px_rgba(0,0,0,0.34)]";

  return (
    <div className={cn(baseClasses, className)} {...props} />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-semibold tracking-tight", className)} {...props} />;
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-300/80", className)} {...props} />;
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
