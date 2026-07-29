"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GalleryPhoto } from "@/lib/types/gallery";

type MenuPhotoExplorerProps = {
  photos: GalleryPhoto[];
};

export default function MenuPhotoExplorer({ photos }: MenuPhotoExplorerProps) {
  const router = useRouter();
  
  const [sessionOrderedMenuPhotos, setSessionOrderedMenuPhotos] = useState<GalleryPhoto[]>(photos);

  useEffect(() => {
    if (!photos.length) {
      setSessionOrderedMenuPhotos([]);
      return;
    }

    const storageKey = "heritage:menu-food-order:v2"; 

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
            setSessionOrderedMenuPhotos(merged);
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
      setSessionOrderedMenuPhotos(shuffled);
    } catch {
      setSessionOrderedMenuPhotos(photos);
    }
  }, [photos]);

  const openInGallery = useCallback(
    (id: string) => {
      // Pass the database ID instead of the string path
      router.push(`/gallery?photo=${id}`);
    },
    [router],
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="font-display text-3xl text-[#1F2D21] md:text-4xl">Photo Highlights</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sessionOrderedMenuPhotos.slice(0, 10).map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => openInGallery(photo.id)}
              aria-label={`Open food photo ${index + 1} in gallery`}
              className="group relative aspect-4/3 overflow-hidden rounded-lg text-left"
            >
              <Image
                src={photo.image_url}
                alt="Sri Lankan cuisine at Heritage Family Restaurant, Yatiyanthota"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </button>
          ))}
        </div>

        {!photos.length ? (
          <p className="mt-4 text-sm text-[#2A3A2D]/70">No food photos available yet.</p>
        ) : null}
      </section>
    </>
  );
}