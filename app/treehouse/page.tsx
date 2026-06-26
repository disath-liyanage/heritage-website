import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import getDiscoveredImages from "@/lib/getImageFiles";
import { FaAirbnb, FaTripadvisor } from "react-icons/fa";
import { SiBookingdotcom } from "react-icons/si";

export const metadata: Metadata = {
  title: "The Magical Tree House | Treetop Dining by the Kelani River - Heritage Family Restaurant",
  description:
    "Experience treetop dining at The Magical Tree House by Heritage Family Restaurant. Perched above the Kelani River in Yatiyanthota near Kithulgala, Sri Lanka.",
  alternates: {
    canonical: "https://www.heritagefamilyrest.com/treehouse",
  },
};

export default function TreeHousePage() {
  const images = getDiscoveredImages();
  
  const natureImage = images.find((src) => src.includes("outside")) ?? "/images/treehouse/nature.jpeg";
  const riverImage = images.find((src) => src.includes("river")) ?? "/images/treehouse/river.jpeg";
  const insideImage = images.find((src) => src.includes("bed") || src.includes("inside")) ?? "/images/treehouse/inside.jpeg";

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <Navbar />
      
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-36 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Our Signature Experience</p>
        <h1 className="mt-4 font-display text-5xl text-[#1F2D21] md:text-6xl max-w-4xl mx-auto">
          The Magical Tree House
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative h-[450px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={natureImage}
              alt="The exterior of the Magical Tree House nestled in the forest canopy"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="lg:pr-12">
            <h2 className="text-3xl font-display text-[#1F2D21] mb-6">Lost in the Canopy</h2>
            <p className="text-lg leading-relaxed text-[#3E493E] mb-6">
              Tucked away in the dense, vibrant wilderness of Yatiyanthota, the Tree House is designed to completely remove you from the noise of the outside world.
            </p>
            <p className="text-lg leading-relaxed text-[#3E493E]">
              We built this structure to seamlessly blend with the surrounding environment. From the moment you arrive, you are immersed in the raw beauty of the Sri Lankan jungle.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 lg:pl-12">
            <h2 className="text-3xl font-display text-[#1F2D21] mb-6">By the Kelani River</h2>
            <p className="text-lg leading-relaxed text-[#3E493E] mb-6">
              Location is everything. Perched directly above the banks of the pristine Kelani River, you get an uninterrupted, breathtaking view of the water rushing by.
            </p>
            <p className="text-lg leading-relaxed text-[#3E493E]">
              The constant, soothing sound of the river and the cool breeze rolling off the water create the perfect backdrop for a meal you won't forget anytime soon.
            </p>
          </div>
          <div className="relative h-[450px] w-full overflow-hidden rounded-2xl shadow-lg order-1 lg:order-2">
            <Image
              src={riverImage}
              alt="Breathtaking views of the Kelani River from the Tree House"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative h-[450px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={insideImage}
              alt="Cozy interior of the Magical Tree House"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="lg:pr-12">
            <h2 className="text-3xl font-display text-[#1F2D21] mb-6">Rustic Comfort</h2>
            <p className="text-lg leading-relaxed text-[#3E493E] mb-6">
              Step inside to a warm, intimate space designed for ultimate relaxation. The wooden interiors, soft lighting, and comfortable bedding create a cozy retreat.
            </p>
            <p className="text-lg leading-relaxed text-[#3E493E]">
              Whether you are waking up to the sounds of tropical birds or settling in for a quiet evening by the river, the interior gives you all the comfort you need without stripping away that authentic treehouse charm.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#1C2B1E] py-20 text-center text-[#F5F0E8] px-6 my-8">
        <h2 className="text-4xl font-display mb-4">See What's Cooking</h2>
        <p className="max-w-2xl mx-auto mb-10 text-[#A1B09F] text-lg">
          A view this good deserves food to match. Before you lock in your reservation, check out our menu packed with authentic, mouth-watering dishes.
        </p>
        
        <Link 
          href="/menu"
          className="group relative inline-block h-14 w-[260px] cursor-pointer rounded-full border border-[#F5F0E8] p-1 outline-none"
        >
          <span 
            className="absolute inset-y-1 left-1 block w-11 rounded-full bg-[#F5F0E8] transition-all duration-500 group-hover:w-[calc(100%-8px)]" 
            aria-hidden="true" 
          />
          <div className="absolute top-1/2 left-3.5 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-1 z-10">
            <svg className="h-6 w-6 text-[#1C2B1E]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </div>
          <span className="absolute top-1/2 left-1/2 ml-4 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-lg font-medium tracking-tight text-[#F5F0E8] transition-colors duration-500 group-hover:text-[#1C2B1E] z-10">
            Explore the Menu
          </span>
        </Link>
      </section>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-0 text-center">
        <h2 className="text-2xl font-display text-[#1F2D21] mb-8">Reserve Your Stay</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          
          <a href="https://www.booking.com/hotel/lk/the-magical-tree-house.en-gb.html" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#003B95] px-6 py-3 rounded-full text-white hover:bg-[#002b6e] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <SiBookingdotcom className="w-5 h-5" />
            Booking.com
          </a>

          <a href="https://www.airbnb.com/rooms/1475264680546928390" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#FF5A5F] px-6 py-3 rounded-full text-white hover:bg-[#E04E53] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <FaAirbnb className="w-5 h-5" />
            Airbnb
          </a>

          <a href="https://www.tripadvisor.com/Restaurant_Review-g26500862-d16898051-Reviews-Heritage_Family_Restaurant-Hakbellawaka_Sabaragamuwa_Province.html" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#00AF87] px-6 py-3 rounded-full text-white hover:bg-[#008C6C] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <FaTripadvisor className="w-5 h-5" />
            TripAdvisor
          </a>

        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://wa.me/94716939224" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#2E4830] hover:text-[#1F2D21] transition-colors font-semibold">
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <span className="text-[#D5C9B3] hidden sm:inline">|</span>
          <a href="tel:+94716939224" className="group flex items-center gap-2 text-[#2E4830] hover:text-[#1F2D21] transition-colors font-semibold">
            <svg className="w-5 h-5 text-[#2E4830]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            +94 71 693 9224
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}