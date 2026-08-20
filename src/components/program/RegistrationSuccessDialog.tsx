"use client";

import { useState } from "react";
import { Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SuccessStepCardProps = {
  title: string;
  description: string;
  badge: "Required" | "Optional" | "Wajib" | "Opsional";
  emphasized?: boolean;
  children: React.ReactNode;
};

function SuccessStepCard({
  title,
  description,
  badge,
  emphasized = false,
  children,
}: SuccessStepCardProps) {
  const isRequired = badge === "Required" || badge === "Wajib";

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        emphasized
          ? "border-brand-periwinkle/40 bg-brand-pale/20 ring-1 ring-brand-royal/10"
          : "border-brand-periwinkle/35 bg-brand-pale/15",
      )}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-brand-deep">{title}</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            isRequired
              ? "bg-brand-royal/15 text-brand-royal"
              : "bg-muted text-muted-foreground",
          )}
        >
          {badge}
        </span>
      </div>
      <p
        className={cn(
          "mb-4 text-xs leading-relaxed",
          emphasized ? "text-brand-deep/80" : "text-muted-foreground",
        )}
      >
        {description}
      </p>
      {children}
    </div>
  );
}

type RegistrationSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBootcamp: boolean;
  isWorkshopPromo: boolean;
  hasWaGroupLink: boolean;
  waGroupUrl: string;
  inviteUrl: string;
  paymentWhatsAppUrl: string | null;
};

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function RegistrationSuccessDialog({
  open,
  onOpenChange,
  isBootcamp,
  isWorkshopPromo,
  hasWaGroupLink,
  waGroupUrl,
  inviteUrl,
  paymentWhatsAppUrl,
}: RegistrationSuccessDialogProps) {
  const [copied, setCopied] = useState<"invite" | "wa" | null>(null);

  const markCopied = (key: "invite" | "wa") => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const handleCopyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await copyText(inviteUrl);
      markCopied("invite");
    } catch {
      /* ignore */
    }
  };

  const handleCopyWa = async () => {
    if (!waGroupUrl) return;
    try {
      await copyText(waGroupUrl);
      markCopied("wa");
    } catch {
      /* ignore */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-brand-periwinkle/70 p-0 sm:max-w-md">
        {isWorkshopPromo ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6">
              <DialogHeader className="items-center space-y-3 text-center sm:text-center">
                <DialogTitle className="text-xl text-brand-deep">
                  Promo seat kamu sudah terdaftar!
                </DialogTitle>
                <span className="rounded-full bg-brand-royal/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-royal">
                  Harga spesial workshop
                </span>
                <DialogDescription className="text-center text-sm leading-relaxed">
                  Harga spesial workshop-mu sudah aktif. Chat admin sekarang
                  untuk minta{" "}
                  <strong className="font-semibold text-foreground">
                    detail pembayaran
                  </strong>{" "}
                  dan kunci seat promo sebelum kuota habis.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <SuccessStepCard
                  title="Kunci harga promo lewat admin"
                  description="Kirim pesan untuk minta detail transfer. Kalau masih ragu, boleh tanya dulu — admin siap bantu."
                  badge="Wajib"
                  emphasized
                >
                  {paymentWhatsAppUrl ? (
              <Button asChild className="h-11 w-full gap-2">
                      <a
                        href={paymentWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat Admin WhatsApp
                      </a>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Hubungi admin Digica lewat WhatsApp untuk detail
                      pembayaran.
                    </p>
                  )}
                </SuccessStepCard>

                {hasWaGroupLink ? (
                  <SuccessStepCard
                    title="Gabung Grup WhatsApp"
                    description="E-sertifikat akan dibagikan di grup setelah program. Gabung sekarang untuk dapat jadwal kelas dan materi."
                    badge="Wajib"
                  >
                    <div className="space-y-3">
                      <Button asChild className="h-11 w-full">
                        <a
                          href={waGroupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Gabung Grup WhatsApp
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full gap-2"
                        onClick={() => void handleCopyWa()}
                      >
                        <Copy className="h-4 w-4" />
                        {copied === "wa" ? "Tersalin" : "Salin Link WhatsApp"}
                      </Button>
                    </div>
                  </SuccessStepCard>
                ) : null}

                <SuccessStepCard
                  title="Ajak teman pakai harga spesial"
                  description="Bagikan link ini ke teman workshop. Mereka juga dapat harga promo yang sama."
                  badge="Opsional"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-2"
                    onClick={() => void handleCopyInvite()}
                    disabled={!inviteUrl}
                  >
                    <Copy className="h-4 w-4" />
                    {copied === "invite" ? "Tersalin" : "Salin Link Undangan"}
                  </Button>
                </SuccessStepCard>
              </div>
            </div>
            <DialogFooter className="shrink-0 border-t border-brand-periwinkle/30 px-6 py-4 sm:justify-center">
              <Button
                type="button"
                className="h-11 w-full"
                onClick={() => onOpenChange(false)}
              >
                Selesai
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6">
              <DialogHeader className="items-center space-y-3 text-center sm:text-center">
                <DialogTitle className="text-xl text-brand-deep">
                  You&apos;re registered 🎉
                </DialogTitle>
                <DialogDescription className="text-center text-sm leading-relaxed">
                  {isBootcamp ? (
                    <>
                      Registrasi kamu sudah masuk. Chat admin sekarang untuk
                      minta{" "}
                      <strong className="font-semibold text-foreground">
                        detail pembayaran
                      </strong>{" "}
                      dan amankan seat promo-mu.
                    </>
                  ) : hasWaGroupLink ? (
                    "Your seat is confirmed. Join our WhatsApp group to receive your e-certificate, schedules, and materials."
                  ) : (
                    "Your seat is confirmed. Share the invitation link with friends, and we'll invite you to the WhatsApp group 3 days before the program starts."
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {isBootcamp ? (
                  <SuccessStepCard
                    title="Chat admin untuk pembayaran"
                    description="Kirim pesan untuk minta detail transfer. Kamu juga bisa tanya dulu kalau masih mempertimbangkan."
                    badge="Required"
                    emphasized
                  >
                    {paymentWhatsAppUrl ? (
                      <Button asChild className="h-11 w-full gap-2">
                        <a
                          href={paymentWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat Admin WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Hubungi admin Digica lewat WhatsApp untuk detail
                        pembayaran.
                      </p>
                    )}
                  </SuccessStepCard>
                ) : null}

                {hasWaGroupLink ? (
                  <SuccessStepCard
                    title="Join WhatsApp Group"
                    description="Your e-certificate will be shared in this group after the program. Join now to receive it, along with class schedules and materials."
                    badge="Required"
                    emphasized={!isBootcamp}
                  >
                    <div className="space-y-3">
                      <Button asChild className="h-11 w-full">
                        <a
                          href={waGroupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join WhatsApp Group
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full gap-2"
                        onClick={() => void handleCopyWa()}
                      >
                        <Copy className="h-4 w-4" />
                        {copied === "wa" ? "Copied" : "Copy WhatsApp Link"}
                      </Button>
                    </div>
                  </SuccessStepCard>
                ) : null}

                <SuccessStepCard
                  title="Invite your friends"
                  description={
                    isBootcamp
                      ? "Bagikan link ini ke teman. Mereka daftar dengan harga yang sama."
                      : "Learning is better together."
                  }
                  badge="Optional"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-2"
                    onClick={() => void handleCopyInvite()}
                    disabled={!inviteUrl}
                  >
                    <Copy className="h-4 w-4" />
                    {copied === "invite" ? "Copied" : "Copy Invitation Link"}
                  </Button>
                </SuccessStepCard>
              </div>
            </div>
            <DialogFooter className="shrink-0 border-t border-brand-periwinkle/30 px-6 py-4 sm:justify-center">
              <Button
                type="button"
                className="h-11 w-full"
                onClick={() => onOpenChange(false)}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
