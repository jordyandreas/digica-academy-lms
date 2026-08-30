import { redirect } from "next/navigation";
import { ARTICLES_ENABLED } from "@/constants/features";

export const revalidate = 60;

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!ARTICLES_ENABLED) {
    redirect("/");
  }

  return children;
}
