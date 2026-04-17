import type { Metadata } from "next";
import Footer from "@/components/Footer";
import GalleryPhotoExplorer from "@/components/GalleryPhotoExplorer";
import Navbar from "@/components/Navbar";
import getDiscoveredImages from "@/lib/getImageFiles";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gallery | Heritage Family Restaurant & The Magical Tree House",
  description:
    "Browse photos of Heritage Family Restaurant and The Magical Tree House — riverside dining, treetop views, and Sri Lankan cuisine in Yatiyanthota.",
  alternates: {
    canonical: "https://www.heritagefamilyrest.com/gallery",
  },
};

export default function GalleryPage() {
  const images = getDiscoveredImages();

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-6 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Life at Heritage</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">Gallery</h1>
        <p className="mt-4 max-w-3xl text-sm text-[#2A3A2D]/85 md:text-base">
          Moments from our riverside restaurant, tree house, and family dining spaces.
        </p>
      </section>

      <Suspense fallback={<section className="mx-auto max-w-7xl px-6 pb-20 text-[#2A3A2D]/75">Loading gallery...</section>}>
        <GalleryPhotoExplorer images={images} />
      </Suspense>

      <Footer />
    </main>
  );
}
