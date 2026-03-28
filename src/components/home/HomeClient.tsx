"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { GuestLandingMain } from "@/components/home/GuestLandingMain";
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { cn } from "@/lib/utils";

function MobileNavLinks({
  isLoggedIn,
  onNavigate,
}: {
  isLoggedIn: boolean;
  onNavigate: () => void;
}) {
  const linkClass =
    "flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-zinc-800 hover:bg-zinc-100 active:bg-zinc-200";

  if (isLoggedIn) {
    return (
      <nav className="flex flex-col gap-1 py-2" aria-label="Main">
        <Link href="/courses" className={linkClass} onClick={onNavigate}>
          Courses
        </Link>
        <Link href="#my-courses" className={linkClass} onClick={onNavigate}>
          My courses
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1 py-2" aria-label="Main">
      <Link href="#courses" className={linkClass} onClick={onNavigate}>
        Courses
      </Link>
      <Link href="#experience" className={linkClass} onClick={onNavigate}>
        Experience
      </Link>
      <Link href="#how-it-works" className={linkClass} onClick={onNavigate}>
        How it works
      </Link>
      <Link href="#faq" className={linkClass} onClick={onNavigate}>
        FAQ
      </Link>
    </nav>
  );
}

export function HomeClient() {
  const { isLoggedIn } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-0.5 sm:gap-2 lg:flex-none lg:gap-3">
            <Link
              href="/"
              className="min-w-0 truncate bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-sm font-semibold tracking-tight text-transparent sm:text-base"
            >
              Digica Academy
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 shrink-0 lg:hidden",
                "text-zinc-700 hover:bg-zinc-100"
              )}
              aria-expanded={mobileNavOpen}
              aria-controls="site-mobile-nav"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </Button>
          </div>

          {isLoggedIn ? (
            <nav
              className="hidden flex-1 items-center justify-center gap-1 text-sm text-zinc-600 lg:flex xl:gap-2"
              aria-label="Main"
            >
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="/courses">Courses</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="#my-courses">My courses</Link>
              </Button>
            </nav>
          ) : (
            <nav
              className="hidden flex-1 items-center justify-center gap-1 text-sm text-zinc-600 lg:flex xl:gap-2"
              aria-label="Main"
            >
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

          <div className="flex shrink-0 items-center sm:gap-3">
            <HeaderAuth className="shrink-0" />
          </div>
        </div>
      </header>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent
          variant="drawer-right"
          overlayClassName="account-drawer-overlay bg-black/45"
          className={cn(
            "account-drawer-panel flex h-dvh max-h-dvh w-[min(100vw-1rem,20rem)] flex-col overflow-hidden rounded-none border-l border-zinc-200 bg-white p-0 shadow-xl"
          )}
          id="site-mobile-nav"
          aria-describedby={undefined}
        >
          <DialogHeader className="border-b border-zinc-200 px-5 py-4 text-left">
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Menu
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
            <MobileNavLinks
              isLoggedIn={isLoggedIn}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
          <div className="border-t border-zinc-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1">
        {isLoggedIn ? <AuthenticatedHome /> : <GuestLandingMain />}
      </main>

      <SiteFooter isLoggedIn={isLoggedIn} />
    </div>
  );
}
