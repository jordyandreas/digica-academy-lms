"use client";

import { type ReactNode } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type RadioCardOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  price?: ReactNode;
  disabled?: boolean;
};

export type RadioCardGroupControllerProps<Schema extends FieldValues> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  options: RadioCardOption[];
  emptyMessage?: ReactNode;
  className?: string;
  optionClassName?: string;
  /** Accessible name when there is no visible `label`. */
  ariaLabel?: string;
};

export function RadioCardGroupController<Schema extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  options,
  emptyMessage = "No options available.",
  className,
  optionClassName,
  ariaLabel,
}: RadioCardGroupControllerProps<Schema>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldError = fieldState.error?.message;
        const value = String(field.value ?? "");

        return (
          <div className={cn("w-full", className)}>
            {label ? (
              <div className="space-y-1">
                <Label className="text-brand-deep">
                  {label}
                  {required ? (
                    <span className="ml-1 text-destructive">*</span>
                  ) : null}
                </Label>
                {description ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
            ) : null}

            <div
              className={cn("space-y-2", label && "mt-3")}
              role="radiogroup"
              aria-label={ariaLabel}
              aria-invalid={Boolean(fieldError)}
              aria-required={required}
            >
              {options.length === 0 ? (
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              ) : (
                options.map((option) => {
                  const selected = value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={option.disabled}
                      onClick={() => {
                        field.onChange(option.value);
                      }}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
                        selected
                          ? "border-brand-royal/60 bg-brand-pale/40 text-brand-deep shadow-sm ring-1 ring-brand-royal/20"
                          : "border-border bg-background hover:border-brand-periwinkle",
                        optionClassName,
                      )}
                    >
                      <p className="text-sm font-semibold text-brand-deep">
                        {option.label}
                      </p>
                      {option.description ? (
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      ) : null}
                      {option.price ? (
                        <p className="mt-1 text-sm font-medium text-brand-royal">
                          {option.price}
                        </p>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            {fieldError ? (
              <p className="mt-2 text-xs text-destructive">{fieldError}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
