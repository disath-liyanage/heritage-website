"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type PhotoCarouselProps = {
  images: string[];
};

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
              className="relative h-[210px] w-[300px] shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt="Heritage Family Restaurant gallery"
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
