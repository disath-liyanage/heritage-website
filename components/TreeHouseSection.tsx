import Image from "next/image";
import Link from "next/link";

type TreeHouseSectionProps = {
  imageSrc: string;
};

const features = [
  "Treetop dining with Kelani River views",
  "Available for lunch and dinner",
  "Ideal for families and special occasions",
  "Located in Thunkinda, Yatiyanthota near Kithulgala",
];

export default function TreeHouseSection({ imageSrc }: TreeHouseSectionProps) {
  return (
    <section id="treehouse" className="bg-[#FAF6EF] py-20" aria-label="Tree House section">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Our signature experience</p>
          <h2 className="mt-4 font-display text-4xl text-[#1C2B1E] md:text-5xl">
            The Magical Tree House by Heritage Family Restaurant
          </h2>
          <p className="mt-6 max-w-xl text-[#3E493E]">
            Perched above the Kelani River in the lush forests of Yatiyanthota, The Magical Tree House offers a one-of-a-kind dining experience. Perfect for families, couples, and nature lovers - reserve your table in the treetops today.
          </p>

          <ul className="mt-6 space-y-3 text-[#2F3A30]">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 text-[#507341]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 2c5.523 0 10 4.477 10 10 0 4.97-3.622 9.094-8.373 9.878L12 22l-1.627-.122C5.622 21.094 2 16.97 2 12 2 6.477 6.477 2 12 2Zm2.72 5.183c-4.168 1.563-7.092 4.596-8.265 8.807 3.927-.916 7.143-3.812 8.265-8.807Z" />
                  </svg>
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#2E4830] px-7 py-3 text-sm font-semibold text-[#F5F0E8] transition hover:bg-[#1C2B1E]"
          >
            Reserve the Tree House
          </Link>
        </div>

        <div className="relative h-105 overflow-hidden rounded-lg shadow-lg">
          <Image
            src={imageSrc}
            alt="The Magical Tree House by Heritage Family Restaurant, Yatiyanthota"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
