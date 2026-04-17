"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";

type GalleryPhotoExplorerProps = {
  images: string[];
};

type GalleryFilter = "all" | "outdoor" | "treehouse" | "cuisine";

export default function GalleryPhotoExplorer({ images }: GalleryPhotoExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");

  const filteredImages = useMemo(() => {
    if (activeFilter === "outdoor") {
      return images.filter((src) => src.toLowerCase().includes("/images/outdoor/"));
    }

    if (activeFilter === "treehouse") {
      return images.filter((src) => src.toLowerCase().includes("/images/treehouse/"));
    }

    if (activeFilter === "cuisine") {
      return images.filter((src) => {
        const path = src.toLowerCase();
        return path.includes("/images/food/") || path.includes("/images/menu/");
      });
    }

    return images;
  }, [activeFilter, images]);

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
            className="rounded-full border border-[#CBBDA7] bg-[#FFF9F0] px-5 py-2 text-sm font-semibold text-[#2D3F2B] transition hover:border-[#2D3F2B]"
          >
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
            className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left"
          >
            <Image
              src={src}
              alt="Heritage Family Restaurant gallery photo"
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
