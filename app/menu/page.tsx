import Footer from "@/components/Footer";
import MenuPhotoExplorer from "@/components/MenuPhotoExplorer";
import Navbar from "@/components/Navbar";
import getDiscoveredImages from "@/lib/getImageFiles";
import menuData from "@/lib/menuData";
import { Suspense } from "react";

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export default function MenuPage() {
  const images = getDiscoveredImages();
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Heritage Family Restaurant</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">Menu</h1>
        <p className="mt-4 max-w-3xl text-sm text-[#2A3A2D]/85 md:text-base">
          Explore our sample menu crafted for riverside dining. Items and prices are
          currently dummy content and can be replaced with your final menu details.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 md:grid-cols-2">
        {menuData.map((category) => (
          <article
            key={category.title}
            className="rounded-2xl border border-[#D8CCB8] bg-[#FFF9F0] p-6 shadow-sm"
          >
            <h2 className="font-display text-3xl text-[#1F2D21]">{category.title}</h2>
            <ul className="mt-5 space-y-5">
              {category.items.map((item) => (
                <li key={item.name} className="border-b border-[#D8CCB8]/70 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[#223525]">{item.name}</h3>
                    <p className="whitespace-nowrap text-sm font-semibold text-[#6A5A43]">
                      {currency.format(item.priceLkr)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-[#2A3A2D]/75">{item.description}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <Suspense fallback={<section className="mx-auto max-w-7xl px-6 pb-20 text-[#2A3A2D]/75">Loading photos...</section>}>
        <MenuPhotoExplorer images={safeImages} />
      </Suspense>

      <Footer />
    </main>
  );
}
