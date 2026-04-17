import Image from "next/image";

type HeroProps = {
  imageSrc: string;
};

export default function Hero({ imageSrc }: HeroProps) {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden" aria-label="Hero section">
      <Image
        src={imageSrc}
        alt="Heritage Family Restaurant riverside view, Yatiyanthota"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="hero-fade-in relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center text-[#F5F0E8]">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] md:text-sm">
          Thunkinda, Yatiyanthota · Kelani River
        </p>
        <h1 className="font-display text-5xl leading-tight italic md:text-7xl">
          Heritage Family Restaurant
        </h1>
        <p className="mt-4 text-xs uppercase tracking-[0.45em] md:text-sm">Where the forest meets the river</p>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-[#F5F0E8]/90 md:text-lg">
          Heritage Family Restaurant offers a riverside dining experience with lunch, dinner, and The Magical Tree House - nestled in nature by the Kelani River.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-full bg-[#C9A96E] px-7 py-3 text-sm font-semibold text-[#1C2B1E] transition hover:bg-[#B89659]"
          >
            Reserve a table
          </a>
          <a
            href="#treehouse"
            className="rounded-full border border-[#F5F0E8] px-7 py-3 text-sm font-semibold text-[#F5F0E8] transition hover:bg-[#F5F0E8] hover:text-[#1C2B1E]"
          >
            Explore the Tree House
          </a>
        </div>
      </div>
    </section>
  );
}
