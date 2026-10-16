import { z } from "zod";

export type RecordingCheckInFormValues = {
  participant_id: string;
  session_ids: string[];
};

export const emptyRecordingCheckInValues: RecordingCheckInFormValues = {
  participant_id: "",
  session_ids: [],
};

export const recordingCheckInFormSchema = z.object({
  participant_id: z.string().min(1, "Pilih namamu."),
  session_ids: z
    .array(z.string().min(1))
    .min(1, "Pilih sesi yang sudah kamu tonton."),
});
