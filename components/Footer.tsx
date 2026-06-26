"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiAirbnb, SiBookingdotcom, SiTripadvisor } from "react-icons/si";
import './wave-footer.css';

export default function Footer() {
  return (
    <footer aria-label="Footer" className="mt-20">
      <div className="wave-footer-wrapper">
        <svg viewBox="0 0 120 28" className="wave-footer-svg">
          <defs>
            <mask id="xxx">
              <circle cx="7" cy="12" r="40" fill="#fff" />
            </mask>

            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
                   1 0 0 0 0  
                   0 1 0 0 0  
                   0 0 1 0 0  
                   0 0 0 13 -9"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
            
            <path
              id="wave"
              d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
            />
          </defs>

          <use id="wave3" className="wave" href="#wave" x="0" y="-2" />
          <use id="wave2" className="wave" href="#wave" x="0" y="0" />

          <g className="gooeff">
            <circle className="drop drop1" cx="20" cy="2" r="1.8" />
            <circle className="drop drop2" cx="25" cy="2.5" r="1.5" />
            <circle className="drop drop3" cx="16" cy="2.8" r="1.2" />
            <use id="wave1" className="wave" href="#wave" x="0" y="1" />
          </g>
        </svg>
      </div>

      <div className="bg-[#215F47] text-[#F5F0E8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 pt-4 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <Image
              src="/images/logo.jpeg"
              alt="Heritage Family Restaurant logo"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-4 text-sm text-[#F5F0E8]/60">
              Heritage Family Restaurant - A riverside dining experience by the Kelani River, Thunkinda, Yatiyanthota.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/heritage_family_rest/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="https://web.facebook.com/Heritage.Family.Restaurant" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="https://www.tripadvisor.com/Restaurant_Review-g26500862-d16898051-Reviews-Heritage_Family_Restaurant-Hakbellawaka_Sabaragamuwa_Province.html" target="_blank" rel="noreferrer" aria-label="Tripadvisor" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
                <SiTripadvisor className="h-5 w-5" />
              </a>
              <a href="https://www.booking.com/hotel/lk/the-magical-tree-house.en-gb.html" target="_blank" rel="noreferrer" aria-label="Booking.com" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
                <SiBookingdotcom className="h-5 w-5" />
              </a>
              <a href="https://www.airbnb.com/rooms/1475264680546928390" target="_blank" rel="noreferrer" aria-label="Booking.com" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
                <SiAirbnb className="h-5 w-5" />
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-display text-2xl">Quick links</h3>
            <ul className="mt-4 space-y-2 text-[#F5F0E8]/60">
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/treehouse">The Magical Tree House</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Reservations</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </section>

          <section>
            <h3 className="font-display text-2xl">The Magical Tree House</h3>
            <p className="mt-4 text-sm text-[#F5F0E8]/60">
              Experience dining in the treetops overlooking the Kelani River. A unique adventure for the whole family.
            </p>
          </section>

          <section>
            <h3 className="font-display text-2xl">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#F5F0E8]/60">
              <li>Thunkinda, Yatiyanthota, near Kithulgala, Sri Lanka</li>
              <li>+94 71 693 9224</li>
              <li>magicaltreehouse2024@gmail.com</li>
              <li>
                <a href="https://maps.app.goo.gl/zEpzmFWGpsow7ZhH6" target="_blank" rel="noreferrer" className="text-[#F5F0E8] underline underline-offset-4">
                  Get Directions
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="border-t border-[#F5F0E8]/15 px-6 py-4 text-center text-xs text-[#F5F0E8]/60">
        &copy; 2026 Heritage Family Restaurant. All rights reserved. | Google Maps attribution
        </div>
      </div>
    </footer>
  );
}