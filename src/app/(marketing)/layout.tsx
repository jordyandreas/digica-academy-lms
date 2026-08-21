import { SiteFooter } from "@/components/layout/SiteFooter";

/**
 * Shared chrome for public marketing list/detail pages
 * (programs, testimonials, articles). URLs unchanged via route group.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-primary/5 to-white">
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
