"use client";

import * as React from "react";
import PhoneInputWithCountry, {
  type Country,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { PhoneCountrySelect } from "@/components/ui/phone-country-select";
import { cn } from "@/lib/utils";

export type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: Country;
  invalid?: boolean;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value = "",
      onChange,
      defaultCountry = "ID",
      invalid = false,
      placeholder = "812 3456 7890",
      id,
      required,
      disabled,
      name,
      autoComplete = "tel",
      inputMode = "tel",
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const restWithoutRef = rest as typeof rest & { ref?: unknown };
    const { ref: _ignoredRef, ...inputRest } = restWithoutRef;

    return (
      <div
        className={cn(
          "phone-field flex h-9 min-h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-background/80 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
          invalid && "border-destructive focus-within:ring-destructive/30",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <PhoneInputWithCountry
          id={id}
          name={name}
          international={false}
          defaultCountry={defaultCountry}
          countryCallingCodeEditable={false}
          addInternationalOption={false}
          focusInputOnCountrySelection={false}
          smartCaret={false}
          flags={flags}
          countrySelectComponent={PhoneCountrySelect}
          placeholder={placeholder}
          value={value || undefined}
          onChange={(next) => onChange?.(next ?? "")}
          onBlur={onBlur}
          disabled={disabled}
          inputRef={ref}
          numberInputProps={{
            required,
            autoComplete,
            inputMode,
            "aria-invalid": invalid,
            className:
              "PhoneInputInput flex-1 min-w-0 border-0 bg-transparent px-3 py-1 text-sm shadow-none outline-none focus-visible:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed",
            ...inputRest,
          }}
          className="flex w-full min-w-0 items-center"
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export type { Country };
