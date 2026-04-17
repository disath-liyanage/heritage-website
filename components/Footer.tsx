import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiAirbnb, SiBookingdotcom, SiTripadvisor } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#1C2B1E] text-[#F5F0E8]" aria-label="Footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
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
            <a
              href="https://www.instagram.com/heritage_family_rest/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://web.facebook.com/Heritage.Family.Restaurant"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]"
            >
              <FaFacebookF className="h-5 w-5" />
            </a>
            <a
              href="https://www.tripadvisor.com/Restaurant_Review-g26500862-d16898051-Reviews-Heritage_Family_Restaurant-Hakbellawaka_Sabaragamuwa_Province.html"
              target="_blank"
              rel="noreferrer"
              aria-label="Tripadvisor"
              className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]"
            >
              <SiTripadvisor className="h-5 w-5" />
            </a>
            <a
              href="https://www.booking.com/Share-xaiO6g"
              target="_blank"
              rel="noreferrer"
              aria-label="Booking.com"
              className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]"
            >
              <SiBookingdotcom className="h-5 w-5" />
            </a>
            <a
              href="https://www.airbnb.com/rooms/1475264680546928390?check_in=2026-04-21&check_out=2026-04-22&guests=1&adults=1&s=67&unique_share_id=6eb33a4b-b45c-4285-8b9b-2d0dc5cc727f"
              target="_blank"
              rel="noreferrer"
              aria-label="Airbnb"
              className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]"
            >
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
              <a
                href="https://maps.app.goo.gl/zEpzmFWGpsow7ZhH6"
                target="_blank"
                rel="noreferrer"
                className="text-[#F5F0E8] underline underline-offset-4"
              >
                Get Directions
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-[#F5F0E8]/15 px-6 py-4 text-center text-xs text-[#F5F0E8]/60">
        © 2025 Heritage Family Restaurant. All rights reserved. | Google Maps attribution
      </div>
    </footer>
  );
}
