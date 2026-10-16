import type { ProgramType } from "@/features/programs/types";
import type {
  CheckInParticipant,
  CheckInSession,
} from "@/features/check-in/types";

export type RecordingCheckInProgramType = Extract<
  ProgramType,
  "mini_bootcamp" | "bootcamp"
>;

export type RecordingCheckInProgram = {
  id: string;
  name: string;
  type: RecordingCheckInProgramType;
};

export type RecordingCheckInAvailableData = {
  available: true;
  program: RecordingCheckInProgram;
  participants: CheckInParticipant[];
  sessions: CheckInSession[];
  /** Session IDs that already have an attendance row, keyed by paid participant id. */
  occupied_session_ids_by_participant: Record<string, string[]>;
};

export type RecordingCheckInUnavailableData = {
  available: false;
  program: {
    id: string;
    name: string;
    type: ProgramType;
  };
};

export type RecordingCheckInResponse =
  | RecordingCheckInAvailableData
  | RecordingCheckInUnavailableData;

export const RECORDING_CHECK_IN_UNAVAILABLE_MESSAGE =
  "Absensi recording tidak tersedia untuk workshop.";

export const RECORDING_ALREADY_PRESENT_MESSAGE =
  "Sesi ini sudah tercatat hadir live.";

export type RecordingCheckInSubmitResult = {
  success: true;
  recorded_session_numbers: number[];
  already_present_session_numbers: number[];
};
