"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type PhotoCarouselProps = {
  images: string[];
};

function getImageAlt(src: string) {
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

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [paused, setPaused] = useState(false);
  const loopImages = useMemo(() => [...images, ...images], [images]);

  if (!images.length) {
    return null;
  }

  return (
    <section id="gallery" className="bg-[#F5F0E8] py-20" aria-label="Gallery section">
      <div className="mx-auto mb-10 max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Life at Heritage</p>
        <h2 className="mt-2 font-display text-4xl text-[#1F2D21] md:text-5xl">
          A glimpse of our riverside home
        </h2>
      </div>

      <div className="overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={`carousel-track flex w-max gap-4 px-6 ${paused ? "paused" : ""}`}>
          {loopImages.map((src, index) => (
            <Link
              key={`${src}-${index}`}
              href={`/gallery?photo=${encodeURIComponent(src)}`}
              className="relative h-52.5 w-75 shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt={getImageAlt(src)}
                fill
                className="object-cover"
                sizes="300px"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
