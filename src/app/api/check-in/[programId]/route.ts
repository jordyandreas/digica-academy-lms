import { NextResponse } from "next/server";
import { isSecureSeatInterest } from "@/constants/secure-seat-interest";
import { getCheckInPublicData } from "@/features/check-in/getCheckInPublicData";
import {
  createAdminClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/admin";
import { resolveProgramIdByIdentifier } from "@/utils/program-public-link";

type RouteContext = {
  params: Promise<{ programId: string }>;
};

function configurationError() {
  return NextResponse.json(
    {
      error:
        "Check-in is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
    },
    { status: 500 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  if (!isServiceRoleConfigured()) {
    return configurationError();
  }

  try {
    const { programId: identifier } = await context.params;
    const result = await getCheckInPublicData(identifier);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (result.status === "no_sessions") {
      return NextResponse.json(
        { error: "This program has no sessions configured" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[check-in] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load check-in data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!isServiceRoleConfigured()) {
    return configurationError();
  }

  try {
    const { programId: identifier } = await context.params;
    const supabase = createAdminClient();
    const resolvedProgramId = await resolveProgramIdByIdentifier(
      supabase,
      identifier,
    );

    if (!resolvedProgramId) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const payload = body as {
      participant_id?: string;
      session_id?: string;
      secure_seat_interest?: string;
    };

    const participantId = payload.participant_id?.trim();
    const sessionId = payload.session_id?.trim();
    const secureSeatInterest = payload.secure_seat_interest?.trim();

    if (!participantId || !sessionId) {
      return NextResponse.json(
        { error: "participant_id and session_id are required" },
        { status: 400 },
      );
    }

    const result = await getCheckInPublicData(identifier);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (result.status === "no_sessions") {
      return NextResponse.json(
        { error: "This program has no sessions configured" },
        { status: 404 },
      );
    }

    const data = result.data;
    const isWorkshop = data.program.type === "workshop";

    if (isWorkshop && !isSecureSeatInterest(secureSeatInterest)) {
      return NextResponse.json(
        {
          error:
            "secure_seat_interest is required and must be yes, undecided, or no",
        },
        { status: 400 },
      );
    }

    const participant = data.participants.find(
      (item) => item.id === participantId,
    );

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found for this program" },
        { status: 400 },
      );
    }

    const session = data.sessions.find((item) => item.id === sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Check-in is only available for today's session" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("attendance").upsert(
      {
        participant_id: participantId,
        session_id: sessionId,
        status: "present",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "participant_id,session_id" },
    );

    if (error) {
      throw error;
    }

    if (isWorkshop && isSecureSeatInterest(secureSeatInterest)) {
      const { error: interestError } = await supabase
        .from("participants")
        .update({ secure_seat_interest: secureSeatInterest })
        .eq("id", participantId)
        .eq("program_id", resolvedProgramId);

      if (interestError) {
        throw interestError;
      }
    }

    return NextResponse.json({
      success: true,
      session_number: session.session_number,
    });
  } catch (error) {
    console.error("[check-in] POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit check-in" },
      { status: 500 },
    );
  }
}
