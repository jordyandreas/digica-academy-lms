import { NextResponse } from "next/server";
import {
  getOfferForPackage,
  isPackageForSource,
  isRegistrationSource,
  type RegistrationPackage,
  type RegistrationSource,
} from "@/constants/registration-offers";
import { getProgramRegistrationPublicData } from "@/features/registration/getProgramRegistrationPublicData";
import { getTodayDateString } from "@/lib/date-utils";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import {
  paidParticipantRegistrationSchema,
  participantRegistrationSchema,
} from "@/schemas/participant-registration-schema";
import { normalizePhoneForSubmit } from "@/utils/phone";
import { resolveProgramIdByIdentifier } from "@/utils/program-public-link";

type RouteContext = {
  params: Promise<{ programId: string }>;
};

function configurationError() {
  return NextResponse.json(
    {
      error:
        "Registration is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
    },
    { status: 500 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  if (!isServiceRoleConfigured()) {
    return configurationError();
  }

  try {
    const { programId: identifier } = await context.params;
    const program = await getProgramRegistrationPublicData(identifier);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("[registration] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load registration data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!isServiceRoleConfigured()) {
    return configurationError();
  }

  try {
    const { programId: identifier } = await context.params;
    const supabase = createAdminClient();
    const resolvedProgramId = await resolveProgramIdByIdentifier(
      supabase,
      identifier,
    );

    if (!resolvedProgramId) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const program = await getProgramRegistrationPublicData(identifier);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    if (program.status === "completed") {
      return NextResponse.json(
        {
          error:
            "This program has completed and is no longer accepting registrations",
        },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const isPaidProgram =
      program.type === "bootcamp" || program.type === "mini_bootcamp";

    if (isPaidProgram) {
      const validation = paidParticipantRegistrationSchema.safeParse(body);

      if (!validation.success) {
        const firstIssue = validation.error.issues[0];
        return NextResponse.json(
          { error: firstIssue?.message || "Invalid registration payload" },
          { status: 400 },
        );
      }

      const values = validation.data;
      const source = values.registration_source as RegistrationSource;
      const selectedPackage = values.selected_package as RegistrationPackage;
      const offerPrices = {
        promo_individual_price: program.promo_individual_price,
        promo_bareng_teman_price: program.promo_bareng_teman_price,
        price: program.price,
      };

      if (
        !isRegistrationSource(source) ||
        !isPackageForSource(source, selectedPackage, offerPrices)
      ) {
        return NextResponse.json(
          { error: "Invalid registration source or package" },
          { status: 400 },
        );
      }

      const offer = getOfferForPackage(source, selectedPackage, offerPrices);
      if (!offer) {
        return NextResponse.json(
          { error: "Invalid registration package" },
          { status: 400 },
        );
      }

      const { error } = await supabase.from("participants").insert({
        name: values.name.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        phone: normalizePhoneForSubmit(values.phone),
        occupation: values.occupation || null,
        organization: values.organization?.trim().toLowerCase() || null,
        program_id: resolvedProgramId,
        status: "active",
        joined_date: getTodayDateString(),
        registration_source: source,
        selected_package: selectedPackage,
        package_price: offer.price,
        friend_name:
          selectedPackage === "bareng_teman"
            ? values.friend_name?.trim().toLowerCase() || null
            : null,
        friend_phone:
          selectedPackage === "bareng_teman" && values.friend_phone
            ? normalizePhoneForSubmit(values.friend_phone)
            : null,
      });

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        package_price: offer.price,
        selected_package: selectedPackage,
        registration_source: source,
      });
    }

    const validation = participantRegistrationSchema.safeParse(body);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid registration payload" },
        { status: 400 },
      );
    }

    const values = validation.data;
    const { error } = await supabase.from("participants").insert({
      name: values.name.trim().toLowerCase(),
      email: values.email.trim().toLowerCase(),
      phone: normalizePhoneForSubmit(values.phone),
      occupation: values.occupation || null,
      organization: values.organization?.trim().toLowerCase() || null,
      program_id: resolvedProgramId,
      status: "active",
      joined_date: getTodayDateString(),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[registration] POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 },
    );
  }
}
