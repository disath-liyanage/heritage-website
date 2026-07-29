import Image from "next/image";
import Link from "next/link";

export default function SplitExperienceSection() {
  return (
    <section className="flex flex-col md:flex-row h-[70vh] min-h-[500px] w-full gap-2 bg-transparent" id="treehouse">
      
      <Link
        href="/treehouse"
        className="group relative flex-1 flex items-center justify-center overflow-hidden z-0 rounded-b-3xl md:rounded-bl-none md:rounded-tr-3xl md:rounded-br-3xl [-webkit-mask-image:-webkit-radial-gradient(white,black)] [mask-image:radial-gradient(white,black)] transition-[flex] duration-700 ease-in-out hover:flex-[1.5] cursor-pointer"
        aria-label="Explore Tree House"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/treehouse/bed.jpeg"
            alt="Explore the Tree House"
            fill
            className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 group-hover:translate-x-8"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl tracking-wide">
            Explore Tree House
          </h2>
          <span className="mt-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
            Visit the Tree House
          </span>
        </div>
      </Link>

      <Link
        href="/menu"
        className="group relative flex-1 flex items-center justify-center overflow-hidden z-0 rounded-t-3xl md:rounded-tr-none md:rounded-tl-3xl md:rounded-bl-3xl [-webkit-mask-image:-webkit-radial-gradient(white,black)] [mask-image:radial-gradient(white,black)] transition-[flex] duration-700 ease-in-out hover:flex-[1.5] cursor-pointer"
        aria-label="View Menu"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/treehouse/table.jpeg" 
            alt="View Our Menu"
            fill
            className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 group-hover:-translate-x-8"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/60" />
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 text-center h-32 justify-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl tracking-wide transition-transform duration-500 group-hover:-translate-y-3">
            View Menu
          </h2>
          <span className="absolute bottom-4 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-gray-200 font-medium tracking-widest uppercase text-xs sm:text-sm">
            Click to view the menu page
          </span>
        </div>
      </Link>

    </section>
  );
}