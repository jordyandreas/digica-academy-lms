import type { ReactNode } from "react";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ResetPasswordHomeLink } from "@/components/auth/ResetPasswordHomeLink";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <ResetPasswordShell showAuth>
        <ResetPasswordUnavailable />
      </ResetPasswordShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ResetPasswordShell showAuth={!user}>
      {user ? (
        <>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
              Set a new password
            </h1>
            <p className="mt-1 text-zinc-600">
              Choose a new password for {user.email ?? "your account"}, then log
              in with it.
            </p>
          </div>
          <ResetPasswordForm />
        </>
      ) : (
        <ResetPasswordExpired />
      )}
    </ResetPasswordShell>
  );
}

function ResetPasswordShell({
  children,
  showAuth,
}: {
  children: ReactNode;
  showAuth?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <header className="glass-panel border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <ResetPasswordHomeLink />
          {showAuth ? <HeaderAuth variant="compact" /> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-10">{children}</main>
    </div>
  );
}

function ResetPasswordExpired() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
        Reset link expired
      </h1>
      <p className="mt-2 text-zinc-600">
        This reset link is invalid or expired. Request a new one from the log in
        form.
      </p>
    </div>
  );
}

function ResetPasswordUnavailable() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
        Password reset unavailable
      </h1>
      <p className="mt-2 text-zinc-600">
        Sign-in is not configured on this site. Try again later.
      </p>
    </div>
  );
}
