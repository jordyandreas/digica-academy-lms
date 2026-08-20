"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps, type MouseEvent } from "react";

type HashLinkProps = ComponentProps<typeof Link>;

function hrefToString(href: HashLinkProps["href"]): string | null {
  if (typeof href === "string") return href;
  if (typeof href === "object" && href !== null && "pathname" in href) {
    const path = href.pathname ?? "";
    const hash = "hash" in href && typeof href.hash === "string" ? href.hash : "";
    return `${path}${hash}`;
  }
  return null;
}

function getHash(href: string): string | null {
  const index = href.indexOf("#");
  if (index === -1) return null;
  const hash = href.slice(index);
  return hash.length > 1 ? hash : null;
}

function isSamePath(href: string): boolean {
  if (href.startsWith("#")) return true;
  try {
    const url = new URL(href, window.location.origin);
    return (
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname
    );
  } catch {
    return false;
  }
}

function scrollToHashTarget(hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/**
 * Same-page hash links do not re-scroll once the URL already includes that hash.
 * Always jump to the section (and to top for `/` on the homepage).
 */
export const HashLink = forwardRef<HTMLAnchorElement, HashLinkProps>(
  function HashLink({ href, onClick, ...props }, ref) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const hrefString = hrefToString(href);
      if (!hrefString || !isSamePath(hrefString)) return;

      const hash = getHash(hrefString);
      if (hash) {
        if (!scrollToHashTarget(hash)) return;
        event.preventDefault();
        const next = `${window.location.pathname}${window.location.search}${hash}`;
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
          window.history.pushState(null, "", next);
        }
        return;
      }

      if (hrefString === "/" || hrefString === "") {
        event.preventDefault();
        if (window.location.hash) {
          window.history.pushState(null, "", window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
  }
);
