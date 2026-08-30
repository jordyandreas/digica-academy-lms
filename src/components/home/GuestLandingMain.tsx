import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import ProgramsSection from "@/components/landing/ProgramsSection";
import CoursesSection from "@/components/landing/CoursesSection";
import SkillsSection from "@/components/landing/SkillsSection";
import { ARTICLES_ENABLED, COURSES_ENABLED } from "@/constants/features";
import Testimonials from "@/components/landing/Testimonials";
import Instructor from "@/components/landing/Instructor";
import HowItWorks from "@/components/landing/HowItWorks";
import ArticlesSection from "@/components/landing/ArticlesSection";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicProgramsResult } from "@/features/programs/types";
import type { Course } from "@/lib/types";
import type { ArticleCardModel } from "@/features/articles/data/articles";

type GuestLandingMainProps = {
  programsResult: PublicProgramsResult;
  courses: Course[];
  articles: ArticleCardModel[];
};

export function GuestLandingMain({
  programsResult,
  courses,
  articles,
}: GuestLandingMainProps) {
  return (
    <>
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <SocialProof />
      </Reveal>
      <Reveal>
        <ProgramsSection
          result={programsResult}
          limit={3}
          seeAllHref="/programs"
        />
      </Reveal>
      {COURSES_ENABLED ? (
        <Reveal>
          <CoursesSection courses={courses} />
        </Reveal>
      ) : null}
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <SkillsSection />
      </Reveal>
      <Reveal>
        <Instructor />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      {ARTICLES_ENABLED ? (
        <Reveal>
          <ArticlesSection articles={articles} />
        </Reveal>
      ) : null}
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}
