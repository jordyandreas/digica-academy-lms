import { TESTIMONIALS } from "@/features/testimonials/data/testimonials";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";

export default function Testimonials() {
  return (
    <section className="relative border-y border-zinc-200/80 bg-white/85 px-6 py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 flex justify-center">
        <div className="h-64 w-[36rem] rounded-full bg-gradient-to-r from-primary/15 via-secondary/15 to-tertiary/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl space-y-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Testimonial
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-[1.9rem] md:leading-tight">
            See why we&apos;re rated #1 in{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              online platform tech
            </span>
          </h2>
          <p className="text-sm text-zinc-600 md:text-[0.95rem]">
            Our learners use Digica Academy to unlock promotions, switch careers, and ship projects
            that actually move the needle at work.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={i}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
