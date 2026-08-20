import { createAdminClient } from "@/lib/supabase/admin";
import type { ProgramStatus, ProgramType } from "@/features/programs/types";
import { resolveProgramIdByIdentifier } from "@/utils/program-public-link";

export type ProgramRegistrationPublicData = {
  id: string;
  name: string;
  type: ProgramType;
  status: ProgramStatus;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  registration_link: string | null;
  wa_group_link: string | null;
  public_code: string;
  public_slug: string | null;
  price: number | null;
  promo_individual_price: number | null;
  promo_bareng_teman_price: number | null;
};

function toNullablePrice(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

export async function getProgramRegistrationPublicData(
  identifier: string,
): Promise<ProgramRegistrationPublicData | null> {
  const supabase = createAdminClient();
  const resolvedProgramId = await resolveProgramIdByIdentifier(
    supabase,
    identifier,
  );

  if (!resolvedProgramId) {
    return null;
  }

  const { data, error } = await supabase
    .from("programs")
    .select(
      "id, name, type, status, start_date, end_date, start_time, end_time, registration_link, wa_group_link, public_code, public_slug, price, promo_individual_price, promo_bareng_teman_price",
    )
    .eq("id", resolvedProgramId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    type: data.type as ProgramType,
    status: data.status as ProgramStatus,
    price: toNullablePrice(data.price),
    promo_individual_price: toNullablePrice(data.promo_individual_price),
    promo_bareng_teman_price: toNullablePrice(data.promo_bareng_teman_price),
  };
}
