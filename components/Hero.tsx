"use client";

import Image from "next/image";
import { Alex_Brush } from "next/font/google";

const alexBrush = Alex_Brush({ weight: "400", subsets: ["latin"] });

type HeroProps = {
  imageSrc: string;
};

export default function Hero({ imageSrc }: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="Heritage Family Restaurant"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center pb-20 text-center leading-none">
        <h1
          className={`${alexBrush.className} mb-4 text-8xl font-bold text-[#be8040] md:text-[10rem]`}
          style={{
            animation: "fadeUp 0.5s forwards",
            animationDelay: "0.3s",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          Welcome
        </h1>
        
        <h2
          className="m-0 text-4xl font-bold uppercase tracking-[5px] md:text-6xl"
          style={{
            animation: "fadeScale 0.5s forwards",
            opacity: 0,
            transform: "scale(2)",
          }}
        >
          Heritage Family Restaurant
        </h2>
        
        <div className="animated-asterisk my-3 flex w-full max-w-[200px] items-center justify-center text-5xl font-bold text-[#be8040] md:max-w-[400px]">
          <span
            style={{
              animation: "spin 0.5s forwards",
              animationDelay: "0.3s",
              opacity: 0,
              transformOrigin: "center center",
            }}
          >
            *
          </span>
        </div>
        
        <p
          className="m-0 text-lg font-bold uppercase tracking-[4px] md:text-2xl"
          style={{
            animation: "fadeDown 0.9s forwards",
            animationDelay: "1.3s",
            opacity: 0,
            transform: "translateY(-40px)",
          }}
        >
          An elevated riverside dining experience
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animated-asterisk::before, .animated-asterisk::after {
          content: "";
          display: inline-block;
          height: 1px;
          width: 0%;
          opacity: 0;
          background: white;
          animation: growLine 0.5s forwards;
          animation-delay: 0.8s;
        }
        .animated-asterisk::before { margin-right: 20px; }
        .animated-asterisk::after { margin-left: 20px; }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          0% { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeDown {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes growLine {
          0% { opacity: 0; width: 0%; }
          50% { opacity: 0.5; }
          100% { opacity: 1; width: 40%; }
        }
        @keyframes spin {
          0% { transform: rotate(0); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 1; }
        }
      `}} />
    </section>
  );
}