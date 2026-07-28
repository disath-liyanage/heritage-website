import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MenuPhotoExplorer from "@/components/MenuPhotoExplorer";
import Navbar from "@/components/Navbar";
import getDiscoveredImages from "@/lib/getImageFiles";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Menu | Sri Lankan Cuisine — Heritage Family Restaurant, Yatiyanthota",
  description:
    "Explore the menu at Heritage Family Restaurant. Authentic Sri Lankan food served riverside in Yatiyanthota, near Kithulgala.",
  alternates: {
    canonical: "https://www.heritagefamilyrest.com/menu",
  },
};

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export default async function MenuPage() {
  const images = getDiscoveredImages();
  const safeImages = Array.isArray(images) ? images : [];

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .order("display_order")
    .order("display_order", { referencedTable: "menu_items" });

  const safeCategories = (categories ?? []).map((cat) => ({
    ...cat,
    menu_items: (cat.menu_items ?? []).filter(
      (item: { is_available: boolean }) => item.is_available
    ),
  }));

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-36">
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">Menu</h1>
        <p className="mt-4 max-w-3xl text-sm text-[#2A3A2D]/85 md:text-base">
          Freshly prepared Sri Lankan cuisine served riverside. Prices may vary by season.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 md:grid-cols-2">
        {safeCategories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-[#D8CCB8] bg-[#FFF9F0] p-6 shadow-sm"
          >
            <h2 className="font-display text-3xl text-[#1F2D21]">{category.name}</h2>
            {category.description && (
              <p className="mt-1 text-sm text-[#2A3A2D]/70">{category.description}</p>
            )}
            <ul className="mt-5 space-y-5">
              {category.menu_items.map((item: {
                id: string;
                name: string;
                description: string | null;
                price: number | null;
              }) => (
                <li key={item.id} className="border-b border-[#D8CCB8]/70 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[#223525]">{item.name}</h3>
                    {item.price != null && (
                      <p className="whitespace-nowrap text-sm font-semibold text-[#6A5A43]">
                        {currency.format(item.price)}
                      </p>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm text-[#2A3A2D]/75">{item.description}</p>
                  )}
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