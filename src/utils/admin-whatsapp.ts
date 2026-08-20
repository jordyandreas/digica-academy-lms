import {
  formatRegistrationPackage,
  type RegistrationPackage,
  type RegistrationSource,
} from "@/constants/registration-offers";

const SOURCE_LABELS: Record<RegistrationSource, string> = {
  workshop_promo: "Workshop",
  social: "Social",
};

export function getAdminWhatsAppNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.trim() ?? "";
  if (!raw) {
    return null;
  }

  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function buildWhatsAppUrl(text: string): string | null {
  const adminNumber = getAdminWhatsAppNumber();
  if (!adminNumber) {
    return null;
  }
  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
}

export function buildPaymentWhatsAppUrl(input: {
  programName: string;
  participantName: string;
  phone: string;
  selectedPackage: RegistrationPackage;
  packagePrice: number;
  source: RegistrationSource;
  friendName?: string | null;
  friendPhone?: string | null;
}): string | null {
  const packageLabel = formatRegistrationPackage(input.selectedPackage);
  const sourceLabel = SOURCE_LABELS[input.source];
  const friendName = input.friendName?.trim() || null;
  const friendPhone = input.friendPhone?.trim() || null;
  const includeFriend =
    input.selectedPackage === "bareng_teman" &&
    Boolean(friendName) &&
    Boolean(friendPhone);

  const text = [
    "Halo Admin Digica,",
    `Saya sudah registrasi ${input.programName}.`,
    `Promo: ${sourceLabel}`,
    `Nama: ${input.participantName}`,
    `No.Hp: ${input.phone}`,
    `Paket: ${packageLabel}`,
    ...(includeFriend
      ? [`Nama teman: ${friendName}`, `No.Hp teman: ${friendPhone}`]
      : []),
    "",
    "Saya mau minta detail pembayaran dong.",
    "",
    "Terima kasih.",
  ].join("\n");

  return buildWhatsAppUrl(text);
}

export function buildInquiryWhatsAppUrl(input: {
  programName: string;
}): string | null {
  return buildWhatsAppUrl(
    `Halo Admin Digica, Saya ingin bertanya mengenai ${input.programName}`,
  );
}

export function buildLegalInquiryWhatsAppUrl(): string | null {
  return buildWhatsAppUrl(
    [
      "Hello Digica Academy,",
      "",
      "I would like to make a privacy or data request regarding my account.",
      "",
      "Thank you.",
    ].join("\n"),
  );
}

export function buildGeneralWhatsAppUrl(): string | null {
  return buildWhatsAppUrl("Halo Admin Digica, saya ingin bertanya.");
}

export function buildCheckInLinkHelpWhatsAppUrl(input?: {
  programName?: string | null;
}): string | null {
  const programName = input?.programName?.trim();
  const text = programName
    ? [
        "Halo Admin Digica,",
        `Saya membuka link absensi untuk ${programName}, tapi sepertinya linknya tidak sesuai / tidak bisa dipakai.`,
        "",
        "Boleh minta link absensi yang benar?",
      ].join("\n")
    : [
        "Halo Admin Digica,",
        "Saya membuka link absensi, tapi sepertinya linknya tidak sesuai / tidak bisa dipakai.",
        "",
        "Boleh minta link absensi yang benar?",
      ].join("\n");

  return buildWhatsAppUrl(text);
}
