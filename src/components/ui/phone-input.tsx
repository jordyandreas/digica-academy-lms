"use client";

import * as React from "react";
import PhoneInputWithCountry, {
  type Country,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { PhoneCountrySelect } from "@/components/ui/phone-country-select";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PHONE_COUNTRY,
  isWithinMaxPhoneDigits,
  toE164PhoneForInput,
  wouldExceedMaxNationalDigits,
} from "@/utils/phone";

export type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value?: string;
  onChange?: (value: string) => void;
  onMaxDigitsExceeded?: () => void;
  defaultCountry?: Country;
  invalid?: boolean;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value = "",
      onChange,
      onMaxDigitsExceeded,
      defaultCountry = DEFAULT_PHONE_COUNTRY,
      invalid = false,
      placeholder = "812 3456 7890",
      id,
      required,
      disabled,
      name,
      autoComplete = "tel",
      inputMode = "tel",
      onBlur,
      onKeyDown,
      onPaste,
      ...rest
    },
    ref,
  ) => {
    const restWithoutRef = rest as typeof rest & { ref?: unknown };
    const { ref: _ignoredRef, ...inputRest } = restWithoutRef;
    const inputRestHandlers = inputRest as {
      onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
      onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
    };
    const {
      onKeyDown: inputRestKeyDown,
      onPaste: inputRestPaste,
      ...remainingInputRest
    } = inputRestHandlers;
    const [country, setCountry] = React.useState<Country>(defaultCountry);
    const [inputResetKey, setInputResetKey] = React.useState(0);
    const e164Value = toE164PhoneForInput(value, country);

    React.useEffect(() => {
      setCountry(defaultCountry);
    }, [defaultCountry]);

    const rejectOverflow = React.useCallback(() => {
      onMaxDigitsExceeded?.();
    }, [onMaxDigitsExceeded]);

    const resetInput = React.useCallback(() => {
      setInputResetKey((current) => current + 1);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      inputRestKeyDown?.(event);
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;

      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? input.value.length;

      if (
        wouldExceedMaxNationalDigits(
          input.value,
          event.key,
          selectionStart,
          selectionEnd,
          country,
        )
      ) {
        event.preventDefault();
        rejectOverflow();
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      inputRestPaste?.(event);
      onPaste?.(event);
      if (event.defaultPrevented) return;

      const pasted = event.clipboardData.getData("text");
      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? input.value.length;

      if (
        wouldExceedMaxNationalDigits(
          input.value,
          pasted,
          selectionStart,
          selectionEnd,
          country,
        )
      ) {
        event.preventDefault();
        rejectOverflow();
      }
    };

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
          key={inputResetKey}
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
          value={e164Value}
          onCountryChange={(nextCountry) => {
            if (nextCountry) setCountry(nextCountry);
          }}
          onChange={(next) => {
            if (!next) {
              onChange?.("");
              return;
            }
            if (!isWithinMaxPhoneDigits(next)) {
              rejectOverflow();
              resetInput();
              return;
            }
            onChange?.(next);
          }}
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
            ...remainingInputRest,
            onKeyDown: handleKeyDown,
            onPaste: handlePaste,
          }}
          className="flex w-full min-w-0 items-center"
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export type { Country };
