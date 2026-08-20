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
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type DatePickerControllerProps<Schema extends FieldValues> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  componentProps?: {
    wrapper?: ComponentProps<"div">;
    datePicker?: ComponentProps<typeof DatePicker>;
  };
};

export function DatePickerController<Schema extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  componentProps,
}: PropsWithChildren<DatePickerControllerProps<Schema>>) {
  const { wrapper, datePicker } = componentProps ?? {};
  const { className: wrapperClassName, ...wrapperRest } = wrapper ?? {};
  const {
    className: datePickerClassName,
    onChange,
    id: datePickerId,
    ...datePickerRest
  } = datePicker ?? {};

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldError = fieldState.error?.message;
        const inputId = datePickerId ?? field.name;

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

            <DatePicker
              id={inputId}
              value={field.value ?? ""}
              placeholder={placeholder}
              onChange={(nextValue) => {
                field.onChange(nextValue);
                onChange?.(nextValue);
              }}
              className={cn("mt-2", datePickerClassName)}
              {...datePickerRest}
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
