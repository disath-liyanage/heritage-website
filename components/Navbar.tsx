"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { id: "home", href: "/#home", label: "Home" },
  { id: "gallery", href: "/#gallery", label: "Gallery" },
  { id: "treehouse", href: "/#treehouse", label: "Tree House" },
  { id: "menu", href: "/#menu", label: "Menu" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const isHomePage = pathname === "/";
  
  const showBackground = !isHomePage || isScrolled;
  const showHomeLink = !isHomePage || isScrolled;

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 50);
      
      if (currentScroll < 200) {
        setActiveSection("home");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY >= 200) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHomePage]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 font-[family:var(--font-body)] ${
        showBackground
          ? "bg-[#0f0f0f]/45 backdrop-blur-[12px] backdrop-saturate-[140%] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 transition-all duration-300"
        aria-label="Main navigation"
      >
        <Link href={isHomePage ? "/#home" : "/"} aria-label="Heritage Family Restaurant home">
          <Image
            src="/images/logo.jpeg"
            alt="Heritage Family Restaurant logo"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            if (link.id === "home" && !showHomeLink) return null;

            const isActive = isHomePage && isScrolled && activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative text-sm whitespace-nowrap transition-all duration-300 px-1 py-1 ${
                  isActive
                    ? "text-white font-bold drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[1px] after:bg-white after:opacity-70"
                    : "text-gray-300 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] hover:text-white hover:font-bold hover:drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link
            href="/#contact"
            className="rounded-full border border-white/80 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black hover:border-white shadow-sm"
          >
            Reserve a table
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded text-white md:hidden hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#0f0f0f]/95 backdrop-blur-[12px] px-6 py-4 md:hidden shadow-lg">
          <ul className="flex flex-col gap-3">
            {links.map((link) => {
              if (link.id === "home" && !showHomeLink) return null;
              
              const isActive = isHomePage && isScrolled && activeSection === link.id;
              
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`block py-2 transition-colors ${
                      isActive ? "font-bold text-white border-l-2 border-white pl-3" : "text-gray-300 font-medium pl-3 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-4 mb-2">
              <Link
                href="/#contact"
                className="inline-flex w-full justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all"
                onClick={() => setIsOpen(false)}
              >
                Reserve a table
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}