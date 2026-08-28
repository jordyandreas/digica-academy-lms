import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Button } from "@/components/ui/button";
import { getStudentProfile } from "@/features/profile/getStudentProfile";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { toE164PhoneForInput } from "@/utils/phone";

export default async function AccountProfilePage() {
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

  const profile = await getStudentProfile(supabase, user.id);
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

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
            Edit profile
          </h1>
          <p className="mt-1 text-zinc-600">
            These details prefill program registration when you are logged in.
          </p>
        </div>
        <EditProfileForm
          email={user.email ?? ""}
          defaultValues={{
            full_name: profile?.full_name?.trim() || metadataName,
            phone: toE164PhoneForInput(profile?.phone ?? "") ?? "",
            occupation: profile?.occupation ?? "",
            organization: profile?.organization ?? "",
          }}
        />
      </main>
    </div>
  );
}
