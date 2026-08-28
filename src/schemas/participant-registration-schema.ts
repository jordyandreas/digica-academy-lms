import { z } from "zod";
import {
  isPackageKeyForSource,
  isRegistrationSource,
  type RegistrationPackage,
  type RegistrationSource,
} from "@/constants/registration-offers";
import {
  optionalParticipantPhoneSchema,
  participantPhoneSchema,
} from "@/schemas/phone-schema";

export const registrationOccupationOptions = [
  { label: "mahasiswa", value: "mahasiswa" },
  { label: "fresh graduate", value: "fresh_graduate" },
  { label: "karyawan", value: "karyawan" },
  { label: "freelance", value: "freelance" },
  { label: "job seeker", value: "job_seeker" },
  { label: "other", value: "other" },
] as const;

export const registrationOccupationOptionValues =
  registrationOccupationOptions.map((option) => option.value) as [
    "mahasiswa",
    "fresh_graduate",
    "karyawan",
    "freelance",
    "job_seeker",
    "other",
  ];

const baseParticipantRegistrationSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email must be valid"),
  phone: participantPhoneSchema(),
  occupation: z
    .string()
    .trim()
    .min(1, "Occupation is required")
    .refine(
      (value) =>
        registrationOccupationOptionValues.includes(
          value as (typeof registrationOccupationOptionValues)[number],
        ),
      {
        message: "Occupation must be one of the provided options",
      },
    ),
  organization: z.string().trim().min(1, "Organization is required"),
});

export const participantRegistrationSchema = baseParticipantRegistrationSchema;

export type ProgramRegistrationFormValues = {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  organization: string;
  selected_package: string;
  friend_name: string;
  friend_phone: string;
};

export const emptyProgramRegistrationValues: ProgramRegistrationFormValues = {
  name: "",
  email: "",
  phone: "",
  occupation: "",
  organization: "",
  selected_package: "",
  friend_name: "",
  friend_phone: "",
};

/** Client form schema. `registration_source` is not a field; it comes from the URL. */
export function programRegistrationFormSchema(
  paid: boolean,
  registrationSource: RegistrationSource,
) {
  const formFields = z.object({
    name: z.string().trim().min(1, "Nama lengkap wajib diisi."),
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi.")
      .email("Email tidak valid."),
    phone: participantPhoneSchema({
      required: "Nomor WhatsApp wajib diisi.",
      invalid: "Masukkan nomor WhatsApp yang valid.",
      maxDigits: "Nomor WhatsApp maksimal 15 digit.",
    }),
    occupation: z
      .string()
      .trim()
      .min(1, "Pekerjaan / status wajib dipilih.")
      .refine(
        (value) =>
          registrationOccupationOptionValues.includes(
            value as (typeof registrationOccupationOptionValues)[number],
          ),
        { message: "Pilih salah satu opsi pekerjaan / status." },
      ),
    organization: z.string().trim().min(1, "Institusi / organisasi wajib diisi."),
    selected_package: z.string(),
    friend_name: z.string(),
    friend_phone: optionalParticipantPhoneSchema({
      invalid: "Masukkan nomor WhatsApp teman yang valid.",
      maxDigits: "Nomor WhatsApp teman maksimal 15 digit.",
    }),
  });

  if (!paid) {
    return formFields;
  }

  return formFields.superRefine((data, ctx) => {
    if (!data.selected_package.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pilih paket.",
        path: ["selected_package"],
      });
      return;
    }

    if (!isPackageKeyForSource(registrationSource, data.selected_package)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paket tidak tersedia untuk sumber pendaftaran ini.",
        path: ["selected_package"],
      });
      return;
    }

    if (data.selected_package === "bareng_teman") {
      if (!data.friend_name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nama teman wajib diisi.",
          path: ["friend_name"],
        });
      }
      if (!data.friend_phone.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nomor WhatsApp teman wajib diisi.",
          path: ["friend_phone"],
        });
      }
    }
  });
}

export const paidParticipantRegistrationSchema =
  baseParticipantRegistrationSchema
    .extend({
      registration_source: z
        .string()
        .trim()
        .min(1, "Registration source is required"),
      selected_package: z.string().trim().min(1, "Package is required"),
      friend_name: z.string().trim().optional(),
      friend_phone: optionalParticipantPhoneSchema().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isRegistrationSource(data.registration_source)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration source is invalid",
          path: ["registration_source"],
        });
        return;
      }

      const source = data.registration_source as RegistrationSource;

      if (!isPackageKeyForSource(source, data.selected_package)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Package is invalid for this source",
          path: ["selected_package"],
        });
        return;
      }

      const selectedPackage = data.selected_package as RegistrationPackage;

      if (selectedPackage === "bareng_teman") {
        if (!data.friend_name?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Friend name is required for Bareng teman package",
            path: ["friend_name"],
          });
        }
        if (!data.friend_phone?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Friend phone is required for Bareng teman package",
            path: ["friend_phone"],
          });
        }
      }
    });
