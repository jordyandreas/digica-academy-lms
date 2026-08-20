import type { ProgramType } from "@/features/programs/types";

export type CheckInParticipant = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export type CheckInSession = {
  id: string;
  session_number: number;
  session_date: string | null;
};

export type CheckInProgram = {
  id: string;
  name: string;
  type: ProgramType;
  batch: number | null;
  registration_link: string | null;
  bootcamp_registration_link: string | null;
  public_code: string | null;
  public_slug: string | null;
  promo_banner_url: string | null;
  secure_seat_target_type?: Extract<ProgramType, "mini_bootcamp" | "bootcamp"> | null;
};

export type CheckInPublicData = {
  program: CheckInProgram;
  participants: CheckInParticipant[];
  sessions: CheckInSession[];
};
