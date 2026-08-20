import { permanentRedirect } from "next/navigation";

type CheckInAliasPageProps = {
  params: Promise<{ programId: string }>;
};

export default async function CheckInAliasPage({
  params,
}: CheckInAliasPageProps) {
  const { programId } = await params;
  permanentRedirect(`/c/${encodeURIComponent(programId.trim())}`);
}
