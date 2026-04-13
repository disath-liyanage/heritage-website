import fs from "node:fs";
import path from "node:path";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import PhotoCarousel from "@/components/PhotoCarousel";
import Reviews from "@/components/Reviews";
import TreeHouseSection from "@/components/TreeHouseSection";
import getReviews from "@/lib/getReviews";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function getAllImageFiles(dir: string, relative = ""): string[] {
  const entries = fs.readdirSync(path.join(dir, relative), { withFileTypes: true });
  const collected: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const relativePath = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      collected.push(...getAllImageFiles(dir, relativePath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext) && entry.name.toLowerCase() !== "logo.jpeg") {
      const srcPath = `/${path.join("images", relativePath).split(path.sep).join("/")}`;
      collected.push(encodeURI(srcPath));
    }
  }

  return collected;
}

export default async function Page() {
  const imageRoot = path.join(process.cwd(), "public", "images");
  const discoveredImages = fs.existsSync(imageRoot) ? getAllImageFiles(imageRoot) : [];

  const images = discoveredImages.length ? discoveredImages : ["/images/outdoor/river.jpeg"];
  const heroImage = images[0];
  const treeHouseImage = images[1] ?? images[0];
  const reviewData = await getReviews();

  return (
    <main className="bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <Hero imageSrc={heroImage} />
      <PhotoCarousel images={images} />
      <TreeHouseSection imageSrc={treeHouseImage} />
      <Reviews
        reviews={reviewData.reviews}
        overallRating={reviewData.overallRating}
        reviewCount={reviewData.totalRatings}
      />
      <MapSection />
      <Footer />
    </main>
  );
}
