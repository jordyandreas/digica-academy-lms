"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, ShieldCheck } from "lucide-react";
import {
  PhoneInputController,
  RadioCardGroupController,
  SelectController,
  TextInputController,
} from "@/components/controllers";
import { RegistrationSuccessDialog } from "@/components/program/RegistrationSuccessDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getStudentProfile } from "@/features/profile/getStudentProfile";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { toE164PhoneForInput } from "@/utils/phone";
import { buildPaymentWhatsAppUrl } from "@/utils/admin-whatsapp";
import {
  getPromoInitialSlots,
  getPromoMinSlots,
  getPromoSlotNumberClass,
  PROMO_SLOT_TICK_MS,
  type PromoSlotProgramType,
} from "@/utils/promo-slot-countdown";
import { appendRegistrationSource } from "@/utils/registration-source-url";
import { getOrganizationCopy } from "@/constants/organization-copy";
import {
  emptyProgramOfferPrices,
  getOffersForSource,
  resolveRegistrationSource,
  type ProgramOfferPrices,
  type RegistrationPackage,
  type RegistrationSource,
} from "@/constants/registration-offers";
import {
  emptyProgramRegistrationValues,
  programRegistrationFormSchema,
  registrationOccupationOptions,
  type ProgramRegistrationFormValues,
} from "@/schemas/participant-registration-schema";
import type { ProgramType } from "@/features/programs/types";
import { cn } from "@/lib/utils";

type RegistrationProgramPayload = {
  name?: string | null;
  price?: number | null;
  promo_individual_price?: number | null;
  promo_bareng_teman_price?: number | null;
  wa_group_link?: string | null;
  registration_link?: string | null;
};

type ProgramRegistrationFormProps = {
  programId: string;
  programType: ProgramType;
  programTitle: string;
  embedded?: boolean;
};

const defaultValues = emptyProgramRegistrationValues;

function isPaidType(type: ProgramType) {
  return type === "bootcamp" || type === "mini_bootcamp";
}

