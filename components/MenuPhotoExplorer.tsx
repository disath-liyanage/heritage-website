"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";

type MenuPhotoExplorerProps = {
  images: string[];
};

export default function MenuPhotoExplorer({ images }: MenuPhotoExplorerProps) {
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

  const openPhoto = useCallback(
    (index: number) => {
      replaceQueryWithPhoto(images[index]);
    },
    [images, replaceQueryWithPhoto],
  );

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
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="font-display text-3xl text-[#1F2D21] md:text-4xl">Photo Highlights</h2>
        <p className="mt-2 text-sm text-[#2A3A2D]/75">
          Click a photo to view it in full size and navigate left or right.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.slice(0, 10).map((src) => {
            const index = images.indexOf(src);
            return (
              <button
                key={src}
                type="button"
                onClick={() => openPhoto(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg text-left"
              >
                <Image
                  src={src}
                  alt="Menu page photo"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </button>
            );
          })}
        </div>
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
