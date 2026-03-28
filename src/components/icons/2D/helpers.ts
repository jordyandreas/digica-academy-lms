import { cn } from "@/lib/utils";
import { IconSize } from "./types";

export function iconStyles(size?: IconSize, className?: string) {
  return cn(
    "relative shrink-0",
    {
      "size-2": size === IconSize["3xs"],
      "size-3": size === IconSize["2xs"],
      "size-4": size === IconSize.xs,
      "size-[1.125rem]": size === IconSize.sm,
      "size-5": size === IconSize.md,
      "size-6": size === IconSize.lg,
      "size-12": size === IconSize.xl,
      "size-17": size === IconSize["2xl"],
      "size-20 lg:text-[6.25rem]": size === IconSize["3xl"],
    },
    className,
  );
}
