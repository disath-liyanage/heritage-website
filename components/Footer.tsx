import Image from "next/image";

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
            <a href="#" aria-label="Instagram" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.75 6a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 6Z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-[#F5F0E8]/80 hover:text-[#F5F0E8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M13.5 22v-8h2.5l.5-3h-3v-1.8c0-.9.3-1.5 1.6-1.5H17V5a17.2 17.2 0 0 0-2.4-.2c-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.5v8h3Z" />
              </svg>
            </a>
          </div>
        </section>

        <section>
          <h3 className="font-display text-2xl">Quick links</h3>
          <ul className="mt-4 space-y-2 text-[#F5F0E8]/60">
            <li><a href="#gallery">Menu</a></li>
            <li><a href="#treehouse">The Magical Tree House</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Reservations</a></li>
            <li><a href="#location">Contact</a></li>
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
            <li>+94 XX XXX XXXX</li>
            <li>hello@heritagefamilyrestaurant.lk</li>
            <li>
              <a
                href="https://www.google.com/maps?q=6.9271,80.3849"
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
