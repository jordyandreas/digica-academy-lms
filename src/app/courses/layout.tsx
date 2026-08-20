import { redirect } from "next/navigation";
import { Lexend } from "next/font/google";
import { COURSES_ENABLED } from "@/constants/features";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!COURSES_ENABLED) {
    redirect("/");
  }

  return <div className={`${lexend.variable} contents`}>{children}</div>;
}
