import { CheckInPageView } from "@/components/check-in/CheckInPageView";

type CheckInShortPageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({ params }: CheckInShortPageProps) {
  const { identifier } = await params;
  return {
    title: "Check in",
    description: `Attendance check-in ${identifier}`,
  };
}

export default async function CheckInShortPage({
  params,
}: CheckInShortPageProps) {
  const { identifier } = await params;
  return <CheckInPageView identifier={identifier} />;
}
