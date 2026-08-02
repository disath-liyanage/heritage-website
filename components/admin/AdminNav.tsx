"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8ccb8]/30 bg-[#f5f0e8]/90 shadow-sm backdrop-blur-[20px]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 relative">
        <Link href="/admin/menu" aria-label="Admin Home" onClick={closeMenu}>
          <Image
            src="/images/logo-tr.png"
            alt="Heritage Family Restaurant logo"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="/admin/menu"
            className={`relative px-1 py-1 text-sm transition-all duration-300 ${
              pathname.includes("/admin/menu")
                ? "font-bold text-[#1f2a20] after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1f2a20] after:content-['']"
                : "font-semibold text-[#1f2a20] hover:font-bold"
            }`}
          >
            Menu
          </Link>
          <Link
            href="/admin/gallery"
            className={`relative px-1 py-1 text-sm transition-all duration-300 ${
              pathname.includes("/admin/gallery")
                ? "font-bold text-[#1f2a20] after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1f2a20] after:content-['']"
                : "font-semibold text-[#1f2a20] hover:font-bold"
            }`}
          >
            Gallery
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="hidden rounded-full border border-red-600 px-5 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white md:block"
        >
          Logout
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block p-2 text-[#1f2a20] md:hidden"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-[#d8ccb8]/30 bg-[#f5f0e8] px-6 py-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-6">
            <Link
              href="/admin/menu"
              onClick={closeMenu}
              className={`text-lg ${
                pathname.includes("/admin/menu")
                  ? "font-bold text-[#1f2a20]"
                  : "font-semibold text-[#1f2a20]/70"
              }`}
            >
              Menu
            </Link>
            <Link
              href="/admin/gallery"
              onClick={closeMenu}
              className={`text-lg ${
                pathname.includes("/admin/gallery")
                  ? "font-bold text-[#1f2a20]"
                  : "font-semibold text-[#1f2a20]/70"
              }`}
            >
              Gallery
            </Link>
            
            <div className="pt-4 border-t border-[#d8ccb8]/50 mt-2">
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full rounded-full border border-red-600 bg-transparent px-5 py-3 text-center font-bold text-red-600 transition-all active:bg-red-600 active:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}