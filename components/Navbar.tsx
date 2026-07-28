"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { id: "home", href: "/#home", label: "Home" },
  { id: "gallery", href: "/#gallery", label: "Gallery" },
  { id: "treehouse", href: "/#treehouse", label: "Tree House" },
  { id: "reviews", href: "/#reviews", label: "Reviews" },
  { id: "find", href: "/#find", label: "Find Us" },
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
      setIsScrolled(window.scrollY > 50);
      
      if (window.scrollY < 200) {
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
      style={{ fontFamily: "'Google Sans', var(--font-body), sans-serif" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        showBackground
          ? "bg-[#f5f0e8]/40 backdrop-blur-[20px] backdrop-saturate-[140%] border-b border-[#d8ccb8]/30 shadow-sm"
          : "bg-transparent pointer-events-none"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 transition-all duration-300 pointer-events-auto"
        aria-label="Main navigation"
      >
        <Link href={isHomePage ? "/#home" : "/"} aria-label="Heritage Family Restaurant home">
          <Image
            src="/images/logo.jpeg"
            alt="Heritage Family Restaurant logo"
            width={160}
            height={48}
            className={`h-12 w-auto object-contain transition-all duration-300 ${
              !showBackground ? "mix-blend-difference" : ""
            }`}
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            if (link.id === "home" && !showHomeLink) return null;

            const isActive = isHomePage && activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative text-sm whitespace-nowrap transition-all duration-300 px-1 py-1 ${
                  showBackground
                    ?
                      isActive
                        ? "text-[#1f2a20] font-bold after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[2px] after:bg-[#1f2a20]"
                        : "text-[#1f2a20] font-semibold hover:font-bold"
                    :
                      isActive
                        ? "text-white mix-blend-difference font-bold after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[2px] after:bg-white"
                        : "text-white mix-blend-difference font-semibold hover:font-bold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link
            href="/treehouse/#reserve"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all shadow-sm ${
              showBackground
                ? "border-[#1f2a20] text-[#1f2a20] hover:bg-[#1f2a20] hover:text-[#f5f0e8]"
                : "border-white text-white mix-blend-difference hover:bg-white hover:text-black hover:mix-blend-normal"
            }`}
          >
            Reserve a Stay
          </Link>
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded md:hidden transition-colors ${
            showBackground
              ? "text-[#1f2a20] hover:bg-[#1f2a20]/10"
              : "text-white mix-blend-difference hover:bg-white/20"
          }`}
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
        <div className="border-t border-[#d8ccb8]/30 bg-[#f5f0e8]/95 backdrop-blur-[20px] px-6 py-4 md:hidden shadow-lg pointer-events-auto">
          <ul className="flex flex-col gap-3">
            {links.map((link) => {
              if (link.id === "home" && !showHomeLink) return null;
              
              const isActive = isHomePage && activeSection === link.id;
              
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`block py-2 transition-colors ${
                      isActive 
                        ? "font-bold text-[#1f2a20] border-l-2 border-[#1f2a20] pl-3" 
                        : "text-[#1f2a20] font-medium pl-3 hover:font-bold"
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
                className="inline-flex w-full justify-center rounded-full border border-[#1f2a20] px-5 py-3 text-sm font-semibold text-[#1f2a20] hover:bg-[#1f2a20] hover:text-[#f5f0e8] transition-all shadow-sm"
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