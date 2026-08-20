import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function ChangePasswordPage() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
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
      <main className="mx-auto w-full max-w-lg px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Change password
          </h1>
          <p className="mt-1 text-zinc-600">
            Enter your current password, then choose a new one
            {user.email ? ` for ${user.email}` : ""}.
          </p>
        </div>
        <ChangePasswordForm />
      </main>
    </div>
  );
}
