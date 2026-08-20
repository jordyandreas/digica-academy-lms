import { permanentRedirect } from "next/navigation";

interface ProgramRedirectPageProps {
  params: Promise<{ programId: string }>;
}

export default async function ProgramRedirectPage({
  params,
}: ProgramRedirectPageProps) {
  const { programId } = await params;
  permanentRedirect(`/r/${encodeURIComponent(programId.trim())}`);
}
