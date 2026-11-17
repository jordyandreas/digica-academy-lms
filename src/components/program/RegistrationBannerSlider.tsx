"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isRemoteImageSrc } from "@/features/programs/isRemoteImageSrc";
import { cn } from "@/lib/utils";

export const REGISTRATION_BANNER_AUTOPLAY_MS = 5000;

export type RegistrationBannerSlide = {
  src: string;
  alt: string;
};

type RegistrationBannerSliderProps = {
  slides: RegistrationBannerSlide[];
  className?: string;
};

export function RegistrationBannerSlider({
  slides,
  className,
}: RegistrationBannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return;

    const timerId = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, REGISTRATION_BANNER_AUTOPLAY_MS);

    return () => window.clearInterval(timerId);
  }, [count, index, paused, reduceMotion]);

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    const slide = slides[0]!;
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-brand-periwinkle/50",
          className,
        )}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          width={1200}
          height={1500}
          priority
          unoptimized={isRemoteImageSrc(slide.src)}
          className="h-auto w-full object-contain"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-periwinkle/50",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/*
        Stack slides absolutely so track height follows the active image only.
        A horizontal flex track would size to the tallest slide and leave gaps.
      */}
      <div className="relative w-full" aria-live="polite">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <div
              key={`${slide.src}-${slideIndex}`}
              className={cn(
                "w-full transition-opacity duration-500 ease-out",
                isActive ? "relative z-10 opacity-100" : "pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0",
              )}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1200}
                height={1500}
                priority={slideIndex === 0}
                unoptimized={isRemoteImageSrc(slide.src)}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
        aria-label="Poster sebelumnya"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
        aria-label="Poster berikutnya"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
        {slides.map((slide, slideIndex) => (
          <button
            key={`dot-${slide.src}-${slideIndex}`}
            type="button"
            onClick={() => goTo(slideIndex)}
            className={cn(
              "h-2 w-2 rounded-full transition",
              slideIndex === index
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75",
            )}
            aria-label={`Lihat poster ${slideIndex + 1}`}
            aria-current={slideIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
