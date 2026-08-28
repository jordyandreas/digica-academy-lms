"use client";

import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type { Country } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DEFAULT_PHONE_COUNTRY } from "@/utils/phone";

export type PhoneInputControllerProps<Schema extends FieldValues> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  defaultCountry?: Country;
  componentProps?: {
    wrapper?: ComponentProps<"div">;
    input?: ComponentProps<"input">;
    phone?: Omit<ComponentProps<typeof PhoneInput>, "value" | "onChange">;
  };
};

/** Phone field controller — validation lives in Zod schemas only. */
export function PhoneInputController<Schema extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder = "812 3456 7890",
  defaultCountry = DEFAULT_PHONE_COUNTRY,
  componentProps,
}: PropsWithChildren<PhoneInputControllerProps<Schema>>) {
  const { wrapper, input, phone } = componentProps ?? {};
  const { className: wrapperClassName, ...wrapperRest } = wrapper ?? {};
  const {
    className: inputClassName,
    id,
    placeholder: inputPlaceholder,
    ...inputRest
  } = input ?? {};
  const {
    className: phoneClassName,
    defaultCountry: phoneDefaultCountry,
    placeholder: phonePlaceholder,
    ...phoneRest
  } = phone ?? {};

  const resolvedPlaceholder =
    phonePlaceholder ?? inputPlaceholder ?? placeholder;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const inputId = id ?? phoneRest.id ?? field.name;
        const fieldError = fieldState.error?.message;

        return (
          <div className={cn("w-full", wrapperClassName)} {...wrapperRest}>
            {label ? (
              <Label htmlFor={inputId} className="text-brand-deep">
                {label}
                {required ? (
                  <span className="ml-1 text-destructive">*</span>
                ) : null}
              </Label>
            ) : null}

            <PhoneInput
              {...phoneRest}
              {...inputRest}
              id={inputId}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={resolvedPlaceholder}
              invalid={Boolean(fieldError)}
              aria-required={required}
              defaultCountry={phoneDefaultCountry ?? defaultCountry}
              className={cn("mt-2", phoneClassName, inputClassName)}
            />

            {fieldError ? (
              <p className="mt-2 text-xs text-destructive">{fieldError}</p>
            ) : description ? (
              <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
