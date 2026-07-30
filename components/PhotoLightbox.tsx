"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GalleryPhoto } from "@/lib/types/gallery";

type PhotoLightboxProps = {
  photos: GalleryPhoto[];
  selectedIndex: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function PhotoLightbox({
  photos,
  selectedIndex,
  onBack,
  onPrev,
  onNext,
}: PhotoLightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack, onNext, onPrev]);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

  const currentPhoto = photos[selectedIndex];
  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-100 bg-[#F5F0E8]/40 backdrop-blur-sm lightbox-fade-in"
      onClick={onBack}
      aria-label="Close lightbox backdrop"
    >
      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Close lightbox"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1F2A20]/25 bg-[#F5F0E8]/90 text-[#1F2A20] shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#1F2A20]/45 hover:bg-[#F5F0E8] hover:shadow-lg md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="relative h-full w-full p-6 pt-20 md:px-16 md:py-12 md:pt-20">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          
          <div className="relative flex w-full max-w-5xl items-center justify-center">
            
            <div
              className="lightbox-photo-in relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-[#1F2A20]/10 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={currentPhoto.image_url}
                alt={`Gallery photo - ${currentPhoto.category}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
                priority
                draggable={false}
              />
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1F2A20]/15 bg-[#F5F0E8]/85 text-[#1F2A20] backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-[#F5F0E8] hover:shadow-xl md:-left-14 md:h-12 md:w-12 lg:-left-16"
            >
              <svg viewBox="0 0 24 24" className="mr-0.5 h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1F2A20]/15 bg-[#F5F0E8]/85 text-[#1F2A20] backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-[#F5F0E8] hover:shadow-xl md:-right-14 md:h-12 md:w-12 lg:-right-16"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}