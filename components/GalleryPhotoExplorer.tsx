"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";

type GalleryPhotoExplorerProps = {
  images: string[];
};

type GalleryFilter = "all" | "outdoor" | "treehouse" | "cuisine";

function getGalleryImageAlt(src: string) {
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

export default function GalleryPhotoExplorer({ images }: GalleryPhotoExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [sessionOrderedImages, setSessionOrderedImages] = useState<string[]>(images);

  useEffect(() => {
    if (!images.length) {
      setSessionOrderedImages([]);
      return;
    }

    const storageKey = "heritage:gallery-order:v1";

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const seen = new Set(images);
          const persisted = parsed.filter((src): src is string => typeof src === "string" && seen.has(src));
          const missing = images.filter((src) => !persisted.includes(src));
          const merged = [...persisted, ...missing];

          if (merged.length === images.length) {
            setSessionOrderedImages(merged);
            return;
          }
        }
      }

      const shuffled = [...images];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      sessionStorage.setItem(storageKey, JSON.stringify(shuffled));
      setSessionOrderedImages(shuffled);
    } catch {
      setSessionOrderedImages(images);
    }
  }, [images]);

  const filteredImages = useMemo(() => {
    if (activeFilter === "outdoor") {
      return sessionOrderedImages.filter((src) => src.toLowerCase().includes("/images/outdoor/"));
    }

    if (activeFilter === "treehouse") {
      return sessionOrderedImages.filter((src) => src.toLowerCase().includes("/images/treehouse/"));
    }

    if (activeFilter === "cuisine") {
      return sessionOrderedImages.filter((src) => {
        const path = src.toLowerCase();
        return path.includes("/images/food/") || path.includes("/images/menu/");
      });
    }

    return sessionOrderedImages;
  }, [activeFilter, sessionOrderedImages]);

  const selectedPhoto = searchParams.get("photo");
  const selectedIndex = selectedPhoto ? filteredImages.indexOf(selectedPhoto) : -1;

  const replaceQueryWithPhoto = useCallback(
    (src: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (src) {
        next.set("photo", src);
      } else {
        next.delete("photo");
      }

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const openPhoto = useCallback((index: number) => {
    replaceQueryWithPhoto(filteredImages[index]);
  }, [filteredImages, replaceQueryWithPhoto]);

  const closePhoto = useCallback(() => {
    replaceQueryWithPhoto(null);
  }, [replaceQueryWithPhoto]);

  const showPrev = useCallback(() => {
    if (selectedIndex < 0) {
      return;
    }
    const nextIndex = (selectedIndex - 1 + filteredImages.length) % filteredImages.length;
    replaceQueryWithPhoto(filteredImages[nextIndex]);
  }, [filteredImages, replaceQueryWithPhoto, selectedIndex]);

  const showNext = useCallback(() => {
    if (selectedIndex < 0) {
      return;
    }
    const nextIndex = (selectedIndex + 1) % filteredImages.length;
    replaceQueryWithPhoto(filteredImages[nextIndex]);
  }, [filteredImages, replaceQueryWithPhoto, selectedIndex]);

  const setFilter = useCallback((filter: GalleryFilter) => {
    setActiveFilter(filter);
    replaceQueryWithPhoto(null);
  }, [replaceQueryWithPhoto]);

  return (
    <>
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap gap-3 px-6">
        <button
          type="button"
          onClick={() => setFilter("outdoor")}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            activeFilter === "outdoor"
              ? "border-[#2D3F2B] bg-[#2D3F2B] text-[#F5F0E8]"
              : "border-[#CBBDA7] bg-[#FFF9F0] text-[#2D3F2B] hover:border-[#2D3F2B]"
          }`}
        >
          Outdoor
        </button>
        <button
          type="button"
          onClick={() => setFilter("treehouse")}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            activeFilter === "treehouse"
              ? "border-[#2D3F2B] bg-[#2D3F2B] text-[#F5F0E8]"
              : "border-[#CBBDA7] bg-[#FFF9F0] text-[#2D3F2B] hover:border-[#2D3F2B]"
          }`}
        >
          Tree House
        </button>
        <button
          type="button"
          onClick={() => setFilter("cuisine")}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            activeFilter === "cuisine"
              ? "border-[#2D3F2B] bg-[#2D3F2B] text-[#F5F0E8]"
              : "border-[#CBBDA7] bg-[#FFF9F0] text-[#2D3F2B] hover:border-[#2D3F2B]"
          }`}
        >
          Cuisine
        </button>
        {activeFilter !== "all" ? (
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="inline-flex items-center gap-2 rounded-full border border-[#CBBDA7] bg-[#FFF9F0] px-5 py-2 text-sm font-semibold text-[#2D3F2B] transition hover:border-[#2D3F2B]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 5l10 10" />
              <path d="M15 5L5 15" />
            </svg>
            Clear
          </button>
        ) : null}
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => openPhoto(index)}
            aria-label={`Open photo ${index + 1}`}
            className="group relative aspect-4/3 overflow-hidden rounded-xl text-left"
          >
            <Image
              src={src}
              alt={getGalleryImageAlt(src)}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ))}
      </section>

      {selectedIndex >= 0 ? (
        <PhotoLightbox
          images={filteredImages}
          selectedIndex={selectedIndex}
          onBack={closePhoto}
          onPrev={showPrev}
          onNext={showNext}
        />
      ) : null}
    </>
  );
}
