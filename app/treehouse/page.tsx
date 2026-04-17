import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TreeHouseSection from "@/components/TreeHouseSection";
import getDiscoveredImages from "@/lib/getImageFiles";

export default function TreeHousePage() {
  const images = getDiscoveredImages();
  const treeHouseImage = images.find((src) => src.startsWith("/images/TreeHouse/")) ?? images[0];

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Our Signature Experience</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">The Magical Tree House</h1>
      </section>
      <TreeHouseSection imageSrc={treeHouseImage} />
      <Footer />
    </main>
  );
}
