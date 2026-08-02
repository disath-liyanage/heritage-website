"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";
import { GalleryPhoto } from "@/lib/types/gallery";

type GalleryPhotoExplorerProps = {
  photos: GalleryPhoto[];
};

function getGalleryImageAlt(categoryString: string) {
  const lowerCat = categoryString?.toLowerCase() || "";
  if (lowerCat.includes("treehouse")) {
    return "The Magical Tree House by Heritage Family Restaurant, Yatiyanthota";
  }
  if (lowerCat.includes("outdoor")) {
    return "Kelani River view at Heritage Family Restaurant, Yatiyanthota";
  }
  if (lowerCat.includes("food") || lowerCat.includes("menu") || lowerCat.includes("cuisine")) {
    return "Sri Lankan cuisine at Heritage Family Restaurant, Yatiyanthota";
  }
  return "Heritage Family Restaurant riverside view, Yatiyanthota";
}

export default function GalleryPhotoExplorer({ photos }: GalleryPhotoExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sessionOrderedPhotos, setSessionOrderedPhotos] = useState<GalleryPhoto[]>(photos);

  const uniqueCategories = useMemo(() => {
    const tags = photos.flatMap((p) =>
      (p.category || "").split(",").map((cat) => cat.trim()).filter(Boolean)
    );
    return Array.from(new Set(tags)).sort();
  }, [photos]);

  useEffect(() => {
    if (!photos.length) {
      setSessionOrderedPhotos([]);
      return;
    }

    const storageKey = "heritage:gallery-order:v2";

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsedIds = JSON.parse(stored);
        if (Array.isArray(parsedIds)) {
          const persisted = parsedIds
            .map((id) => photos.find((p) => p.id === id))
            .filter((p): p is GalleryPhoto => p !== undefined);
            
          const missing = photos.filter((p) => !parsedIds.includes(p.id));
          const merged = [...persisted, ...missing];

          if (merged.length === photos.length) {
            setSessionOrderedPhotos(merged);
            return;
          }
        }
      }

      const shuffled = [...photos];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      sessionStorage.setItem(storageKey, JSON.stringify(shuffled.map((p) => p.id)));
      setSessionOrderedPhotos(shuffled);
    } catch {
      setSessionOrderedPhotos(photos);
    }
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (activeFilter === "all") {
      return sessionOrderedPhotos;
    }
    return sessionOrderedPhotos.filter((p) => {
      const tags = (p.category || "").split(",").map((c) => c.trim());
      return tags.includes(activeFilter);
    });
  }, [activeFilter, sessionOrderedPhotos]);

  const selectedPhotoId = searchParams.get("photo");
  const selectedIndex = selectedPhotoId ? filteredPhotos.findIndex((p) => p.id === selectedPhotoId) : -1;

  const replaceQueryWithPhoto = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (id) {
        next.set("photo", id);
      } else {
        next.delete("photo");
      }

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const openPhoto = useCallback((index: number) => {
    replaceQueryWithPhoto(filteredPhotos[index].id);
  }, [filteredPhotos, replaceQueryWithPhoto]);

  const closePhoto = useCallback(() => {
    replaceQueryWithPhoto(null);
  }, [replaceQueryWithPhoto]);

  const showPrev = useCallback(() => {
    if (selectedIndex < 0) return;
    const nextIndex = (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    replaceQueryWithPhoto(filteredPhotos[nextIndex].id);
  }, [filteredPhotos, replaceQueryWithPhoto, selectedIndex]);

  const showNext = useCallback(() => {
    if (selectedIndex < 0) return;
    const nextIndex = (selectedIndex + 1) % filteredPhotos.length;
    replaceQueryWithPhoto(filteredPhotos[nextIndex].id);
  }, [filteredPhotos, replaceQueryWithPhoto, selectedIndex]);

  const setFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
    replaceQueryWithPhoto(null);
  }, [replaceQueryWithPhoto]);

  return (
    <>
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap gap-3 px-6">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full border px-5 py-2 text-sm font-bold capitalize transition-all ${
            activeFilter === "all"
              ? "border-[#007848] bg-[#E6F0EB]/90 text-[#007848] shadow-sm"
              : "border-[#CBBDA7] bg-transparent text-[#1F2D21] hover:border-[#007848] hover:bg-[#E6F0EB]/30 hover:text-[#007848]"
          }`}
        >
          All Photos
        </button>

        {uniqueCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`rounded-full border px-5 py-2 text-sm font-bold capitalize transition-all ${
              activeFilter === category
                ? "border-[#007848] bg-[#E6F0EB]/90 text-[#007848] shadow-sm"
                : "border-[#CBBDA7] bg-transparent text-[#1F2D21] hover:border-[#007848] hover:bg-[#E6F0EB]/30 hover:text-[#007848]"
            }`}
          >
            {category.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(index)}
            aria-label={`Open photo ${index + 1}`}
            className="group relative aspect-4/3 overflow-hidden rounded-xl text-left"
          >
            <Image
              src={photo.image_url}
              alt={getGalleryImageAlt(photo.category)}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ))}
      </section>

      {selectedIndex >= 0 && (
        <PhotoLightbox
          photos={filteredPhotos}
          selectedIndex={selectedIndex}
          onBack={closePhoto}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
}