function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function ProgramRegistrationFormInner({
  programId,
  programType,
  programTitle,
  embedded = false,
}: ProgramRegistrationFormProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const registrationSource: RegistrationSource = resolveRegistrationSource(
    searchParams.get("source"),
  );

  const { isLoggedIn, userId, email: authEmail, displayName } = useAuth();
  const paid = isPaidType(programType);
  const isWorkshopPromo = paid && registrationSource === "workshop_promo";
  const form = useForm<ProgramRegistrationFormValues>({
    defaultValues,
    resolver: (values, context, options) =>
      zodResolver(programRegistrationFormSchema(paid, registrationSource))(
        values,
        context,
        options,
      ),
  });

  const [offerPrices, setOfferPrices] = useState<ProgramOfferPrices>(
    emptyProgramOfferPrices(),
  );
  const [waGroupLink, setWaGroupLink] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [offersError, setOffersError] = useState<string | null>(null);
  const [offersLoading, setOffersLoading] = useState(paid);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentWhatsAppUrl, setPaymentWhatsAppUrl] = useState<string | null>(
    null,
  );
  const [origin, setOrigin] = useState("");

  const promoSlotType: PromoSlotProgramType | null =
    programType === "bootcamp" || programType === "mini_bootcamp"
      ? programType
      : null;
  const initialSlots = getPromoInitialSlots(promoSlotType);
  const minSlots = getPromoMinSlots(initialSlots);
  const [remainingSlots, setRemainingSlots] = useState(initialSlots);
  const [slotPulse, setSlotPulse] = useState(false);

  const occupation = form.watch("occupation");
  const selectedPackage = form.watch("selected_package");

  const offers = useMemo(
    () => (paid ? getOffersForSource(registrationSource, offerPrices) : []),
    [paid, registrationSource, offerPrices],
  );

  const needsFriend = paid && selectedPackage === "bareng_teman";

  const organizationCopy = getOrganizationCopy(occupation, "id");

  const inviteUrl = useMemo(() => {
    const base =
      registrationLink.trim() ||
      (origin && pathname ? `${origin}${pathname}` : "");
    if (!base) return "";
    return paid ? appendRegistrationSource(base, registrationSource) : base;
  }, [origin, paid, pathname, registrationLink, registrationSource]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    setRemainingSlots(initialSlots);
  }, [initialSlots]);

  useEffect(() => {
    if (!isWorkshopPromo) return;

    const intervalId = window.setInterval(() => {
      setRemainingSlots((current) => {
        if (current <= minSlots) {
          window.clearInterval(intervalId);
          return current;
        }
        return current - 1;
      });
    }, PROMO_SLOT_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [isWorkshopPromo, minSlots]);

  useEffect(() => {
    if (!isWorkshopPromo || remainingSlots >= initialSlots) return;
    setSlotPulse(true);
    const timeoutId = window.setTimeout(() => setSlotPulse(false), 300);
    return () => window.clearTimeout(timeoutId);
  }, [initialSlots, isWorkshopPromo, remainingSlots]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (displayName && !form.getValues("name")) {
      form.setValue("name", displayName, { shouldDirty: false });
    }
    if (authEmail && !form.getValues("email")) {
      form.setValue("email", authEmail, { shouldDirty: false });
    }
  }, [isLoggedIn, displayName, authEmail, form]);

  useEffect(() => {
    if (!isLoggedIn || !userId || !isSupabaseConfigured()) return;

    let cancelled = false;
    const supabase = createClient();

    void (async () => {
      const profile = await getStudentProfile(supabase, userId);
      if (!profile || cancelled) return;

      if (profile.full_name && !form.getValues("name")) {
        form.setValue("name", profile.full_name, { shouldDirty: false });
      }
      if (profile.phone && !form.getValues("phone")) {
        form.setValue("phone", toE164PhoneForInput(profile.phone) ?? "", {
          shouldDirty: false,
        });
      }
      if (profile.occupation && !form.getValues("occupation")) {
        form.setValue("occupation", profile.occupation, { shouldDirty: false });
      }
      if (profile.organization && !form.getValues("organization")) {
        form.setValue("organization", profile.organization, {
          shouldDirty: false,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, userId, form]);

  useEffect(() => {
    let cancelled = false;
    setOffersLoading(paid);
    setOffersError(null);

    void (async () => {
      try {
        const res = await fetch(
          `/api/registration/${encodeURIComponent(programId)}`,
        );
        const data = (await res.json()) as {
          program?: RegistrationProgramPayload;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          if (paid) {
            setOffersError(data.error || "Could not load registration offers.");
            setOfferPrices(emptyProgramOfferPrices());
          }
          return;
        }
        setOfferPrices({
          promo_individual_price: data.program?.promo_individual_price ?? null,
          promo_bareng_teman_price:
            data.program?.promo_bareng_teman_price ?? null,
          price: data.program?.price ?? null,
        });
        setWaGroupLink(data.program?.wa_group_link?.trim() ?? "");
        setRegistrationLink(data.program?.registration_link?.trim() ?? "");
      } catch {
        if (!cancelled && paid) {
          setOffersError("Could not load registration offers.");
          setOfferPrices(emptyProgramOfferPrices());
        }
      } finally {
        if (!cancelled) setOffersLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paid, programId]);

  useEffect(() => {
    if (!paid) {
      form.setValue("selected_package", "");
      return;
    }

    if (offers.length === 1) {
      form.setValue("selected_package", offers[0]!.package);
      return;
    }

    const stillValid = offers.some((offer) => offer.package === selectedPackage);
    if (!stillValid) {
      form.setValue("selected_package", "");
    }
  }, [form, paid, offers, selectedPackage]);

  const handleSuccessOpenChange = (open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      form.reset(defaultValues);
      setSubmitError(null);
      setPaymentWhatsAppUrl(null);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    const body: Record<string, string> = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      occupation: values.occupation,
      organization: values.organization.trim(),
    };

    if (paid) {
      body.registration_source = registrationSource;
      body.selected_package = values.selected_package;
      if (needsFriend) {
        body.friend_name = values.friend_name.trim();
        body.friend_phone = values.friend_phone.trim();
      }
    }

    try {
      const res = await fetch(
        `/api/registration/${encodeURIComponent(programId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        package_price?: number;
        selected_package?: string;
        registration_source?: string;
      };

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Failed to submit registration.");
        return;
      }

      if (
        paid &&
        data.selected_package &&
        data.package_price != null &&
        data.registration_source
      ) {
        setPaymentWhatsAppUrl(
          buildPaymentWhatsAppUrl({
            programName: programTitle,
            participantName: values.name.trim(),
            phone: values.phone.trim(),
            selectedPackage: data.selected_package as RegistrationPackage,
            packagePrice: data.package_price,
            source: data.registration_source as RegistrationSource,
            friendName: values.friend_name,
            friendPhone: values.friend_phone,
          }),
        );
      } else {
        setPaymentWhatsAppUrl(null);
      }

      form.reset(defaultValues);
      setSuccessOpen(true);
    } catch {
      setSubmitError("Failed to submit registration. Please try again.");
    }
  });

  return (
    <>
      <form
        id="register"
        noValidate
        onSubmit={(e) => void onSubmit(e)}
        className={cn(
          "scroll-mt-24 space-y-5",
          embedded
            ? ""
            : "rounded-2xl border border-brand-periwinkle/60 bg-background/80 p-5",
        )}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-brand-deep">Data Peserta</h2>
          <p className="text-sm text-muted-foreground">
            Kolom bertanda{" "}
            <span className="font-semibold text-destructive">*</span> wajib
            diisi.
          </p>
        </div>

        <div className="space-y-4">
          <TextInputController
            form={form}
            name="name"
            label="Nama Lengkap"
            required
            placeholder="Masukkan nama lengkapmu"
            componentProps={{
              input: { autoComplete: "name" },
            }}
          />

          <TextInputController
            form={form}
            name="email"
            label="Email"
            required
            placeholder="nama@email.com"
            componentProps={{
              input: { type: "email", autoComplete: "email" },
            }}
          />

          <PhoneInputController
            form={form}
            name="phone"
            label="Nomor WhatsApp"
            required
            placeholder="812 3456 7890"
            description="Pilih kode negara, lalu isi nomor tanpa +62 atau angka 0 di depan."
            componentProps={{
              input: { id: "reg-phone" },
            }}
          />
        </div>

        <div className="space-y-4 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-brand-deep">
              Informasi Latar Belakang
            </p>
            <p className="text-xs text-muted-foreground">
              Detail ini membantu kami mengenal background-mu lebih baik.
            </p>
          </div>

          <SelectController
            form={form}
            name="occupation"
            label="Pekerjaan / Status"
            required
            placeholder="Pilih status"
            options={registrationOccupationOptions.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            componentProps={{ selectTrigger: { id: "reg-occupation" } }}
          />

          <TextInputController
            form={form}
            name="organization"
            label="Institusi / Organisasi"
            required
            placeholder={organizationCopy.placeholder}
            description={organizationCopy.helper}
          />
        </div>

        {paid ? (
          <div className="space-y-3">
            {isWorkshopPromo ? (
              <div className="rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 px-4 py-3 text-sm text-brand-deep">
                <p className="font-medium leading-snug">
                  Kamu datang dari absensi workshop — pilih paket di bawah untuk
                  kunci harga spesial.
                </p>
              </div>
            ) : null}

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-brand-deep">
                Pilih paket <span className="text-destructive">*</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {isWorkshopPromo
                  ? "Harga spesial untuk peserta workshop."
                  : "Early bird registration pricing."}
              </p>
            </div>

            {offersLoading ? (
              <p className="text-sm text-muted-foreground">Loading packages…</p>
            ) : null}
            {offersError ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {offersError}
              </p>
            ) : null}

            <div className="space-y-2">
              <RadioCardGroupController
                form={form}
                name="selected_package"
                required
                options={offers.map((offer) => ({
                  value: offer.package,
                  label: offer.label,
                  description: offer.description,
                  price: formatIdr(offer.price),
                }))}
                emptyMessage="Paket untuk sumber ini belum tersedia. Hubungi admin Digica."
              />

              {isWorkshopPromo ? (
                <p className="pt-1 text-sm font-medium text-muted-foreground">
                  tersisa{" "}
                  <span
                    className={cn(
                      "inline-block font-bold transition-all duration-300",
                      getPromoSlotNumberClass(remainingSlots, initialSlots),
                      slotPulse && "scale-110",
                    )}
                  >
                    {remainingSlots}
                  </span>{" "}
                  slot
                </p>
              ) : null}

              {needsFriend ? (
                <div className="space-y-3 pt-2">
                  <TextInputController
                    form={form}
                    name="friend_name"
                    label="Nama Teman"
                    required
                    placeholder="Nama teman yang join bersama"
                  />
                  <PhoneInputController
                    form={form}
                    name="friend_phone"
                    label="WhatsApp Teman"
                    required
                    placeholder="812 3456 7890"
                    description="Pilih kode negara, lalu isi nomor tanpa +62 atau angka 0 di depan."
                    componentProps={{
                      input: { id: "reg-friend-phone" },
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {submitError ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        ) : null}

        <div className="space-y-3">
          {paid ? (
            <div className="rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 px-4 py-3 text-sm leading-snug text-brand-deep">
              <p className="font-semibold">
                Daftar dulu, abis itu chat admin WhatsApp buat minta detail
                bayarnya ya 💬
              </p>
              <p className="mt-1 text-brand-royal">
                {isWorkshopPromo
                  ? "Slotnya terbatas lho — jangan sampai kehabisan!"
                  : "Slot early bird-nya terbatas lho — jangan sampai kehabisan!"}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 px-4 py-3 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-royal" />
              <p>Setelah kirim, datamu langsung tersimpan di program ini.</p>
            </div>
          )}

          <Button
            type="submit"
            className="h-11 w-full rounded-lg bg-brand-royal text-sm font-semibold hover:bg-brand-royal/90"
            loading={form.formState.isSubmitting}
            disabled={paid && (offersLoading || offers.length === 0)}
          >
            Daftar Sekarang
          </Button>
        </div>
      </form>

      <RegistrationSuccessDialog
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
        isBootcamp={paid}
        isWorkshopPromo={isWorkshopPromo}
        hasWaGroupLink={Boolean(waGroupLink)}
        waGroupUrl={waGroupLink}
        inviteUrl={inviteUrl}
        paymentWhatsAppUrl={paymentWhatsAppUrl}
      />
    </>
  );
}

function RegistrationFormFallback() {
  return (
    <div className="space-y-4 py-2" aria-hidden>
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function ProgramRegistrationForm(props: ProgramRegistrationFormProps) {
  return (
    <Suspense fallback={<RegistrationFormFallback />}>
      <ProgramRegistrationFormInner {...props} />
    </Suspense>
  );
}
