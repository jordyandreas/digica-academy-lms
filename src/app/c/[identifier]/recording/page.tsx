import { RecordingCheckInPageView } from "@/components/check-in/RecordingCheckInPageView";

type RecordingCheckInPageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({ params }: RecordingCheckInPageProps) {
  const { identifier } = await params;
  return {
    title: "Check-in recording",
    description: `Check-in sudah menonton recording ${identifier}`,
  };
}

export default async function RecordingCheckInPage({
  params,
}: RecordingCheckInPageProps) {
  const { identifier } = await params;
  return <RecordingCheckInPageView identifier={identifier} />;
}
