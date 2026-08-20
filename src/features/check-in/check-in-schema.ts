import { z } from "zod";
import {
  SECURE_SEAT_INTEREST_VALUES,
  isSecureSeatInterest,
  type SecureSeatInterest,
} from "@/constants/secure-seat-interest";

export type CheckInFormValues = {
  participant_id: string;
  session_id: string;
  secure_seat_interest: SecureSeatInterest | "";
};

export const emptyCheckInValues: CheckInFormValues = {
  participant_id: "",
  session_id: "",
  secure_seat_interest: "",
};

export function checkInFormSchema(isWorkshop: boolean) {
  return z
    .object({
      participant_id: z.string().min(1, "Pilih namamu."),
      session_id: z.string().min(1, "Pilih sesi."),
      secure_seat_interest: z.union([
        z.enum(SECURE_SEAT_INTEREST_VALUES),
        z.literal(""),
      ]),
    })
    .superRefine((values, ctx) => {
      if (isWorkshop && !isSecureSeatInterest(values.secure_seat_interest)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pilih minat promo.",
          path: ["secure_seat_interest"],
        });
      }
    });
}
