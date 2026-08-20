"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarX, CheckCircle2, Copy, Users } from "lucide-react";
import { toast } from "sonner";
import {
  RadioCardGroupController,
  SelectController,
} from "@/components/controllers";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SECURE_SEAT_INTEREST_OPTIONS,
  isSecureSeatInterest,
  type SecureSeatInterest,
} from "@/constants/secure-seat-interest";
import {
  checkInFormSchema,
  emptyCheckInValues,
  type CheckInFormValues,
} from "@/features/check-in/check-in-schema";
import type { CheckInPublicData } from "@/features/check-in/types";
import { formatCheckInSessionDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import {
  formatCheckInParticipantLabel,
  getDuplicateParticipantNames,
} from "@/utils/check-in-participants";
import { appendRegistrationSource } from "@/utils/registration-source-url";

const PROMO_NUDGE_DELAY_MS = 5_000;

const adminOutlineButtonClass =
  "border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground";

type CheckInFormProps = {
  identifier: string;
  data: CheckInPublicData;
};

export function CheckInForm({ identifier, data }: CheckInFormProps) {
  const [successSessionNumber, setSuccessSessionNumber] = useState<
    number | null
  >(null);
  const [successSecureSeatInterest, setSuccessSecureSeatInterest] =
    useState<SecureSeatInterest | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isBannerPreviewOpen, setIsBannerPreviewOpen] = useState(false);
  const [isDeferConfirmOpen, setIsDeferConfirmOpen] = useState(false);
  const [showPromoNudge, setShowPromoNudge] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isWorkshop = data.program.type === "workshop";
  const promoBannerSrc = data.program.promo_banner_url?.trim() || null;
  const promoBannerAlt = `Promo secure seat — ${data.program.name}`;
  const hasPromoBanner = Boolean(promoBannerSrc);

  const form = useForm<CheckInFormValues>({
    defaultValues: emptyCheckInValues,
    resolver: (values, context, options) =>
      zodResolver(checkInFormSchema(isWorkshop))(values, context, options),
  });

  const selectedParticipantId = form.watch("participant_id");
  const selectedSecureSeatInterest = form.watch("secure_seat_interest");
  const isSessionSelectEnabled = Boolean(selectedParticipantId);

  useEffect(() => {
    if (!selectedParticipantId) {
      form.setValue("session_id", "");
      return;
    }

    if (data.sessions.length === 1) {
      form.setValue("session_id", data.sessions[0]!.id);
    }
  }, [data.sessions, form, selectedParticipantId]);

  const bootcampRegistrationUrl = useMemo(() => {
    const raw = data.program.bootcamp_registration_link?.trim() ?? "";
    if (!raw) {
      return "";
    }
    return appendRegistrationSource(raw, "workshop_promo");
  }, [data.program.bootcamp_registration_link]);

  const showSecureSeatCta =
    isWorkshop &&
    successSecureSeatInterest === "yes" &&
    Boolean(bootcampRegistrationUrl);
  const showUndecidedConvertCta =
    isWorkshop &&
    successSecureSeatInterest === "undecided" &&
    Boolean(bootcampRegistrationUrl);

  useEffect(() => {
    if (!isSuccessModalOpen || !showSecureSeatCta) {
      setShowPromoNudge(false);
      return;
    }

    setShowPromoNudge(false);
    const timeoutId = window.setTimeout(() => {
      setShowPromoNudge(true);
    }, PROMO_NUDGE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccessModalOpen, showSecureSeatCta]);

  const duplicateNames = useMemo(
    () => getDuplicateParticipantNames(data.participants),
    [data.participants],
  );

  const participantOptions = data.participants.map((participant) => ({
    label: formatCheckInParticipantLabel(participant, duplicateNames),
    value: participant.id,
  }));

  const sessionOptions = data.sessions.map((session) => ({
    label: session.session_date
      ? `Sesi ${session.session_number} — ${formatCheckInSessionDate(session.session_date)}`
      : `Sesi ${session.session_number} — Tanggal belum diatur`,
    value: session.id,
  }));

  const resetSuccessState = () => {
    setSuccessSessionNumber(null);
    setSuccessSecureSeatInterest(null);
    setShowPromoNudge(false);
    setIsDeferConfirmOpen(false);
    form.reset(emptyCheckInValues);
  };

  const handleSuccessModalChange = (open: boolean) => {
    setIsSuccessModalOpen(open);
    if (!open) {
      resetSuccessState();
    }
  };

  const handleDeferClick = () => {
    setIsDeferConfirmOpen(true);
  };

  const handleConfirmDefer = () => {
    setIsDeferConfirmOpen(false);
    handleSuccessModalChange(false);
  };

  const handleConfirmRegisterNow = () => {
    setShowPromoNudge(false);
    setIsDeferConfirmOpen(false);
    if (bootcampRegistrationUrl) {
      window.open(bootcampRegistrationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyRegistrationLink = async () => {
    if (!bootcampRegistrationUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(bootcampRegistrationUrl);
      toast.success("Link berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/check-in/${encodeURIComponent(identifier)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participant_id: values.participant_id,
            session_id: values.session_id,
            ...(isWorkshop && values.secure_seat_interest
              ? { secure_seat_interest: values.secure_seat_interest }
              : {}),
          }),
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        session_number?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to check in");
      }

      setSuccessSessionNumber(result.session_number ?? null);
      setSuccessSecureSeatInterest(
        isSecureSeatInterest(values.secure_seat_interest)
          ? values.secure_seat_interest
          : null,
      );
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to check in";
      setErrorMessage(message);
      toast.error(message);
    }
  });

  if (data.participants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pale text-brand-royal">
          <Users className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Belum ada peserta terdaftar.
        </p>
      </div>
    );
  }

  if (data.sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pale text-brand-royal">
          <CalendarX className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Tidak ada kelas untuk absensi hari ini. Hubungi admin jika ini
          sepertinya salah.
        </p>
      </div>
    );
  }

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        {isWorkshop ? (
          <div className="space-y-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/10 p-4 shadow-[0_8px_24px_rgba(98,10,121,0.05)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-deep">
                Langkah 1: Absensi
              </p>
              <p className="text-xs text-muted-foreground">
                Pilih nama dan sesi hari ini untuk catat kehadiranmu.
              </p>
            </div>

            <SelectController
              form={form}
              name="participant_id"
              label="Nama kamu"
              required
              placeholder="Pilih namamu"
              searchable
              searchPlaceholder="Cari nama..."
              options={participantOptions}
              componentProps={{
                selectTrigger: { className: "mt-2", id: "participant_id" },
              }}
            />

            <SelectController
              form={form}
              name="session_id"
              label="Sesi"
              required
              placeholder={
                isSessionSelectEnabled ? "Pilih sesi" : "Pilih nama dulu"
              }
              description={
                isSessionSelectEnabled
                  ? undefined
                  : "Pilih nama dulu sebelum pilih sesi."
              }
              disabled={!isSessionSelectEnabled}
              options={sessionOptions}
              componentProps={{
                selectTrigger: {
                  className: "mt-2",
                  id: "session_id",
                },
              }}
            />
          </div>
        ) : (
          <>
            <SelectController
              form={form}
              name="participant_id"
              label="Nama kamu"
              required
              placeholder="Pilih namamu"
              searchable
              searchPlaceholder="Cari nama..."
              options={participantOptions}
              componentProps={{
                selectTrigger: { className: "mt-2", id: "participant_id" },
              }}
            />

            <SelectController
              form={form}
              name="session_id"
              label="Sesi"
              required
              placeholder={
                isSessionSelectEnabled ? "Pilih sesi" : "Pilih nama dulu"
              }
              description={
                isSessionSelectEnabled
                  ? undefined
                  : "Pilih nama dulu sebelum pilih sesi."
              }
              disabled={!isSessionSelectEnabled}
              options={sessionOptions}
              componentProps={{
                selectTrigger: {
                  className: "mt-2",
                  id: "session_id",
                },
              }}
            />
          </>
        )}

        {isWorkshop ? (
          <div className="space-y-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/10 p-4 shadow-[0_8px_24px_rgba(98,10,121,0.05)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-deep">
                Langkah 2: Minat promo bootcamp (opsional)
              </p>
              <p className="text-sm leading-snug text-brand-deep/90">
                Mau lanjut daftar bootcamp dengan harga spesial workshop? Promo
                terbatas — lanjut daftar di langkah berikutnya.
              </p>
            </div>

            {hasPromoBanner && promoBannerSrc ? (
              <button
                type="button"
                onClick={() => setIsBannerPreviewOpen(true)}
                className="block w-full overflow-hidden rounded-lg border border-brand-periwinkle/50 text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2"
                aria-label="Preview promo banner"
              >
                {promoBannerSrc.startsWith("http") ? (
                  <Image
                    src={promoBannerSrc}
                    alt={promoBannerAlt}
                    width={800}
                    height={450}
                    className="h-auto w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={promoBannerSrc}
                    alt={promoBannerAlt}
                    width={800}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                )}
              </button>
            ) : null}

            <RadioCardGroupController
              form={form}
              name="secure_seat_interest"
              required
              ariaLabel="Secure seat interest"
              options={SECURE_SEAT_INTEREST_OPTIONS}
            />

            {selectedSecureSeatInterest === "yes" ||
            selectedSecureSeatInterest === "undecided" ? (
              <div className="rounded-lg border border-brand-periwinkle/35 bg-background/85 px-3 py-2 text-sm leading-snug text-brand-deep">
                <p className="font-semibold">
                  Absensi ini cuma buat catat kehadiran ya ✍️
                </p>
                <p className="mt-1 text-brand-royal">
                  Mau dapat promo? Lanjut daftar di halaman bootcamp dulu!
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          loading={form.formState.isSubmitting}
        >
          Kirim Absensi
        </Button>
      </form>

      {hasPromoBanner && promoBannerSrc ? (
        <Dialog
          open={isBannerPreviewOpen}
          onOpenChange={setIsBannerPreviewOpen}
        >
          <DialogContent
            showCloseButton
            className="w-[calc(100%-1.5rem)] border-brand-periwinkle/70 bg-card p-3 sm:max-w-md"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>{promoBannerAlt}</DialogTitle>
              <DialogDescription>Preview promo banner</DialogDescription>
            </DialogHeader>
            {promoBannerSrc.startsWith("http") ? (
              <Image
                src={promoBannerSrc}
                alt={promoBannerAlt}
                width={800}
                height={450}
                className="mx-auto h-auto max-h-[60dvh] w-full rounded-md object-contain"
                unoptimized
                priority
              />
            ) : (
              <Image
                src={promoBannerSrc}
                alt={promoBannerAlt}
                width={800}
                height={450}
                className="mx-auto h-auto max-h-[60dvh] w-full rounded-md object-contain"
                priority
              />
            )}
          </DialogContent>
        </Dialog>
      ) : null}

      {isWorkshop ? (
      <Dialog open={isSuccessModalOpen} onOpenChange={handleSuccessModalChange}>
        <DialogContent
          showCloseButton
          className="flex max-h-[85dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-brand-periwinkle/70 bg-card p-0 shadow-lg sm:max-w-lg"
        >
              <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-6 pb-4 pt-6">
                <DialogHeader className="w-full min-w-0 space-y-3 text-left sm:text-left">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-brand-pale text-brand-royal ring-4 ring-brand-pale/50">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <DialogTitle className="text-center text-brand-deep">
                      Terima kasih
                    </DialogTitle>
                  </div>
                  <DialogDescription asChild>
                    <div className="w-full min-w-0 space-y-3 break-words text-left text-sm leading-relaxed text-muted-foreground">
                      {showSecureSeatCta ? (
                        <div className="w-full min-w-0 space-y-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/10 p-4 shadow-[0_8px_24px_rgba(98,10,121,0.05)]">
                          <div className="space-y-2">
                            <p>
                              Absensimu untuk{" "}
                              <strong className="font-semibold text-foreground">
                                {data.program.name}
                              </strong>{" "}
                              sudah tercatat ya!
                            </p>
                            <p className="rounded-lg border border-brand-periwinkle/35 bg-background/85 px-3 py-2 text-sm font-semibold leading-snug text-brand-deep">
                              Harga spesialnya belum didapatkan — lanjut daftar
                              bootcamp dulu ya!
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn("h-10 w-full", adminOutlineButtonClass)}
                            onClick={() => void handleCopyRegistrationLink()}
                          >
                            <Copy className="h-4 w-4" />
                            Klik untuk salin link pendaftaran
                          </Button>
                          {showPromoNudge ? (
                            <p
                              className="animate-nudge-shake rounded-lg border border-brand-periwinkle/35 bg-background/85 px-3 py-2 text-sm font-semibold leading-snug text-brand-deep"
                              role="status"
                            >
                              Yuk daftar bootcampnya dulu biar kamu dapat
                              promo-nya. Slotnya terbatas, buruan ya! 😊
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <div className="w-full min-w-0 space-y-3">
                          <p>
                            Absensimu untuk{" "}
                            <strong className="font-semibold text-foreground">
                              {data.program.name}
                            </strong>{" "}
                            sudah tercatat ya! 🙌
                          </p>
                          {showUndecidedConvertCta ? (
                            <div className="w-full min-w-0 space-y-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/10 p-4 shadow-[0_8px_24px_rgba(98,10,121,0.05)]">
                              <p className="rounded-lg border border-brand-periwinkle/35 bg-background/85 px-3 py-2 text-sm font-semibold leading-snug text-brand-deep">
                                Absensi workshop bukan pendaftaran bootcamp —
                                promo belum terkunci dari check-in ini.
                              </p>
                              <p className="text-sm leading-snug text-brand-deep">
                                Masih mikir-mikir? Jangan sampai kelewatan harga
                                spesial workshop — slotnya terbatas lho.
                              </p>
                              <Button
                                type="button"
                                className="h-11 w-full"
                                asChild
                              >
                                <a
                                  href={bootcampRegistrationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Jangan Lewatkan — Daftar Bootcamp
                                </a>
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      )}
                      <p>
                        ✅{" "}
                        <strong className="font-semibold text-foreground">
                          E-Sertifikat
                        </strong>{" "}
                        akan dikirim melalui{" "}
                        <strong className="font-semibold text-foreground">
                          Grup WA
                        </strong>
                        , silahkan tunggu dalam{" "}
                        <strong className="font-semibold text-foreground">
                          waktu 5-7 hari kerja
                        </strong>
                        .
                      </p>
                      <div className="space-y-1">
                        <p>
                          📱 Tetap terhubung dan dapatkan insight menarik
                          seputar Data &amp; Tech:
                        </p>
                        <p>
                          🔹 Follow kami di Instagram, TikTok dan Threads:
                          <br />
                          👉 @digica.academy
                        </p>
                      </div>
                      {showSecureSeatCta || showUndecidedConvertCta ? (
                        <p>
                          Sampai jumpa di program Digica Academy berikutnya 🚀
                        </p>
                      ) : (
                        <p>
                          🎓 Siap belajar lebih dalam? Nantikan info tentang
                          bootcamp dan kelas lainnya!
                          <br />
                          Sampai jumpa di program Digica Academy berikutnya 🚀
                        </p>
                      )}
                      <p className="font-medium text-foreground">
                        #MakeITHappen
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
              <DialogFooter
                className={cn(
                  "shrink-0 border-t px-6 py-4",
                  showSecureSeatCta
                    ? "flex-col gap-0 sm:flex-col sm:space-x-0"
                    : "sm:justify-center",
                )}
              >
                {showSecureSeatCta ? (
                  <div className="grid w-full grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("h-11 w-full", adminOutlineButtonClass)}
                      onClick={handleDeferClick}
                    >
                      Nanti Dulu
                    </Button>
                    <Button
                      type="button"
                      className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <a
                        href={bootcampRegistrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowPromoNudge(false)}
                      >
                        Daftar Bootcamp
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    className="h-11 w-full"
                    onClick={() => handleSuccessModalChange(false)}
                  >
                    Selesai
                  </Button>
                )}
              </DialogFooter>
        </DialogContent>
      </Dialog>
      ) : (
        <FeedbackDialog
          open={isSuccessModalOpen}
          onOpenChange={handleSuccessModalChange}
          variant="success"
          title="Absensi berhasil"
          description={
            successSessionNumber != null
              ? `Kehadiran tercatat untuk Sesi ${successSessionNumber}.`
              : "Kehadiranmu sudah tercatat."
          }
          confirmLabel="Selesai"
        />
      )}

      <FeedbackDialog
        open={isDeferConfirmOpen}
        onOpenChange={setIsDeferConfirmOpen}
        variant="confirm"
        title="Yakin ditunda dulu?"
        description={
          <>
            Slot promo workshop terbatas lho. Kalau ditunda sekarang, bisa saja
            keburu penuh sebelum sempat daftar.
            <br />
            <br />
            Mau amankan harga spesialnya sekarang aja?
          </>
        }
        descriptionClassName="max-w-none"
        cancelLabel="Ya, Nanti Saja"
        confirmLabel="Daftar Sekarang"
        onConfirm={handleConfirmRegisterNow}
        onCancel={handleConfirmDefer}
      />
    </>
  );
}
