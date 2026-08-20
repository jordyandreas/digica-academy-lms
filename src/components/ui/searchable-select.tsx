"use client";

import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  searchLabel?: string;
};

export type SearchableSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
};

function getOptionSearchText(item: SearchableSelectOption): string {
  if (item.searchLabel) {
    return item.searchLabel;
  }

  if (typeof item.label === "string") {
    return item.label;
  }

  return item.value;
}

const triggerClassName =
  "flex h-9 w-full min-w-0 items-center justify-between rounded-md border border-input bg-background/80 px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const searchInputClassName =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-background/80 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  disabled,
  className,
  itemClassName,
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return options;
    }

    return options.filter((item) =>
      getOptionSearchText(item).toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  const selectedOption = options.find((item) => item.value === value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchQuery("");
    }

    setIsOpen(nextOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(triggerClassName, className)}
        >
          <span
            className={cn(
              "line-clamp-1 text-left capitalize",
              selectedOption ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-[200] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-brand-periwinkle/70 bg-card p-0 shadow-lg"
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
              placeholder={searchPlaceholder}
              autoComplete="off"
              className={cn(searchInputClassName, "pl-9", searchQuery && "pr-9")}
            />
            {searchQuery ? (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => {
              const isSelected = item.value === value;

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={item.disabled}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-left text-sm capitalize outline-none hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-brand-pale/70 text-brand-deep",
                    itemClassName,
                  )}
                  onClick={() => {
                    onChange(item.value);
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected ? <Check className="h-4 w-4" /> : null}
                  </span>
                  {item.label}
                </button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
