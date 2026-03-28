import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import CoursesSection from "@/components/landing/CoursesSection";
import SkillsSection from "@/components/landing/SkillsSection";
import ExperienceSection from "@/components/landing/ExperienceSection";
import Testimonials from "@/components/landing/Testimonials";
import Instructor from "@/components/landing/Instructor";
import HowItWorks from "@/components/landing/HowItWorks";
import ArticlesSection from "@/components/landing/ArticlesSection";
import FAQ from "@/components/landing/FAQ";
import { Reveal } from "@/components/motion/Reveal";

export function GuestLandingMain() {
  return (
    <>
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <SocialProof />
      </Reveal>
      <Reveal>
        <CoursesSection />
      </Reveal>
      <Reveal>
        <SkillsSection />
      </Reveal>
      <Reveal>
        <ExperienceSection />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Instructor />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <ArticlesSection />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
    </>
  );
}
