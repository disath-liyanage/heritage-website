"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type MenuPhotoExplorerProps = {
  images: string[];
};

export default function MenuPhotoExplorer({ images }: MenuPhotoExplorerProps) {
  const router = useRouter();
  const menuImages = useMemo(() => {
    return images.filter((src) => {
      const normalized = src.toLowerCase();
      return normalized.includes("/images/food/") || normalized.includes("/images/menu/");
    });
  }, [images]);
  const [sessionOrderedMenuImages, setSessionOrderedMenuImages] = useState<string[]>(menuImages);

  useEffect(() => {
    if (!menuImages.length) {
      setSessionOrderedMenuImages([]);
      return;
    }

    const storageKey = "heritage:menu-food-order:v1";

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const seen = new Set(menuImages);
          const persisted = parsed.filter((src): src is string => typeof src === "string" && seen.has(src));
          const missing = menuImages.filter((src) => !persisted.includes(src));
          const merged = [...persisted, ...missing];

          if (merged.length === menuImages.length) {
            setSessionOrderedMenuImages(merged);
            return;
          }
        }
      }

      const shuffled = [...menuImages];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      sessionStorage.setItem(storageKey, JSON.stringify(shuffled));
      setSessionOrderedMenuImages(shuffled);
    } catch {
      setSessionOrderedMenuImages(menuImages);
    }
  }, [menuImages]);

  const openInGallery = useCallback(
    (src: string) => {
      router.push(`/gallery?photo=${encodeURIComponent(src)}`);
    },
    [router],
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="font-display text-3xl text-[#1F2D21] md:text-4xl">Photo Highlights</h2>
        <p className="mt-2 text-sm text-[#2A3A2D]/75">
          Tap a food photo to open it in the full gallery viewer.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sessionOrderedMenuImages.slice(0, 10).map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => openInGallery(src)}
              aria-label={`Open food photo ${index + 1} in gallery`}
              className="group relative aspect-4/3 overflow-hidden rounded-lg text-left"
            >
              <Image
                src={src}
                alt="Menu page photo"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </button>
          ))}
        </div>

        {!menuImages.length ? (
          <p className="mt-4 text-sm text-[#2A3A2D]/70">No food photos available yet.</p>
        ) : null}
      </section>
    </>
  );
}
