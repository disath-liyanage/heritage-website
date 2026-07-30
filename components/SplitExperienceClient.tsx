"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SplitExperienceClientProps {
  bedImage: string;
  tableImage: string;
}

export default function SplitExperienceClient({ bedImage, tableImage }: SplitExperienceClientProps) {
  const router = useRouter();
  const [expanding, setExpanding] = useState<string | null>(null);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>, 
    path: string, 
    section: string
  ) => {
    e.preventDefault();
    if (expanding) return; 
    
    setExpanding(section);
    
    setTimeout(() => {
      router.push(path);
    }, 900); 
  };

  const safeBedImage = bedImage || "/images/treehouse/bed.jpeg";
  const safeTableImage = tableImage || "/images/treehouse/table.jpeg";

  return (
    <section 
      className="flex flex-col md:flex-row h-[70vh] min-h-[500px] w-full gap-2 p-2 bg-transparent overflow-hidden" 
      id="treehouse"
    >
      
      <a
        href="/treehouse"
        onClick={(e) => handleNavigation(e, "/treehouse", "treehouse")}
        className={`group relative flex items-center justify-center overflow-hidden z-0 rounded-3xl [-webkit-mask-image:-webkit-radial-gradient(white,black)] [mask-image:radial-gradient(white,black)] transition-all ease-in-out cursor-pointer ${
          expanding ? "duration-[1500ms]" : "duration-700"
        } ${
          expanding === "treehouse"
            ? "flex-[100] opacity-100"
            : expanding === "menu"
            ? "flex-[0.01] opacity-0 pointer-events-none"
            : "flex-1 hover:flex-[1.5]"
        }`}
        aria-label="Explore Tree House"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src={safeBedImage}
            alt="Explore the Tree House"
            fill
            className={`object-cover transition-transform ease-in-out group-hover:scale-110 group-hover:translate-x-4 ${
              expanding ? "duration-[1500ms]" : "duration-1000"
            } ${
              expanding === "treehouse" ? "scale-110 translate-x-4" : ""
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div 
            className={`absolute inset-0 transition-colors group-hover:bg-black/50 ${
              expanding ? "duration-[1500ms]" : "duration-500"
            } ${
              expanding === "treehouse" ? "bg-black/50" : "bg-black/40"
            }`} 
          />
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl tracking-wide">
            Explore Tree House
          </h2>
          <span 
            className={`mt-6 rounded-full backdrop-blur-md border border-white/40 px-8 py-3 text-sm font-semibold transition-all duration-500 group-hover:bg-white group-hover:text-black ${
              expanding === "treehouse" ? "bg-white text-black" : "bg-white/25 text-white"
            }`}
          >
            Visit the Tree House
          </span>
        </div>
      </a>

      <a
        href="/menu"
        onClick={(e) => handleNavigation(e, "/menu", "menu")}
        className={`group relative flex items-center justify-center overflow-hidden z-0 rounded-3xl [-webkit-mask-image:-webkit-radial-gradient(white,black)] [mask-image:radial-gradient(white,black)] transition-all ease-in-out cursor-pointer ${
          expanding ? "duration-[1500ms]" : "duration-700"
        } ${
          expanding === "menu"
            ? "flex-[100] opacity-100"
            : expanding === "treehouse"
            ? "flex-[0.01] opacity-0 pointer-events-none"
            : "flex-1 hover:flex-[1.5]"
        }`}
        aria-label="The Kitchen"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src={safeTableImage} 
            alt="View Our Menu"
            fill
            className={`object-cover transition-transform ease-in-out group-hover:scale-110 group-hover:-translate-x-4 ${
              expanding ? "duration-[1500ms]" : "duration-1000"
            } ${
              expanding === "menu" ? "scale-110 -translate-x-4" : ""
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div 
            className={`absolute inset-0 transition-colors group-hover:bg-black/60 ${
              expanding ? "duration-[1500ms]" : "duration-500"
            } ${
              expanding === "menu" ? "bg-black/60" : "bg-black/40"
            }`} 
          />
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl tracking-wide transition-transform duration-500 group-hover:-translate-y-2">
            The Kitchen
          </h2>
          <span 
            className={`mt-6 rounded-full backdrop-blur-md border border-white/40 px-8 py-3 text-sm font-semibold transition-all duration-500 group-hover:bg-white group-hover:text-black ${
              expanding === "menu" ? "bg-white text-black" : "bg-white/25 text-white"
            }`}
          >
            See What's Cooking
          </span>
        </div>
      </a>

    </section>
  );
}