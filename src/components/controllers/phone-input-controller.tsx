"use client";

import {
  TextInputController,
  type TextInputControllerProps,
} from "@/components/controllers/text-input-controller";
import type { FieldValues } from "react-hook-form";

export type PhoneInputControllerProps<Schema extends FieldValues> = Omit<
  TextInputControllerProps<Schema>,
  "showCountryCode"
>;

/** Phone field controller — shorthand for TextInputController with country code enabled. */
export function PhoneInputController<Schema extends FieldValues>(
  props: PhoneInputControllerProps<Schema>,
) {
  return <TextInputController {...props} showCountryCode />;
}
