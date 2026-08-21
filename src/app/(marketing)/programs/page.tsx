import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { getPublicPrograms } from "@/features/programs/getPublicPrograms";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import ProgramsSection from "@/components/landing/ProgramsSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Browse upcoming Data Science Bootcamp, Mini Bootcamp Data Analytics, and Mini Bootcamp SQL cohorts at Digica Academy.",
};

export default async function ProgramsPage() {
  const programsResult = await getPublicPrograms();

  return (
    <>
      <header className="glass-panel border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>
      <main className="flex-1">
        <ProgramsSection result={programsResult} headingAs="h1" />
      </main>
    </>
  );
}
