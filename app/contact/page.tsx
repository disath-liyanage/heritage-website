import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Reserve a Table | Heritage Family Restaurant, Yatiyanthota",
  description:
    "Book a table at Heritage Family Restaurant or reserve The Magical Tree House. Located in Thunkinda, Yatiyanthota, beside the Kelani River. Call +94 71 693 9224.",
  alternates: {
    canonical: "https://www.heritagefamilyrest.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-36">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Plan Your Visit</p>
        <h1 className="mt-3 font-display text-5xl text-[#1F2D21] md:text-6xl">Contact Us</h1>
      </section>
      <MapSection />
      <Footer />
    </main>
  );
}
