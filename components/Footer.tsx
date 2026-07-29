"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiAirbnb, SiBookingdotcom, SiTripadvisor } from "react-icons/si";
import './footer-style.css';

export default function Footer() {
  return (
    <div className="pg-footer mt-20">
      <footer className="footer" aria-label="Footer">
        <svg className="footer-wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path className="footer-wave-path" d="M851.8,100c125,0,288.3-45,348.2-64V0H0v44c3.7-1,7.3-1.9,11-2.9C80.7,22,151.7,10.8,223.5,6.3C276.7,2.9,330,4,383,9.8 c52.2,5.7,103.3,16.2,153.4,32.8C623.9,71.3,726.8,100,851.8,100z"></path>
        </svg>
        
        <div className="footer-content">
          <div className="footer-content-grid">
            
            <div className="footer-column">
              <Image
                src="/images/logo.jpeg"
                alt="Heritage Family Restaurant logo"
                width={160}
                height={48}
                className="h-12 w-auto object-contain bg-white/10 p-1 rounded"
              />
              <p className="footer-description mt-4">
                Heritage Family Restaurant - A riverside dining experience by the Kelani River, Thunkinda, Yatiyanthota.
              </p>
            </div>

            <div className="footer-column">
              <h2 className="footer-menu-name">Quick Links</h2>
              <ul className="footer-menu-list">
                <li><Link href="/menu">Menu</Link></li>
                <li><Link href="/treehouse">The Magical Tree House</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h2 className="footer-menu-name">The Magical Tree House</h2>
              <p className="footer-description">
                Experience dining in the treetops overlooking the Kelani River. A unique adventure for the whole family.
              </p>
            </div>

            <div className="footer-column">
              <h2 className="footer-menu-name">Contact</h2>
              <ul className="footer-menu-list">
                <li>Thunkinda, Yatiyanthota, near Kithulgala</li>
                <li><a href="tel:+94716939224">+94 71 693 9224</a></li>
                <li><a href="mailto:info@heritagefamilyrest.com">info@heritagefamilyrest.com</a></li>
                <li className="mt-2">
                  <a href="https://maps.app.goo.gl/zEpzmFWGpsow7ZhH6" target="_blank" rel="noreferrer" className="underline underline-offset-4 font-bold text-white">
                    Get Directions
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="footer-social-container">
            <a href="https://web.facebook.com/Heritage.Family.Restaurant" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-link">
              <FaFacebookF size={22} />
            </a>
            <a href="https://www.instagram.com/heritage_family_rest/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-link">
              <FaInstagram size={22} />
            </a>
            <a href="https://www.tripadvisor.com/Restaurant_Review-g26500862-d16898051-Reviews-Heritage_Family_Restaurant-Hakbellawaka_Sabaragamuwa_Province.html" target="_blank" rel="noreferrer" aria-label="Tripadvisor" className="footer-social-link">
              <SiTripadvisor size={22} />
            </a>
            <a href="https://www.booking.com/hotel/lk/the-magical-tree-house.en-gb.html" target="_blank" rel="noreferrer" aria-label="Booking.com" className="footer-social-link">
              <SiBookingdotcom size={22} />
            </a>
            <a href="https://www.airbnb.com/rooms/1475264680546928390" target="_blank" rel="noreferrer" aria-label="Airbnb" className="footer-social-link">
              <SiAirbnb size={22} />
            </a>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="footer-copyright-wrapper flex justify-center items-center gap-1 flex-col md:flex-row">
            <span>&copy; 2026 Heritage Family Restaurant. All rights reserved. | Google Maps attribution</span>
            <span className="hidden md:inline"> | </span>
            <span>
              Developed by <a href="https://disath.dev" target="_blank" rel="noreferrer" className="hover:underline font-bold hover:text-[#34D399] transition-colors">Disath Liyanage</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}