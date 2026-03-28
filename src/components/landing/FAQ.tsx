"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    question: "Is this beginner friendly?",
    answer:
      "Yes. We start from first principles and assume no prior experience in SQL or data, while still moving at a pace suitable for professionals.",
  },
  {
    question: "Are the classes live?",
    answer:
      "Core sessions are live and interactive. You will also get structured self-paced material to review between sessions.",
  },
  {
    question: "Will recordings be available?",
    answer:
      "Yes. All live sessions are recorded and available for you to rewatch during and after the cohort.",
  },
  {
    question: "Do I get mentor feedback?",
    answer:
      "Absolutely. You will receive feedback on key projects and can ask questions during office hours and via async channels.",
  },
];

export default function FAQ() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" as const };

  return (
    <section
      id="faq"
      className="border-y border-primary/5 bg-white/70 px-6 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)] md:items-start">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-tertiary/10 px-3 py-1 text-xs font-medium tracking-wide text-tertiary ring-1 ring-tertiary/20">
            Testimonial
          </span>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
              Frequently asked
              <br className="hidden sm:block" />
              Questions
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-600 md:text-[0.95rem]">
              For any unanswered questions, reach out to our support team via email.{" "}
              We&apos;ll respond as soon as possible to assist you.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-zinc-200/80 bg-white/80 p-4 md:p-6">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="group border-b border-zinc-100 last:border-b-0"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                  aria-expanded={isOpen}
                  className="h-auto w-full justify-between gap-4 rounded-none px-0 py-4 text-left text-sm font-medium text-zinc-900 hover:bg-transparent md:text-[0.95rem]"
                >
                  <span className="flex-1">{item.question}</span>
                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-primary/20",
                      isOpen ? "bg-primary text-primary-foreground" : "bg-primary/5 text-primary",
                    ].join(" ")}
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </Button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transition}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-4 text-xs leading-relaxed text-zinc-600 md:text-[0.8rem]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

