import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reviews from "@/components/Reviews";
import TreeHouseSection from "@/components/TreeHouseSection";
import getDiscoveredImages from "@/lib/getImageFiles";

export default async function Page() {
  const images = getDiscoveredImages();
  const preferredHeroImage = "/images/outdoor/Front.jpeg";
  const heroImage = images.includes(preferredHeroImage)
    ? preferredHeroImage
    : images[0];

  const treeHouseImage = images[1] ?? images[0];

  return (
    <main className="bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <Hero imageSrc={heroImage} />
      <PhotoCarousel images={images} />
      <TreeHouseSection imageSrc={treeHouseImage} />
      <Reviews />
      <MapSection />
      <Footer />
    </main>
  );
}