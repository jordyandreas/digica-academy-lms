import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DIGICA_LOGO_PATH = "/logo/logo-digica.webp";

type DigicaLogoProps = {
  href?: string | null;
  className?: string;
  imageClassName?: string;
  showEst?: boolean;
  priority?: boolean;
};

export function DigicaLogo({
  href = "/",
  className,
  imageClassName = "h-9 w-auto",
  showEst = false,
  priority = false,
}: DigicaLogoProps) {
  const image = (
    <Image
      src={DIGICA_LOGO_PATH}
      alt="Digica Academy"
      width={160}
      height={40}
      className={imageClassName}
      priority={priority}
    />
  );

  return (
    <div className={cn("flex flex-col items-center gap-0.5", className)}>
      {href ? (
        <Link href={href} className="inline-flex">
          {image}
        </Link>
      ) : (
        image
      )}
      {showEst ? (
        <p className="text-[11px] text-muted-foreground">Est. 2020</p>
      ) : null}
    </div>
  );
}
