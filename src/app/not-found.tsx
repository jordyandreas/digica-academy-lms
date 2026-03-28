import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found | Digica Academy",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <div className="glass-panel max-w-lg rounded-2xl px-8 py-10 text-center shadow-lg">
        <p className="text-6xl font-bold tracking-tight text-primary sm:text-7xl">
          404
        </p>
        <div className="mx-auto mt-4 h-px w-16 bg-linear-to-r from-primary via-secondary to-tertiary" />
        <h1 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/75 sm:text-base">
          We could not find that page. It may have been removed, or the link
          might be incorrect.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/courses">
              <ArrowLeft className="size-4" aria-hidden />
              Browse courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
