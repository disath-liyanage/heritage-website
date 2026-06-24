"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const LINKS = [
  { id: "menu", label: "Menu" },
  { id: "treehouse", label: "Tree House" },
  { id: "gallery", label: "Gallery" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) {
      setPastHero(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-80% 0px 0px 0px" }
    );
    
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    
    const contactSection = document.getElementById("contact");
    if (contactSection) sections.push(contactSection);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${styles.wrap} ${pastHero ? styles.visible : ""}`}>
      <nav className={styles.glass} aria-label="Primary">
        <a href="#home" className={styles.logo} aria-label="Heritage Family Restaurant home">
          <Image
            src="/images/logo.jpeg"
            alt="Heritage Family Restaurant logo"
            width={160}
            height={48}
            priority
          />
        </a>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? styles.active : ""}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contact" 
            className={`${styles.reserveBtn} ${active === "contact" ? styles.activeBtn : ""}`}
          >
            Reserve a table
          </a>
        </div>
      </nav>
    </header>
  );
}