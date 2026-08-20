"use client";

import {
  type ComponentProps,
  type ReactNode,
  type PropsWithChildren,
} from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type TextareaControllerProps<Schema extends FieldValues> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  componentProps?: {
    wrapper?: ComponentProps<"div">;
    textarea?: ComponentProps<"textarea">;
  };
};

export function TextareaController<Schema extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  componentProps,
}: PropsWithChildren<TextareaControllerProps<Schema>>) {
  const { wrapper, textarea } = componentProps ?? {};
  const { className: wrapperClassName, ...wrapperRest } = wrapper ?? {};
  const { className: textareaClassName, id, onChange, ...textareaRest } =
    textarea ?? {};

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const textareaId = id ?? field.name;
        const fieldError = fieldState.error?.message;

        return (
          <div className={cn("w-full", wrapperClassName)} {...wrapperRest}>
            {label ? (
              <Label htmlFor={textareaId} className="text-brand-deep">
                {label}
                {required ? (
                  <span className="ml-1 text-destructive">*</span>
                ) : null}
              </Label>
            ) : null}

            <Textarea
              {...field}
              {...textareaRest}
              id={textareaId}
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(event) => {
                field.onChange(event.target.value);
                onChange?.(event);
              }}
              className={cn("mt-2", textareaClassName)}
              aria-invalid={Boolean(fieldError)}
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
