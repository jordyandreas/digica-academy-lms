import type { Metadata } from "next";
import {
  buildProgramRegistrationMetadata,
  ProgramRegistrationPage,
} from "@/components/program/ProgramRegistrationPage";

type RegistrationShortPageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({
  params,
}: RegistrationShortPageProps): Promise<Metadata> {
  const { identifier } = await params;
  return buildProgramRegistrationMetadata(identifier);
}

export default async function RegistrationShortPage({
  params,
}: RegistrationShortPageProps) {
  const { identifier } = await params;
  return <ProgramRegistrationPage identifier={identifier} />;
}
