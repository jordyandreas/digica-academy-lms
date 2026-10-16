"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { DigicaLogo } from "@/components/brand/DigicaLogo";
import { RecordingCheckInPageSkeleton } from "@/components/check-in/CheckInPageSkeleton";
import { RecordingCheckInForm } from "@/components/check-in/RecordingCheckInForm";
import { Button } from "@/components/ui/button";
import {
  RECORDING_CHECK_IN_UNAVAILABLE_MESSAGE,
  type RecordingCheckInResponse,
} from "@/features/check-in/recording-types";
import { buildCheckInLinkHelpWhatsAppUrl } from "@/utils/admin-whatsapp";

function RecordingCheckInAdminHelp({
  whatsappUrl,
}: {
  whatsappUrl: string | null;
}) {
  return (
    <div className="space-y-3 border-t border-brand-periwinkle/40 pt-4 text-center">
      <p className="text-xs text-muted-foreground">
        Jika Anda yakin ini kesalahan, minta link yang benar ke admin Digica.
      </p>
      {whatsappUrl ? (
        <Button asChild variant="outline" className="h-10 w-full gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Chat Admin WhatsApp
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function RecordingCheckInPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-premium flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-brand-periwinkle/70 bg-card p-6 shadow-sm">
        <div className="flex justify-center">
          <DigicaLogo href={null} showEst priority />
        </div>
        {children}
      </div>
    </div>
  );
}

type RecordingCheckInPageViewProps = {
  identifier: string;
};

export function RecordingCheckInPageView({
  identifier,
}: RecordingCheckInPageViewProps) {
  const [data, setData] = useState<RecordingCheckInResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!identifier) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `/api/check-in/${encodeURIComponent(identifier)}/recording`,
        );
        const result = (await response.json()) as RecordingCheckInResponse & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat halaman recording.");
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat halaman recording.";
          setErrorMessage(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identifier]);

  const adminHelpWhatsAppUrl = buildCheckInLinkHelpWhatsAppUrl({
    programName: data?.program.name,
  });
  const showEmptyHelp =
    data?.available === true &&
    (data.participants.length === 0 || data.sessions.length === 0);

  return (
    <RecordingCheckInPageShell>
      {isLoading ? (
        <RecordingCheckInPageSkeleton />
      ) : errorMessage ? (
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold text-brand-deep">
            Laporan recording tidak tersedia
          </h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <RecordingCheckInAdminHelp whatsappUrl={adminHelpWhatsAppUrl} />
        </div>
      ) : data && !data.available ? (
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold text-brand-deep">
            {data.program.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {RECORDING_CHECK_IN_UNAVAILABLE_MESSAGE}
          </p>
        </div>
      ) : data?.available ? (
        <div className="flex flex-col gap-4">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold text-brand-deep">
              {data.program.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Laporkan sesi recording yang sudah kamu tonton. Form ini khusus
              untuk pelaporan recording, bukan absensi kelas live.
            </p>
          </div>
          <RecordingCheckInForm identifier={identifier} data={data} />
          {showEmptyHelp ? (
            <RecordingCheckInAdminHelp whatsappUrl={adminHelpWhatsAppUrl} />
          ) : null}
        </div>
      ) : null}
    </RecordingCheckInPageShell>
  );
}
