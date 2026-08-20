import { redirect } from "next/navigation";
import { ARTICLES_ENABLED } from "@/constants/features";

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
