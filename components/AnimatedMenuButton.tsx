"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AnimatedMenuButton() {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isClicked) return;
    
    setIsClicked(true);
    
    setTimeout(() => {
      router.push("/menu");
    }, 500);
  };

  return (
    <Link 
      href="/menu"
      onClick={handleClick}
      className="group relative inline-block h-14 w-[260px] cursor-pointer rounded-full border border-[#F5F0E8] p-1 outline-none"
    >
      <span 
        className={`absolute inset-y-1 left-1 block rounded-full bg-[#F5F0E8] transition-all duration-500 group-hover:w-[calc(100%_-_8px)] ${
          isClicked ? "w-[calc(100%_-_8px)]" : "w-11"
        }`} 
        aria-hidden="true" 
      />
      <div className={`absolute top-1/2 left-3.5 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-1 z-10 ${
        isClicked ? "translate-x-1" : ""
      }`}>
        <svg className="h-6 w-6 text-[#1C2B1E]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </div>
      <span className={`absolute top-1/2 left-1/2 ml-4 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-lg font-medium tracking-tight transition-colors duration-500 group-hover:text-[#1C2B1E] z-10 ${
        isClicked ? "text-[#1C2B1E]" : "text-[#F5F0E8]"
      }`}>
        Explore the Menu
      </span>
    </Link>
  );
}