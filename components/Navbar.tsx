"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#gallery", label: "Menu" },
  { href: "#treehouse", label: "Tree House" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#D8CCB8] bg-[#F5F0E8]/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3"
        aria-label="Main navigation"
      >
        <Link href="#" aria-label="Heritage Family Restaurant home">
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
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-[#2D3F2B] hover:text-[#1C2B1E]"
                  : "text-[#F5F0E8] hover:text-[#E7DBC7]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              isScrolled
                ? "border-[#2D3F2B] text-[#2D3F2B] hover:bg-[#2D3F2B] hover:text-[#F5F0E8]"
                : "border-[#F5F0E8] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#1C2B1E]"
            }`}
          >
            Reserve a table
          </a>
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded md:hidden ${
            isScrolled ? "text-[#1C2B1E]" : "text-[#F5F0E8]"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-[#D8CCB8] bg-[#F5F0E8] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block py-1 text-[#2D3F2B]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="mt-2 inline-flex rounded-full border border-[#2D3F2B] px-5 py-2 text-sm font-semibold text-[#2D3F2B]"
                onClick={() => setIsOpen(false)}
              >
                Reserve a table
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
