"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroProps = {
  imageSrc: string;
};

export default function Hero({ imageSrc }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    const updateViewport = () => {
      setIsDesktop(desktopQuery.matches);
    };

    updateViewport();
    desktopQuery.addEventListener("change", updateViewport);

    return () => {
      desktopQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId: number | null = null;

    const updateProgress = () => {
      if (mediaQuery.matches || !isDesktop) {
        setProgress(0);
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
      const currentScroll = Math.min(Math.max(-rect.top, 0), maxScroll);
      setProgress(currentScroll / maxScroll);
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateProgress();
        rafId = null;
      });
    };

    updateProgress();
    if (isDesktop) {
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize);
      mediaQuery.addEventListener("change", onScrollOrResize);
    }

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      mediaQuery.removeEventListener("change", onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isDesktop]);

  const frameHeight = isDesktop ? `${44 + progress * 56}vh` : "38vh";
  const frameWidth = isDesktop ? `${76 + progress * 24}vw` : "92vw";
  const frameRadius = isDesktop ? `${Math.max(0, 26 - progress * 26)}px` : "20px";
  const headingOpacity = isDesktop ? Math.max(0, 1 - progress * 1.5) : 1;
  const headingTranslateY = isDesktop ? `${progress * 34}px` : "0px";
  const overlayOpacity = isDesktop ? Math.max(0.2, 0.42 - progress * 0.18) : 0.34;

  return (
    <section
      ref={sectionRef}
      className={`hero-scroll-root relative ${isDesktop ? "min-h-[210vh]" : "min-h-screen"}`}
      aria-label="Hero section"
    >
      <div
        className={`hero-scroll-stage flex items-center justify-center overflow-hidden bg-[#101913] ${
          isDesktop ? "sticky top-0 h-screen" : "min-h-screen py-24"
        }`}
      >
        <div className="hero-fade-in relative z-10 flex w-full flex-col items-center px-4 md:px-6">
          <div
            className="hero-image-frame relative overflow-hidden border border-white/20 shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
            style={{
              width: frameWidth,
              height: frameHeight,
              borderRadius: frameRadius,
            }}
          >
            <Image
              src={imageSrc}
              alt="Heritage Family Restaurant riverside view, Yatiyanthota"
              fill
              priority
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
            />
          </div>

          <div
            className="mt-7 text-center text-[#F5F0E8]"
            style={{
              opacity: headingOpacity,
              transform: `translateY(${headingTranslateY})`,
            }}
          >
            <p className="mb-0 text-xs uppercase tracking-[0.25em] md:text-sm">
              Thunkinda | Yatiyanthota
            </p>
            <h1 className="font-body text-3xl font-bold leading-tight tracking-[0.01em] md:text-7xl">
              HERITAGE FAMILY RESTAURANT
            </h1>

            <div className="mx-auto mt-5 flex w-full max-w-[360px] flex-nowrap items-center justify-center gap-2 md:mt-8 md:max-w-none md:gap-4">
              <a
                href="#contact"
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#C9A96E] px-2.5 py-2 text-[11px] font-medium text-[#1C2B1E] transition hover:bg-[#B89659] md:flex-none md:px-7 md:py-3 md:text-sm"
              >
                Reserve a table
              </a>
              <a
                href="#treehouse"
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border border-[#F5F0E8] px-2.5 py-2 text-[11px] font-medium text-[#F5F0E8] transition hover:bg-[#F5F0E8] hover:text-[#1C2B1E] md:flex-none md:px-7 md:py-3 md:text-sm"
              >
                Explore the Tree House
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
