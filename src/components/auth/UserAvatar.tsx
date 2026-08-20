import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const boxBySize = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-14 w-14",
} as const;

const iconBySize = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

export function UserAvatar({ size = "md", className }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "user-avatar-glass inline-flex items-center justify-center rounded-full text-primary",
        boxBySize[size],
        className,
      )}
      aria-hidden
    >
      <User className={iconBySize[size]} strokeWidth={1.75} />
    </span>
  );
}
