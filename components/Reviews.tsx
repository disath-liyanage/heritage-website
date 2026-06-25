"use client";

import { useEffect, useRef, useState } from "react";

export type Review = {
  name: string;
  stars: number;
  text: string;
  publishAt: string;
  reviewerPhotoUrl: string;
  reviewImageUrls: string[];
  reviewId: string;
};

function initials(name: string) {
  if (!name) return "G";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Reviews() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/reviews.json");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  useEffect(() => {
    const element = rowRef.current;
    if (!element || isPaused || reviews.length === 0) return;

    const timer = setInterval(() => {
      if (!rowRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      const reachedEnd = scrollLeft + clientWidth >= scrollWidth - 12;

      rowRef.current.scrollBy({
        left: reachedEnd ? -scrollWidth : 360,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  const scrollByAmount = (delta: number) => {
    rowRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="bg-[#F8F4EC] py-20 min-h-[400px] flex items-center justify-center text-[#8A7A61]">
        Loading reviews...
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-[#F8F4EC] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-4xl text-[#1C2B1E] md:text-5xl">
            What our guests say
          </h2>

          <div className="rounded-full border border-[#D4C5AE] bg-white px-5 py-2 text-sm text-[#2B3A2E] flex items-center shadow-sm">
            <span className="mr-2 flex items-center justify-center rounded-full bg-[#4285F4] h-5 w-5 text-[10px] font-bold text-white">
              G
            </span>
            <span className="font-semibold">4.7 / 5</span>
            <span className="ml-1 text-[#8A7A61]">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-360)}
            className="rounded-full border border-[#D4C5AE] bg-white px-4 py-2 text-[#2B3A2E] hover:bg-[#F0EBE1] transition-colors"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount(360)}
            className="rounded-full border border-[#D4C5AE] bg-white px-4 py-2 text-[#2B3A2E] hover:bg-[#F0EBE1] transition-colors"
          >
            →
          </button>
        </div>

        <div
          ref={rowRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {reviews.map((review, index) => (
            <article
              key={review.reviewId || index}
              className="min-h-[260px] min-w-[320px] max-w-[320px] snap-start rounded-2xl border border-[#E2D6C5] bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <header className="mb-4 flex items-center gap-3">
                  {review.reviewerPhotoUrl ? (
                    <img
                      src={review.reviewerPhotoUrl}
                      alt={review.name}
                      className="h-11 w-11 rounded-full object-cover border border-[#E2D6C5]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8C19A] text-sm font-semibold text-[#1C2B1E]">
                      {initials(review.name)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-[#243024] line-clamp-1">
                      {review.name}
                    </p>

                    <div className="text-[#FABB05] text-sm tracking-widest mt-0.5">
                      {"★".repeat(review.stars || 0)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - (review.stars || 0))}
                      </span>
                    </div>
                  </div>
                </header>

                {review.text && (
                  <p className="line-clamp-4 text-sm leading-relaxed text-[#4A554A] mb-3">
                    {review.text}
                  </p>
                )}

                {review.reviewImageUrls?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {review.reviewImageUrls.map((photoUrl, i) => (
                      <img
                        key={i}
                        src={photoUrl}
                        alt="Review"
                        className="h-16 w-16 object-cover rounded-md border border-[#E2D6C5] flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>

              <footer className="mt-4 flex items-center justify-between text-xs text-[#8A7A61] pt-4 border-t border-[#F0EBE1]">
                <span>{review.publishAt}</span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="h-4 w-4 grayscale opacity-60"
                />
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}