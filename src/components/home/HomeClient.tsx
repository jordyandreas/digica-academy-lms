"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { GuestLandingMain } from "@/components/home/GuestLandingMain";
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function HomeClient() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-sm font-semibold tracking-tight text-transparent md:text-base"
          >
            Digica Academy
          </Link>
          {isLoggedIn ? (
            <nav className="hidden flex-1 items-center justify-center gap-2 text-sm text-zinc-600 md:flex">
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="/courses">Courses</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#my-courses">My courses</Link>
              </Button>
            </nav>
          ) : (
            <nav className="hidden flex-1 items-center justify-center gap-2 text-sm text-zinc-600 md:flex">
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#courses">Courses</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#experience">Experience</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#how-it-works">How it works</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#faq">FAQ</Link>
              </Button>
            </nav>
          )}
          <HeaderAuth className="shrink-0" />
        </div>
      </header>

      <main className="flex-1">
        {isLoggedIn ? <AuthenticatedHome /> : <GuestLandingMain />}
      </main>

      <SiteFooter isLoggedIn={isLoggedIn} />
    </div>
  );
}
