"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ResetPasswordHomeLink() {
  const router = useRouter();

  const goHomeLoggedOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.replace("/");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-2 text-primary"
      onClick={() => void goHomeLoggedOut()}
    >
      <ChevronLeft className="h-4 w-4" />
      Home
    </Button>
  );
}
