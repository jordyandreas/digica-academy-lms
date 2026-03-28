import type { ComponentProps } from "react";

export enum IconSize {
  "3xs" = "3xs",
  "2xs" = "2xs",
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  "2xl" = "2xl",
  "3xl" = "3xl",
}

export interface IIconProps extends ComponentProps<"svg"> {
  className?: string;
  size?: IconSize;
}
