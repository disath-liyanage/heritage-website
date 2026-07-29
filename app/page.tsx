import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reviews from "@/components/Reviews";
import TreeHouseSection from "@/components/TreeHouseSection";
import getDiscoveredImages from "@/lib/getImageFiles";
import { createClient } from "@/lib/supabase/server";
import { GalleryPhoto } from "@/lib/types/gallery";

export default async function Page() {
  const images = getDiscoveredImages();
  const preferredHeroImage = "/images/outdoor/Front.jpeg";
  const heroImage = images.includes(preferredHeroImage)
    ? preferredHeroImage
    : images[0];

  const treeHouseImage = images[1] ?? images[0];

  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  const typedPhotos = (photos as GalleryPhoto[]) || [];

  return (
    <main className="bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <Hero imageSrc={heroImage} />
      <PhotoCarousel photos={typedPhotos} />  
      <TreeHouseSection />
      <Reviews />
      <MapSection />
      <Footer />
    </main>
  );
}