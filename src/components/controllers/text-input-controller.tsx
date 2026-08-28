"use client";

import {
  type ComponentProps,
  type ReactNode,
  type PropsWithChildren,
  useState,
} from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type TextInputControllerProps<Schema extends FieldValues> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  /** Password field with a show/hide toggle. */
  password?: boolean;
  componentProps?: {
    wrapper?: ComponentProps<"div">;
    input?: ComponentProps<"input">;
  };
};

export function TextInputController<Schema extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  password = false,
  componentProps,
}: PropsWithChildren<TextInputControllerProps<Schema>>) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { wrapper, input } = componentProps ?? {};
  const { className: wrapperClassName, ...wrapperRest } = wrapper ?? {};
  const {
    className: inputClassName,
    id,
    onChange,
    placeholder: inputPlaceholder,
    type = "text",
    ...inputRest
  } = input ?? {};

  const resolvedPlaceholder = inputPlaceholder ?? placeholder;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const inputId = id ?? field.name;
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

            <div className="relative mt-2">
              <Input
                {...field}
                {...inputRest}
                id={inputId}
                type={
                  password ? (passwordVisible ? "text" : "password") : type
                }
                placeholder={resolvedPlaceholder}
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  onChange?.(event);
                }}
                className={cn(
                  "bg-background/80",
                  password && "pr-10",
                  inputClassName,
                )}
                aria-invalid={Boolean(fieldError)}
                aria-required={required}
              />
              {password ? (
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={passwordVisible}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
              ) : null}
            </div>

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
