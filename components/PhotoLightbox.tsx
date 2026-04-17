"use client";

import Image from "next/image";
import { useEffect } from "react";

type PhotoLightboxProps = {
  images: string[];
  selectedIndex: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function getLightboxImageAlt(src: string) {
  const path = src.toLowerCase();

  if (path.includes("/images/treehouse/")) {
    return "The Magical Tree House by Heritage Family Restaurant, Yatiyanthota";
  }

  if (path.includes("/images/outdoor/") || path.includes("river")) {
    return "Kelani River view at Heritage Family Restaurant, Yatiyanthota";
  }

  if (path.includes("/images/food/") || path.includes("/images/menu/")) {
    return "Sri Lankan cuisine at Heritage Family Restaurant, Yatiyanthota";
  }

  return "Heritage Family Restaurant riverside view, Yatiyanthota";
}

export default function PhotoLightbox({
  images,
  selectedIndex,
  onBack,
  onPrev,
  onNext,
}: PhotoLightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
      }
      if (event.key === "ArrowLeft") {
        onPrev();
      }
      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack, onNext, onPrev]);

  const currentSrc = images[selectedIndex];
  if (!currentSrc) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 bg-[#F5F0E8]/35 backdrop-blur-[2px] lightbox-fade-in"
      onClick={onBack}
      aria-label="Close lightbox backdrop"
    >
      <div className="absolute left-4 top-4 z-10" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[#1F2A20]/25 bg-[#F5F0E8]/85 px-4 py-2 text-sm font-semibold text-[#1F2A20] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1F2A20]/45 hover:bg-[#F5F0E8] hover:font-bold hover:shadow-lg"
        >
          Back
        </button>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#1F2A20]/25 bg-[#F5F0E8]/85 p-3 text-[#1F2A20] transition-all duration-200 hover:scale-105 hover:border-[#1F2A20]/45 hover:bg-[#F5F0E8] hover:shadow-xl md:left-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#1F2A20]/25 bg-[#F5F0E8]/85 p-3 text-[#1F2A20] transition-all duration-200 hover:scale-105 hover:border-[#1F2A20]/45 hover:bg-[#F5F0E8] hover:shadow-xl md:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="relative h-full w-full p-6 pt-20 md:p-12 md:pt-20">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          <div
            className="lightbox-photo-in relative aspect-4/3 w-full max-w-5xl overflow-hidden rounded-3xl border border-[#1F2A20]/10"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={currentSrc}
              alt={getLightboxImageAlt(currentSrc)}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
