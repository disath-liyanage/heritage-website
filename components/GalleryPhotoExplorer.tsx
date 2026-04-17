"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";

type GalleryPhotoExplorerProps = {
  images: string[];
};

export default function GalleryPhotoExplorer({ images }: GalleryPhotoExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPhoto = searchParams.get("photo");
  const selectedIndex = selectedPhoto ? images.indexOf(selectedPhoto) : -1;

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
    replaceQueryWithPhoto(images[index]);
  }, [images, replaceQueryWithPhoto]);

  const closePhoto = useCallback(() => {
    replaceQueryWithPhoto(null);
  }, [replaceQueryWithPhoto]);

  const showPrev = useCallback(() => {
    if (selectedIndex < 0) {
      return;
    }
    const nextIndex = (selectedIndex - 1 + images.length) % images.length;
    replaceQueryWithPhoto(images[nextIndex]);
  }, [images, replaceQueryWithPhoto, selectedIndex]);

  const showNext = useCallback(() => {
    if (selectedIndex < 0) {
      return;
    }
    const nextIndex = (selectedIndex + 1) % images.length;
    replaceQueryWithPhoto(images[nextIndex]);
  }, [images, replaceQueryWithPhoto, selectedIndex]);

  return (
    <>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, index) => (
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
          images={images}
          selectedIndex={selectedIndex}
          onBack={closePhoto}
          onPrev={showPrev}
          onNext={showNext}
        />
      ) : null}
    </>
  );
}
