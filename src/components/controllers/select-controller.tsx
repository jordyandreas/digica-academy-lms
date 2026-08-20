"use client";

import { type ReactNode, type PropsWithChildren } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type OptionItem = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  searchLabel?: string;
};

export type SelectControllerProps<
  Schema extends FieldValues,
  Option extends OptionItem = OptionItem,
> = {
  form: UseFormReturn<Schema>;
  name: FieldPath<Schema>;
  label?: ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  options?: Option[];
  componentProps?: {
    wrapper?: { className?: string };
    selectTrigger?: { id?: string; className?: string };
    searchableSelect?: {
      id?: string;
      className?: string;
      itemClassName?: string;
    };
  };
};

export function SelectController<
  Schema extends FieldValues,
  Option extends OptionItem = OptionItem,
>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  searchable = false,
  searchPlaceholder = "Search...",
  disabled = false,
  options = [],
  componentProps,
}: PropsWithChildren<SelectControllerProps<Schema, Option>>) {
  const triggerId =
    componentProps?.searchableSelect?.id ??
    componentProps?.selectTrigger?.id ??
    String(name);

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldError = fieldState.error?.message;
        const value = String(field.value ?? "");

        return (
          <div className={cn("w-full", componentProps?.wrapper?.className)}>
            {label ? (
              <Label htmlFor={triggerId} className="text-brand-deep">
                {label}
                {required ? (
                  <span className="ml-1 text-destructive">*</span>
                ) : null}
              </Label>
            ) : null}

            {searchable ? (
              <SearchableSelect
                id={triggerId}
                value={value}
                onChange={field.onChange}
                options={options}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                disabled={disabled}
                className={cn("mt-2", componentProps?.searchableSelect?.className)}
                itemClassName={componentProps?.searchableSelect?.itemClassName}
              />
            ) : (
              <Select
                value={value || undefined}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger
                  id={triggerId}
                  disabled={disabled}
                  className={cn(
                    "mt-2 bg-background/80 capitalize",
                    componentProps?.selectTrigger?.className,
                  )}
                >
                  {value ? (
                    <SelectValue placeholder={placeholder} />
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {options.map((item) => (
                    <SelectItem
                      key={`${String(name)}-${item.value}`}
                      value={item.value}
                      disabled={item.disabled}
                      className="capitalize"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
