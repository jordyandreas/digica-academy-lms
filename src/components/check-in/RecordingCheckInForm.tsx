"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarX, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";
import { SelectController } from "@/components/controllers";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { Label } from "@/components/ui/label";
import {
  emptyRecordingCheckInValues,
  recordingCheckInFormSchema,
  type RecordingCheckInFormValues,
} from "@/features/check-in/recording-check-in-schema";
import type {
  RecordingCheckInAvailableData,
  RecordingCheckInSubmitResult,
} from "@/features/check-in/recording-types";
import { formatCheckInSessionDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import {
  formatCheckInParticipantLabel,
  getDuplicateParticipantNames,
} from "@/utils/check-in-participants";

type RecordingCheckInFormProps = {
  identifier: string;
  data: RecordingCheckInAvailableData;
};

type SuccessCopy = {
  title: string;
  description: ReactNode;
};

function formatSessionNumbers(numbers: number[]): string {
  const labels = [...numbers]
    .sort((left, right) => left - right)
    .map((number) => `Sesi ${number}`);

  if (labels.length <= 1) {
    return labels[0] ?? "";
  }

  if (labels.length === 2) {
    return `${labels[0]} dan ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(", ")}, dan ${labels.at(-1)}`;
}

function buildSuccessCopy(result: RecordingCheckInSubmitResult): SuccessCopy {
  const recorded = formatSessionNumbers(result.recorded_session_numbers);
  const alreadyPresent = formatSessionNumbers(
    result.already_present_session_numbers,
  );

  if (recorded) {
    return {
      title: "Berhasil disimpan!",
      description: (
        <>
          Sip! Sesi recording yang kamu pilih sudah berhasil dicatat.
          <br />
          <br />
          <span className="text-xs font-medium text-brand-muted">
            Sesi yang berhasil dicatat
          </span>
          <br />
          <span className="font-semibold text-brand-deep">{recorded}</span>
          {alreadyPresent ? (
            <>
              <br />
              <br />
              <span className="text-xs leading-relaxed text-brand-muted">
                {alreadyPresent} sudah tercatat hadir live, jadi tidak diubah.
              </span>
            </>
          ) : null}
        </>
      ),
    };
  }

  return {
    title: "Sudah tercatat hadir live",
    description: `${alreadyPresent} sudah tercatat hadir live, jadi tidak diubah menjadi recording.`,
  };
}

function sessionLabel(
  session: RecordingCheckInAvailableData["sessions"][number],
) {
  return `Sesi ${session.session_number} — ${formatCheckInSessionDate(session.session_date)}`;
}

export function RecordingCheckInForm({
  identifier,
  data,
}: RecordingCheckInFormProps) {
  const [successCopy, setSuccessCopy] = useState<SuccessCopy | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RecordingCheckInFormValues>({
    defaultValues: emptyRecordingCheckInValues,
    resolver: zodResolver(recordingCheckInFormSchema),
  });

  const selectedParticipantId = form.watch("participant_id");
  const isSessionSelectEnabled = Boolean(selectedParticipantId);

  const selectableSessions = useMemo(() => {
    if (!selectedParticipantId) {
      return data.sessions;
    }

    const occupied = new Set(
      data.occupied_session_ids_by_participant?.[selectedParticipantId] ?? [],
    );

    return data.sessions.filter((session) => !occupied.has(session.id));
  }, [
    data.occupied_session_ids_by_participant,
    data.sessions,
    selectedParticipantId,
  ]);

  useEffect(() => {
    if (!selectedParticipantId) {
      form.setValue("session_ids", []);
      return;
    }

    form.setValue(
      "session_ids",
      selectableSessions.length === 1 ? [selectableSessions[0]!.id] : [],
    );
  }, [form, selectableSessions, selectedParticipantId]);

  const duplicateNames = useMemo(
    () => getDuplicateParticipantNames(data.participants),
    [data.participants],
  );

  const participantOptions = data.participants.map((participant) => ({
    label: formatCheckInParticipantLabel(participant, duplicateNames),
    value: participant.id,
  }));

  const handleSuccessModalChange = (open: boolean) => {
    setIsSuccessModalOpen(open);
    if (!open) {
      setSuccessCopy(null);
      form.reset(emptyRecordingCheckInValues);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/check-in/${encodeURIComponent(identifier)}/recording`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participant_id: values.participant_id,
            session_ids: values.session_ids,
          }),
        },
      );

      const result = (await response.json()) as Partial<RecordingCheckInSubmitResult> & {
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mencatat laporan recording.");
      }

      setSuccessCopy(
        buildSuccessCopy({
          success: true,
          recorded_session_numbers: result.recorded_session_numbers ?? [],
          already_present_session_numbers:
            result.already_present_session_numbers ?? [],
        }),
      );
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mencatat laporan recording.";
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
          Belum ada peserta yang sudah bayar.
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
          Belum ada sesi yang bisa dilaporkan. Hanya sesi dengan tanggal hari
          ini atau sebelumnya yang muncul.
        </p>
      </div>
    );
  }

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="space-y-5">
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

        <Controller
          control={form.control}
          name="session_ids"
          render={({ field, fieldState }) => {
            const selected = new Set(field.value);
            const allSelected =
              selectableSessions.length > 0 &&
              selectableSessions.every((session) => selected.has(session.id));
            const showEmptyForParticipant =
              isSessionSelectEnabled && selectableSessions.length === 0;

            return (
              <div className="w-full">
                <Label className="text-brand-deep">
                  Sesi yang sudah ditonton
                  <span className="ml-1 text-destructive">*</span>
                </Label>
                {!isSessionSelectEnabled ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pilih nama dulu sebelum pilih sesi.
                  </p>
                ) : showEmptyForParticipant ? null : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Hanya sesi yang belum tercatat yang ditampilkan di sini.
                    Kamu bisa memilih lebih dari satu sesi.
                  </p>
                )}
                {!isSessionSelectEnabled ? null : showEmptyForParticipant ? (
                  <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-brand-periwinkle/50 bg-background/80 px-4 py-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pale text-brand-royal">
                      <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-brand-deep">
                        Tidak Ada Sesi untuk Dilaporkan
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Semua sesi yang tersedia sudah tercatat untuk namamu,
                        baik melalui kehadiran kelas live maupun laporan
                        recording sebelumnya.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <label
                      htmlFor="select-all-sessions"
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-brand-pale/70 px-3.5 py-3 text-brand-deep transition hover:bg-brand-pale"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <input
                          id="select-all-sessions"
                          type="checkbox"
                          className="h-4 w-4 shrink-0 accent-brand-royal"
                          checked={allSelected}
                          onChange={() => {
                            field.onChange(
                              allSelected
                                ? []
                                : selectableSessions.map(
                                    (session) => session.id,
                                  ),
                            );
                          }}
                        />
                        <span className="text-sm font-semibold">
                          Pilih semua sesi
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-brand-lavender/80 px-2.5 py-0.5 text-xs font-medium text-brand-deep">
                        {selectableSessions.length} sesi
                      </span>
                    </label>
                    {selectableSessions.map((session) => {
                      const checked = selected.has(session.id);
                      const inputId = `session-${session.id}`;

                      return (
                        <label
                          key={session.id}
                          htmlFor={inputId}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm",
                            checked
                              ? "border-brand-royal/40 bg-brand-pale/40 text-brand-deep"
                              : "border-brand-periwinkle/50 bg-background/80",
                          )}
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-royal"
                            checked={checked}
                            onChange={() => {
                              field.onChange(
                                checked
                                  ? field.value.filter(
                                      (id) => id !== session.id,
                                    )
                                  : [...field.value, session.id],
                              );
                            }}
                          />
                          <span>{sessionLabel(session)}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {fieldState.error?.message ? (
                  <p className="mt-2 text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            );
          }}
        />

        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          loading={form.formState.isSubmitting}
          disabled={
            isSessionSelectEnabled && selectableSessions.length === 0
          }
        >
          Simpan
        </Button>
      </form>

      <FeedbackDialog
        open={isSuccessModalOpen}
        onOpenChange={handleSuccessModalChange}
        variant="success"
        title={successCopy?.title ?? "Berhasil disimpan!"}
        description={
          successCopy?.description ??
          "Sip! Sesi recording yang kamu pilih sudah berhasil dicatat."
        }
        confirmLabel="Selesai"
      />
    </>
  );
}
