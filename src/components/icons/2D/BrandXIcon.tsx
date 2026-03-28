import { iconStyles } from "./helpers";
import { type IIconProps } from "./types";

const clipId = "clip-brand-x-digica";
const maskId = "mask-brand-x-digica";

export function BrandXIcon({ size, className, ...props }: IIconProps) {
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
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={maskId}
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M0 0H24V24H0V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M17.7101 3H20.7559L14.1024 10.6238L21.9306 20.9999H15.802L10.9984 14.7082L5.50824 20.9999H2.45955L9.57552 12.8426L2.06942 3.00142H8.35406L12.6895 8.75122L17.7101 3ZM16.639 19.1727H18.3272L7.43193 4.73218H5.62173L16.639 19.1727Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
