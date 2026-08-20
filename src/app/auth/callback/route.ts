import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function isSafeNextPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

function isPasswordResetNext(path: string) {
  return (
    path === "/account/reset-password" ||
    path.startsWith("/account/reset-password?")
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  const next = isSafeNextPath(nextParam) ? nextParam : "/";
  const redirectTo = new URL(next, origin);
  const resetFailed = new URL("/?authError=reset", origin);

  if (!code || !isSupabaseConfigured()) {
    if (isPasswordResetNext(next)) {
      return NextResponse.redirect(resetFailed);
    }
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(resetFailed);
  }

  return NextResponse.redirect(redirectTo);
}
