import { cn } from "@/lib/utils";

type CompanyLockupProps = {
  company: string;
  logo: string;
  className?: string;
  logoClassName?: string;
};

export function CompanyLockup({
  company,
  logo,
  className,
  logoClassName,
}: CompanyLockupProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 align-middle", className)}>
      {/* SVG marks from /public — next/image does not optimize local SVG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        width={20}
        height={20}
        className={cn("h-5 w-5 shrink-0 object-contain", logoClassName)}
        aria-hidden
      />
      <span>{company}</span>
    </span>
  );
}
