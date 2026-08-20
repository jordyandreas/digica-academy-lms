import { NextResponse } from "next/server";
import { diagnoseProgramLookup } from "@/features/programs/diagnoseProgramLookup";
import { getPublicProgramByIdentifier } from "@/features/programs/getPublicPrograms";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ programId: string }>;
};

/** Dev helper: inspect why a program detail lookup succeeds or fails. */
export async function GET(_request: Request, context: RouteContext) {
  const { programId } = await context.params;

  const [program, diagnosis] = await Promise.all([
    getPublicProgramByIdentifier(programId),
    diagnoseProgramLookup(programId),
  ]);

  return NextResponse.json({
    programId,
    found: Boolean(program),
    program: program
      ? { id: program.id, title: program.title, type: program.type }
      : null,
    supabaseConfigured: isSupabaseConfigured(),
    serviceRoleConfigured: isServiceRoleConfigured(),
    diagnosis,
  });
}
