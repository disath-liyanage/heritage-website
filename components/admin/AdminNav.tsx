"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8ccb8]/30 bg-[#f5f0e8]/90 shadow-sm backdrop-blur-[20px]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 relative">
        <Link href="/admin/menu" aria-label="Admin Home">
          <Image
            src="/images/logo-tr.png"
            alt="Heritage Family Restaurant logo"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 hidden md:flex">
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
          className="rounded-full border border-red-600 px-5 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}