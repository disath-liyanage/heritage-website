import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TreeHouseSection from "@/components/TreeHouseSection";
import getDiscoveredImages from "@/lib/getImageFiles";

export const metadata: Metadata = {
  title: "The Magical Tree House | Treetop Dining by the Kelani River — Heritage Family Restaurant",
  description:
    "Experience treetop dining at The Magical Tree House by Heritage Family Restaurant. Perched above the Kelani River in Yatiyanthota near Kithulgala, Sri Lanka.",
  alternates: {
    canonical: "https://www.heritagefamilyrest.com/treehouse",
  },
};

export default function TreeHousePage() {
  const images = getDiscoveredImages();
  const treeHouseImage = images.find((src) => src.startsWith("/images/TreeHouse/")) ?? images[0];

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Our Signature Experience</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">
          The Magical Tree House by Heritage Family Restaurant
        </h1>
      </section>
      <TreeHouseSection imageSrc={treeHouseImage} />
      <Footer />
    </main>
  );
}
