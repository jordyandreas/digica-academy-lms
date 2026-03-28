export interface Lesson {
  id: string;
  slug: string;
  title: string;
  videoUrl: string;
  content: string;
  duration: number;
  /** Optional cover for lesson cards (falls back to academy placeholder). */
  coverImage?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseInstructor {
  name: string;
  /** Role and employers, e.g. "Lead Data Scientist @JULO | Ex. GOJEK, UNILEVER." */
  credentials: string;
  /** Optional portrait; defaults to academy avatar in the UI. */
  avatarUrl?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  /**
   * Cohort sessions count used by the marketing/landing UI.
   * (Optional because not all course data needs it.)
   */
  sessions?: number;
  /** Display price on landing cards, e.g. "$499" or "Free". */
  priceLabel?: string;
  /** Optional crossed-out “was” price on marketing cards. */
  priceCompareLabel?: string;
  /** Average rating (e.g. 4.8); shown with reviewCount when both set. */
  rating?: number;
  reviewCount?: number;
  /** Enrolled learners; marketing copy on cards. */
  studentCount?: number;
  level: "beginner" | "intermediate" | "advanced";
  modules: Module[];
  /** Short bullets for the course overview banner. */
  outcomes?: string[];
  /** Shown under the hero portrait on the course page. */
  instructor?: CourseInstructor;
}
