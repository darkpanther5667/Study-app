import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-app)] p-6">
      <h1 className="text-4xl font-bold text-[var(--text-1)] mb-4">Grasp</h1>
      <p className="text-[var(--text-2)] text-center mb-8 max-w-md">
        Your AI study companion for acing exams
      </p>
      <div className="flex gap-4">
        <Button variant="primary" asChild>
          <Link href="/home">Get Started</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}