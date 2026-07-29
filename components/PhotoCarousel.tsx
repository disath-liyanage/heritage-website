"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GalleryPhoto } from "@/lib/types/gallery";

type PhotoCarouselProps = {
  photos: GalleryPhoto[];
};

function getImageAlt(category: string) {
  switch (category?.toLowerCase()) {
    case "treehouse":
      return "The Magical Tree House by Heritage Family Restaurant, Yatiyanthota";
    case "outdoor":
      return "Kelani River view at Heritage Family Restaurant, Yatiyanthota";
    case "food":
    case "menu":
    case "cuisine":
      return "Sri Lankan cuisine at Heritage Family Restaurant, Yatiyanthota";
    default:
      return "Heritage Family Restaurant riverside view, Yatiyanthota";
  }
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [paused, setPaused] = useState(false);
  
  const safePhotos = Array.isArray(photos) ? photos : [];
  
  const loopPhotos = useMemo(() => [...safePhotos, ...safePhotos], [safePhotos]);

  if (!safePhotos.length) {
    return null;
  }

  return (
    <section id="gallery" className="bg-[#F5F0E8] py-20" aria-label="Gallery section">
      <div className="mx-auto mb-10 max-w-7xl px-6">
        <h2 className="mt-2 font-display text-4xl text-[#1F2D21] md:text-5xl">
          A glimpse of our riverside experience
        </h2>
      </div>

      <div 
        className="overflow-hidden" 
        onMouseEnter={() => setPaused(true)} 
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`carousel-track flex w-max items-center gap-4 px-6 h-[400px] ${paused ? "paused" : ""}`}>
          {loopPhotos.map((photo, index) => (
            <Link
              key={`${photo.id}-${index}`}
              href={`/gallery?photo=${photo.id}`}
              className="relative shrink-0 overflow-hidden rounded-lg transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] h-[250px] w-[350px] hover:h-[350px] hover:w-[500px]"
            >
              <Image
                src={photo.image_url}
                alt={getImageAlt(photo.category)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}