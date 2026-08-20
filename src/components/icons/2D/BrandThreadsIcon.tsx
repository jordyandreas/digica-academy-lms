import { iconStyles } from "./helpers";
import { type IIconProps } from "./types";

export function BrandThreadsIcon({ size, className, ...props }: IIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={iconStyles(size, className)}
      aria-hidden
      {...props}
    >
      <path
        d="M19 7.5c-1.333-3-3.667-4.5-7-4.5-5 0-8 2.5-8 9s3.5 9 8 9 7.5-3 7.5-7c0-2.5-1.5-4.5-4-4.5s-4 2-4 4.5 1 4.5 3 4.5 2.5-1 3-2.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
