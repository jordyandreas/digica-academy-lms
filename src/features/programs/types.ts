export type ProgramType = "mini_bootcamp" | "bootcamp" | "workshop";

export type ProgramStatus = "draft" | "active" | "completed";

/** Raw row from public.programs (selected columns only). */
export type ProgramRow = {
  id: string;
  name: string;
  type: ProgramType;
  year: number | null;
  batch: string | number | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  schedule_days: unknown;
  price: number | null;
  session_count: number | null;
  status: ProgramStatus;
  public_code: string | null;
  public_slug: string | null;
};

/** UI card model for landing. */
export type ProgramCardModel = {
  id: string;
  title: string;
  type: ProgramType;
  typeLabel: string;
  dateLabel: string;
  priceLabel: string;
  sessionsLabel: string | null;
  batchLabel: string | null;
  publicSlug: string | null;
  ctaHref: string;
};

/** UI model for the public program detail page. */
export type ProgramDetailModel = {
  id: string;
  title: string;
  type: ProgramType;
  typeLabel: string;
  dateLabel: string;
  priceLabel: string;
  sessionsLabel: string | null;
  batchLabel: string | null;
  scheduleDays: string | null;
  timeLabel: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  summaryHtml: string | null;
  scheduleDateLines: { primary: string; secondary: string };
  scheduleTimeLines: { primary: string; secondary: string };
  year: number | null;
  publicSlug: string;
  /** Registration banner from admin, if uploaded. */
  registrationBannerUrl: string | null;
  /** Default type image when no registration banner. */
  fallbackImageSrc: string;
  /** Resolved hero image (banner or fallback). */
  imageSrc: string;
};

export type PublicProgramsResult = {
  programs: ProgramCardModel[];
  error: string | null;
};
