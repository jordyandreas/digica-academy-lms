import { NextResponse } from "next/server";
import { getRecordingCheckInPublicData } from "@/features/check-in/getRecordingCheckInPublicData";
import { RECORDING_CHECK_IN_UNAVAILABLE_MESSAGE } from "@/features/check-in/recording-types";
import {
  createAdminClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ programId: string }>;
};

function parseSessionIds(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const ids: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== "string") {
      return null;
    }

    const id = item.trim();
    if (!id || seen.has(id)) {
      continue;
    }

    seen.add(id);
    ids.push(id);
  }

  return ids.length > 0 ? ids : null;
}

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
    const result = await getRecordingCheckInPublicData(identifier);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[check-in/recording] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load recording check-in data" },
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const payload = body as {
      participant_id?: string;
      session_ids?: unknown;
    };

    const participantId = payload.participant_id?.trim();
    const sessionIds = parseSessionIds(payload.session_ids);

    if (!participantId || !sessionIds) {
      return NextResponse.json(
        { error: "participant_id and session_ids are required" },
        { status: 400 },
      );
    }

    const result = await getRecordingCheckInPublicData(identifier);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (result.status === "unavailable") {
      return NextResponse.json(
        { error: RECORDING_CHECK_IN_UNAVAILABLE_MESSAGE },
        { status: 403 },
      );
    }

    const data = result.data;
    const participant = data.participants.find(
      (item) => item.id === participantId,
    );

    if (!participant) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan untuk program ini." },
        { status: 400 },
      );
    }

    const selectedIds = new Set(sessionIds);
    const sessions = data.sessions.filter((item) => selectedIds.has(item.id));

    if (sessions.length !== sessionIds.length) {
      return NextResponse.json(
        { error: "Sesi ini belum bisa dilaporkan." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { data: existingRows, error: existingError } = await supabase
      .from("attendance")
      .select("session_id, status")
      .eq("participant_id", participantId)
      .in("session_id", sessionIds);

    if (existingError) {
      throw existingError;
    }

    const statusBySessionId = new Map(
      (existingRows ?? []).map((row) => [
        row.session_id as string,
        row.status as string,
      ]),
    );

    const recordedSessionNumbers: number[] = [];
    const alreadyPresentSessionNumbers: number[] = [];
    const rowsToUpsert: {
      participant_id: string;
      session_id: string;
      status: "recording";
      updated_at: string;
    }[] = [];
    const updatedAt = new Date().toISOString();

    for (const session of sessions) {
      const status = statusBySessionId.get(session.id);

      if (status === "present") {
        alreadyPresentSessionNumbers.push(session.session_number);
        continue;
      }

      recordedSessionNumbers.push(session.session_number);

      if (status === "recording") {
        continue;
      }

      rowsToUpsert.push({
        participant_id: participantId,
        session_id: session.id,
        status: "recording",
        updated_at: updatedAt,
      });
    }

    if (rowsToUpsert.length > 0) {
      const { error } = await supabase.from("attendance").upsert(rowsToUpsert, {
        onConflict: "participant_id,session_id",
      });

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      recorded_session_numbers: recordedSessionNumbers,
      already_present_session_numbers: alreadyPresentSessionNumbers,
    });
  } catch (error) {
    console.error("[check-in/recording] POST error:", error);
    return NextResponse.json(
      { error: "Gagal mencatat laporan recording." },
      { status: 500 },
    );
  }
}
