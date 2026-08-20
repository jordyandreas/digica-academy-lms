"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HashLink } from "@/components/layout/HashLink";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { DigicaLogo } from "@/components/brand/DigicaLogo";
import { GuestLandingMain } from "@/components/home/GuestLandingMain";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { PublicProgramsResult } from "@/features/programs/types";
import type { Course } from "@/lib/types";
import { COURSES_ENABLED } from "@/constants/features";
import { cn } from "@/lib/utils";

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const linkClass =
    "header-nav-link min-h-12 w-full justify-start rounded-xl px-3 text-base";

  return (
    <nav className="flex flex-col gap-1 py-2" aria-label="Main">
      <HashLink href="#programs" className={linkClass} onClick={onNavigate}>
        Programs
      </HashLink>
      {COURSES_ENABLED ? (
        <HashLink href="#courses" className={linkClass} onClick={onNavigate}>
          Courses
        </HashLink>
      ) : null}
      <HashLink href="#how-it-works" className={linkClass} onClick={onNavigate}>
        How it works
      </HashLink>
      <HashLink href="#curriculum" className={linkClass} onClick={onNavigate}>
        Curriculum
      </HashLink>
      <HashLink href="#instructor" className={linkClass} onClick={onNavigate}>
        Instructors
      </HashLink>
      <HashLink href="#testimonials" className={linkClass} onClick={onNavigate}>
        Alumni
      </HashLink>
    </nav>
  );
}

type HomeClientProps = {
  programsResult: PublicProgramsResult;
  courses: Course[];
};

export function HomeClient({ programsResult, courses }: HomeClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2 lg:flex-none lg:gap-3">
            <DigicaLogo
              className="min-w-0 max-lg:order-2 items-start"
              imageClassName="h-6 w-auto sm:h-7"
              priority
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 shrink-0 max-lg:order-1 lg:hidden",
                "text-zinc-700 hover:bg-zinc-100 [&_svg]:size-5"
              )}
              aria-expanded={mobileNavOpen}
              aria-controls="site-mobile-nav"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </Button>
          </div>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 text-sm lg:flex xl:gap-2"
            aria-label="Main"
          >
            <HashLink href="#programs" className="header-nav-link">
              Programs
            </HashLink>
            {COURSES_ENABLED ? (
              <HashLink href="#courses" className="header-nav-link">
                Courses
              </HashLink>
            ) : null}
            <HashLink href="#how-it-works" className="header-nav-link">
              How it works
            </HashLink>
            <HashLink href="#curriculum" className="header-nav-link">
              Curriculum
            </HashLink>
            <HashLink href="#instructor" className="header-nav-link">
              Instructors
            </HashLink>
            <HashLink href="#testimonials" className="header-nav-link">
              Alumni
            </HashLink>
          </nav>

          <div className="flex shrink-0 items-center sm:gap-3">
            <HeaderAuth className="shrink-0" />
          </div>
        </div>
      </header>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent
          variant="drawer-left"
          overlayClassName="account-drawer-overlay bg-black/45"
          className={cn(
            "nav-drawer-panel flex h-dvh max-h-dvh w-[min(100vw-1rem,20rem)] flex-col overflow-hidden rounded-none border-r border-zinc-200 bg-white p-0 shadow-xl"
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
            <MobileNavLinks onNavigate={() => setMobileNavOpen(false)} />
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
        <GuestLandingMain
          programsResult={programsResult}
          courses={courses}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
