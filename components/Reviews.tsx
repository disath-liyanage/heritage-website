"use client";

import { useEffect, useRef, useState } from "react";

export type Review = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

type ReviewsProps = {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Reviews({ reviews, overallRating, reviewCount }: ReviewsProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const element = rowRef.current;
    if (!element || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      if (!rowRef.current) {
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      const reachedEnd = scrollLeft + clientWidth >= scrollWidth - 12;

      rowRef.current.scrollBy({
        left: reachedEnd ? -scrollWidth : 360,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollByAmount = (delta: number) => {
    rowRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="bg-[#F8F4EC] py-20" aria-label="Reviews section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-4xl text-[#1C2B1E] md:text-5xl">What our guests say</h2>

          <div className="rounded-full border border-[#D4C5AE] bg-white px-5 py-2 text-sm text-[#2B3A2E]">
            <span className="mr-2 inline-block rounded-full bg-[#4285F4] px-2 py-0.5 text-xs font-bold text-white">
              G
            </span>
            {overallRating.toFixed(1)} / 5 ({reviewCount} reviews)
          </div>
        </div>

        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-360)}
            className="rounded-full border border-[#D4C5AE] bg-white px-3 py-2 text-[#2B3A2E]"
            aria-label="Scroll reviews left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(360)}
            className="rounded-full border border-[#D4C5AE] bg-white px-3 py-2 text-[#2B3A2E]"
            aria-label="Scroll reviews right"
          >
            →
          </button>
        </div>

        <div
          ref={rowRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {reviews.map((review) => (
            <article
              key={`${review.name}-${review.date}`}
              className="min-h-65 min-w-[320px] max-w-[320px] snap-start rounded-xl border border-[#E2D6C5] bg-white p-5 shadow-sm"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <header className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8C19A] text-sm font-semibold text-[#1C2B1E]">
                  {initials(review.name)}
                </div>
                <div>
                  <p className="font-semibold text-[#243024]">{review.name}</p>
                  <p className="text-xs text-[#8A7A61]">
                    {"★".repeat(Math.round(review.rating))}
                    <span className="ml-1 text-[#A9977C]">{review.rating.toFixed(1)}</span>
                  </p>
                </div>
              </header>

              <p className="line-clamp-4 text-sm leading-relaxed text-[#3A453A]">{review.text}</p>

              <footer className="mt-5 flex items-center justify-between text-xs text-[#8A7A61]">
                <span>{review.date}</span>
                <span className="font-bold text-[#4285F4]">G</span>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#2E4830] underline underline-offset-4"
          >
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
