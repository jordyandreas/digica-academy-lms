import { z } from "zod";
import { registrationOccupationOptionValues } from "@/schemas/participant-registration-schema";
import { optionalParticipantPhoneSchema } from "@/schemas/phone-schema";

export const studentProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  phone: optionalParticipantPhoneSchema(),
  occupation: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        registrationOccupationOptionValues.includes(
          value as (typeof registrationOccupationOptionValues)[number],
        ),
      { message: "Occupation must be one of the provided options" },
    ),
  organization: z.string().trim(),
});

export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;
