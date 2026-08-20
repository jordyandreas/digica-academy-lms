import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function GET() {
  const supabaseConfigured = isSupabaseConfigured();

  return NextResponse.json({
    ok: true,
    supabaseConfigured,
  });
}
