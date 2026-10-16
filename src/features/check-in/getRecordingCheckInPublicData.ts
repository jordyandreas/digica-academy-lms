import { createAdminClient } from "@/lib/supabase/admin";
import { getJakartaTodayDateString } from "@/lib/date-utils";
import type { ProgramType } from "@/features/programs/types";
import type {
  RecordingCheckInAvailableData,
  RecordingCheckInProgramType,
  RecordingCheckInUnavailableData,
} from "@/features/check-in/recording-types";
import { resolveProgramIdByIdentifier } from "@/utils/program-public-link";
import { getPublicRecordingSessions } from "@/utils/check-in-sessions";
import { fetchAllPages } from "@/utils/supabase-fetch-all";

export function isRecordingCheckInProgramType(
  type: unknown,
): type is RecordingCheckInProgramType {
  return type === "mini_bootcamp" || type === "bootcamp";
}

export type RecordingCheckInPublicDataResult =
  | { status: "ok"; data: RecordingCheckInAvailableData }
  | { status: "unavailable"; data: RecordingCheckInUnavailableData }
  | { status: "not_found" };

export async function getRecordingCheckInPublicData(
  identifier: string,
): Promise<RecordingCheckInPublicDataResult> {
  const supabase = createAdminClient();
  const programId = await resolveProgramIdByIdentifier(supabase, identifier);

  if (!programId) {
    return { status: "not_found" };
  }

  const { data: program, error: programError } = await supabase
    .from("programs")
    .select("id, name, type")
    .eq("id", programId)
    .maybeSingle();

  if (programError) {
    throw programError;
  }

  if (!program) {
    return { status: "not_found" };
  }

  const programType = program.type as ProgramType;

  if (!isRecordingCheckInProgramType(programType)) {
    return {
      status: "unavailable",
      data: {
        available: false,
        program: {
          id: program.id as string,
          name: program.name as string,
          type: programType,
        },
      },
    };
  }

  const { data: participants, error: participantsError } = await fetchAllPages(
    (from, to) =>
      supabase
        .from("participants")
        .select("id, name, email, phone")
        .eq("program_id", programId)
        .eq("payment_status", "paid")
        .order("name", { ascending: true })
        .range(from, to),
  );

  if (participantsError) {
    throw participantsError;
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("program_sessions")
    .select("id, session_number, session_date")
    .eq("program_id", programId)
    .order("session_number", { ascending: true });

  if (sessionsError) {
    throw sessionsError;
  }

  const today = getJakartaTodayDateString();
  const recordingSessions = getPublicRecordingSessions(sessions ?? [], today);
  const participantRows = (participants ?? []).map((participant) => ({
    id: participant.id as string,
    name: (participant.name as string | null) ?? null,
    email: (participant.email as string | null) ?? null,
    phone: (participant.phone as string | null) ?? null,
  }));
  const sessionRows = recordingSessions.map((session) => ({
    id: session.id,
    session_number: session.session_number,
    session_date: session.session_date,
  }));

  const occupiedSessionIdsByParticipant: Record<string, string[]> = {};
  const participantIds = participantRows.map((participant) => participant.id);
  const sessionIds = sessionRows.map((session) => session.id);

  if (participantIds.length > 0 && sessionIds.length > 0) {
    const { data: attendanceRows, error: attendanceError } = await fetchAllPages(
      (from, to) =>
        supabase
          .from("attendance")
          .select("participant_id, session_id")
          .in("participant_id", participantIds)
          .in("session_id", sessionIds)
          .range(from, to),
    );

    if (attendanceError) {
      throw attendanceError;
    }

    for (const row of attendanceRows ?? []) {
      const participantId = row.participant_id as string;
      const sessionId = row.session_id as string;
      const current = occupiedSessionIdsByParticipant[participantId] ?? [];
      current.push(sessionId);
      occupiedSessionIdsByParticipant[participantId] = current;
    }
  }

  return {
    status: "ok",
    data: {
      available: true,
      program: {
        id: program.id as string,
        name: program.name as string,
        type: programType,
      },
      participants: participantRows,
      sessions: sessionRows,
      occupied_session_ids_by_participant: occupiedSessionIdsByParticipant,
    },
  };
}
