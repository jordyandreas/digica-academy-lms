import { z } from "zod";
import {
  isValidParticipantPhone,
  isWithinMaxPhoneDigits,
  MAX_PHONE_DIGITS,
} from "@/utils/phone";

type ParticipantPhoneMessages = {
  required?: string;
  invalid?: string;
  maxDigits?: string;
};

export function phoneMaxDigitsMessage(maxDigits = MAX_PHONE_DIGITS) {
  return `Phone number must be at most ${maxDigits} digits`;
}

export function participantPhoneSchema(messages: ParticipantPhoneMessages = {}) {
  const {
    required = "Phone number is required",
    invalid = "Enter a valid WhatsApp number",
    maxDigits = phoneMaxDigitsMessage(),
  } = messages;

  return z.string().trim().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: required });
      return;
    }
    if (!isWithinMaxPhoneDigits(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: maxDigits });
      return;
    }
    if (!isValidParticipantPhone(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: invalid });
    }
  });
}

export function optionalParticipantPhoneSchema(
  messages: Omit<ParticipantPhoneMessages, "required"> = {},
) {
  const {
    invalid = "Enter a valid WhatsApp number",
    maxDigits = phoneMaxDigitsMessage(),
  } = messages;

  return z.string().trim().superRefine((value, ctx) => {
    if (!value) return;
    if (!isWithinMaxPhoneDigits(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: maxDigits });
      return;
    }
    if (!isValidParticipantPhone(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: invalid });
    }
  });
}
