"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ensureStudentProfile } from "@/features/auth/ensureStudentProfile";
import { mapAuthError } from "@/features/auth/mapAuthError";

export type AuthActionResult = {
  error: string | null;
  needsEmailConfirm?: boolean;
  alreadyRegistered?: boolean;
};

function authNotConfiguredResult(): AuthActionResult {
  return {
    error:
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  };
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        void ensureStudentProfile(supabase, session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthActionResult> => {
      if (!isSupabaseConfigured()) return authNotConfiguredResult();

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: mapAuthError(error) };

      router.replace("/");
      router.refresh();
      return { error: null };
    },
    [router]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string
    ): Promise<AuthActionResult> => {
      if (!isSupabaseConfigured()) return authNotConfiguredResult();

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName.trim(),
          },
        },
      });
      if (error) return { error: mapAuthError(error) };

      if (data.user && data.user.identities?.length === 0) {
        return { error: null, alreadyRegistered: true };
      }

      if (!data.session) {
        return { error: null, needsEmailConfirm: true };
      }

      await ensureStudentProfile(supabase, data.user);
      router.replace("/");
      router.refresh();
      return { error: null };
    },
    [router]
  );

  const resetPassword = useCallback(
    async (email: string): Promise<AuthActionResult> => {
      if (!isSupabaseConfigured()) return authNotConfiguredResult();

      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
      });
      if (error) return { error: mapAuthError(error) };

      return { error: null };
    },
    []
  );

  const changePassword = useCallback(
    async (
      oldPassword: string,
      newPassword: string
    ): Promise<AuthActionResult> => {
      if (!isSupabaseConfigured()) return authNotConfiguredResult();

      if (newPassword === oldPassword) {
        return {
          error: "New password must be different from your current password.",
        };
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email?.trim();
      if (!email) {
        return { error: "You must be logged in to change your password." };
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });
      if (verifyError) {
        const message = verifyError.message.toLowerCase();
        if (
          message.includes("invalid login credentials") ||
          message.includes("invalid credentials")
        ) {
          return { error: "Current password is incorrect." };
        }
        return { error: mapAuthError(verifyError) };
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) return { error: mapAuthError(updateError) };

      return { error: null };
    },
    []
  );

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      router.replace("/");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }, [router]);

  const metaName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";
  const emailLocal = user?.email?.split("@")[0]?.trim() ?? "";
  const rawName = metaName || emailLocal || null;
  const displayName = rawName
    ? rawName
        .split(/\s+/)
        .map((part) =>
          part
            ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            : part
        )
        .join(" ")
    : null;

  return {
    isLoggedIn: Boolean(user),
    userId: user?.id ?? null,
    email: user?.email ?? null,
    displayName,
    signIn,
    signUp,
    resetPassword,
    changePassword,
    logout,
  };
}
