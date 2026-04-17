import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import getDiscoveredImages from "@/lib/getImageFiles";

export default function GalleryPage() {
  const images = getDiscoveredImages();

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Life at Heritage</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">Gallery</h1>
        <p className="mt-4 max-w-3xl text-sm text-[#2A3A2D]/85 md:text-base">
          Moments from our riverside restaurant, tree house, and family dining spaces.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src) => (
          <article key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={src}
              alt="Heritage Family Restaurant gallery photo"
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
