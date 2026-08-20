"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { getCountryCallingCode } from "react-phone-number-input/input";
import type { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CountrySelectOption = {
  value?: Country;
  label: string;
};

export type PhoneCountrySelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountrySelectOption[];
  iconComponent: React.ElementType<{
    country?: Country;
    label?: string;
    "aria-hidden"?: boolean;
  }>;
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
};

function CountryFlag({
  country,
  title,
}: {
  country?: Country;
  title?: string;
}) {
  if (!country) {
    return null;
  }

  const Flag = flags[country];
  if (!Flag) {
    return null;
  }

  return (
    <span
      data-phone-flag
      className="inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] [&_svg]:h-full [&_svg]:w-full"
      aria-hidden
    >
      <Flag title={title ?? country} />
    </span>
  );
}

function formatCallingCode(country?: Country): string {
  if (!country) {
    return "";
  }

  try {
    return `+${getCountryCallingCode(country)}`;
  } catch {
    return "";
  }
}

function filterCountryOptions(
  options: CountrySelectOption[],
  query: string,
): CountrySelectOption[] {
  const normalizedQuery = query.trim().toLowerCase();

  return options.filter((option) => {
    if (!option.value) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const callingCode = formatCallingCode(option.value).toLowerCase();
    const digitsOnly = normalizedQuery.replace(/\D/g, "");

    return (
      option.label.toLowerCase().includes(normalizedQuery) ||
      callingCode.includes(normalizedQuery) ||
      (digitsOnly.length > 0 && callingCode.replace("+", "").includes(digitsOnly))
    );
  });
}

export const PhoneCountrySelect = React.forwardRef<
  HTMLButtonElement,
  PhoneCountrySelectProps
>(function PhoneCountrySelect(
  {
    value,
    onChange,
    options,
    disabled,
    readOnly,
    onFocus,
    onBlur,
    className,
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = React.useMemo(
    () => filterCountryOptions(options, searchQuery),
    [options, searchQuery],
  );

  const selectedLabel = React.useMemo(
    () => options.find((option) => option.value === value)?.label ?? value ?? "",
    [options, value],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      onFocus?.();
      requestAnimationFrame(() => searchInputRef.current?.focus());
      return;
    }

    setSearchQuery("");
    onBlur?.();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          disabled={disabled || readOnly}
          aria-label="Select country code"
          className={cn(
            "phone-country-trigger flex h-full max-h-9 shrink-0 items-center gap-1.5 overflow-hidden border-r border-input py-1 pl-2.5 pr-2 outline-none transition-colors hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <CountryFlag country={value} title={selectedLabel} />
          <span className="text-sm font-medium text-foreground">
            {formatCallingCode(value)}
          </span>
          <span className="inline-flex size-3.5 shrink-0 items-center justify-center overflow-hidden text-muted-foreground">
            <ChevronDown
              size={14}
              strokeWidth={2}
              aria-hidden
              className="block"
              style={{ width: 14, height: 14, minWidth: 14, minHeight: 14 }}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="phone-country-popover z-[100] w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-xl border border-brand-periwinkle/70 bg-card p-0 shadow-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="border-b border-border/80 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search country or code..."
              autoComplete="off"
              className="flex h-9 w-full rounded-md border border-input bg-background/80 py-1 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const country = option.value!;
              const selected = country === value;

              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-brand-pale/70 text-brand-deep"
                      : "text-foreground hover:bg-muted/60",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <CountryFlag country={country} title={option.label} />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums",
                      selected ? "text-brand-royal" : "text-muted-foreground",
                    )}
                  >
                    {formatCallingCode(country)}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No country found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

PhoneCountrySelect.displayName = "PhoneCountrySelect";
