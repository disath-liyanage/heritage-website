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

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const sections = links
      .map((link) => document.getElementById(link.id))
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
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHomePage]);

  return (
    <header
      style={{
        fontFamily: "'Google Sans', var(--font-body), sans-serif",
      }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        showBackground
          ? "border-b border-[#d8ccb8]/30 bg-[#f5f0e8]/40 shadow-sm backdrop-blur-[20px] backdrop-saturate-[140%]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 transition-all duration-300"
        aria-label="Main navigation"
      >
        <Link
          href={isHomePage ? "/#home" : "/"}
          aria-label="Heritage Family Restaurant home"
        >
          <Image
            src="/images/logo-tr.png"
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

            const isActive =
              isHomePage && activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative whitespace-nowrap px-1 py-1 text-sm transition-all duration-300 ${
                  showBackground
                    ? isActive
                      ? "font-bold text-[#1f2a20] after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1f2a20] after:content-['']"
                      : "font-semibold text-[#1f2a20] hover:font-bold"
                    : isActive
                      ? "font-bold text-white after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[2px] after:bg-white after:content-['']"
                      : "font-semibold text-white hover:font-bold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/treehouse/#reserve"
            className={`rounded-full border px-5 py-2 text-sm transition-all shadow-sm ${
              showBackground
                ? "border-[#007848] bg-[#007848] font-bold text-white hover:bg-[#005f39]"
                : "border-white bg-transparent font-semibold text-white hover:bg-white hover:text-[#007848]"
            }`}
          >
            Reserve a Stay
          </Link>
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded transition-colors md:hidden ${
            showBackground
              ? "text-[#1f2a20] hover:bg-[#1f2a20]/10"
              : "text-white hover:bg-white/20"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>

          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18M3 18h18"
              />
            )}
          </svg>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-[#d8ccb8]/30 bg-[#f5f0e8]/95 px-6 py-4 shadow-lg backdrop-blur-[20px] md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => {
              if (link.id === "home" && !showHomeLink) return null;

              const isActive =
                isHomePage && activeSection === link.id;

              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`block py-2 pl-3 transition-colors ${
                      isActive
                        ? "border-l-2 border-[#007848] font-bold text-[#007848]"
                        : "font-medium text-[#1f2a20] hover:font-bold"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li className="mb-2 mt-4">
              <Link
                href="/treehouse/#reserve"
                className="inline-flex w-full justify-center rounded-full border border-[#007848] bg-[#007848] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#005f39]"
                onClick={() => setIsOpen(false)}
              >
                Reserve a Stay
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}