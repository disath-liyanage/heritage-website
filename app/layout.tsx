
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { cormorant } from "./fonts";

const siteUrl = "https://www.heritagefamilyrest.com";

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Heritage Family Restaurant",
  url: siteUrl,
  logo: "https://www.heritagefamilyrest.com/_next/image?url=%2Fimages%2Flogo.jpeg&w=384&q=75",
  image: "https://www.heritagefamilyrest.com/_next/image?url=%2Fimages%2Foutdoor%2FFront.jpeg&w=3840&q=75",
  description:
    "Heritage Family Restaurant is a riverside dining experience located beside the Kelani River in Thunkinda, Yatiyanthota, near Kithulgala, Sri Lanka. Featuring The Magical Tree House for a unique treetop dining experience.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thunkinda",
    addressLocality: "Yatiyanthota",
    addressRegion: "Western Province",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "6.9271",
    longitude: "80.3849",
  },
  telephone: "+94716939224",
  email: "magicaltreehouse2024@gmail.com",
  servesCuisine: "Sri Lankan",
  priceRange: "$$",
  openingHours: ["Mo-Su 12:00-15:00", "Mo-Su 18:00-22:00"],
  hasMap: "https://maps.app.goo.gl/zEpzmFWGpsow7ZhH6",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "6",
    bestRating: "5",
  },
  sameAs: [
    "https://web.facebook.com/Heritage.Family.Restaurant",
    "https://www.instagram.com/heritage_family_rest/",
    "https://maps.app.goo.gl/zEpzmFWGpsow7ZhH6",
  ],
};

const treeHouseAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "The Magical Tree House by Heritage Family Restaurant",
  url: "https://www.heritagefamilyrest.com/treehouse",
  description:
    "The Magical Tree House is a unique treetop dining experience perched above the Kelani River in the lush forests of Yatiyanthota, near Kithulgala, Sri Lanka. Perfect for families, couples, and nature lovers.",
  image: "https://www.heritagefamilyrest.com/_next/image?url=%2Fimages%2FTreeHouse%2Fbed.jpeg&w=3840&q=75",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thunkinda",
    addressLocality: "Yatiyanthota",
    addressRegion: "Western Province",
    addressCountry: "LK",
  },
  telephone: "+94716939224",
  touristType: ["Family", "Couples", "Nature Lovers"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Heritage Family Restaurant | Treehouse Dining by the Kelani River, Yatiyanthota",
  description:
    "Heritage Family Restaurant — A riverside dining experience beside the Kelani River in Yatiyanthota, Sri Lanka. Featuring The Magical Tree House, Sri Lankan cuisine, and stunning river views near Kithulgala.",
  authors: [{ name: "Heritage Family Restaurant" }],
  keywords: [
    "Heritage Family Restaurant",
    "Heritage Family Restaurant Yatiyanthota",
    "Magical Tree House Yatiyanthota",
    "treehouse dining Sri Lanka",
    "restaurant near Kithulgala",
    "Kelani River restaurant",
    "heritagefamilyrest.com",
    "family restaurant Sri Lanka",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Heritage Family Restaurant | The Magical Tree House, Yatiyanthota",
    description:
      "Riverside dining and treetop experiences beside the Kelani River. Visit Heritage Family Restaurant and The Magical Tree House in Yatiyanthota, Sri Lanka.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: "https://www.heritagefamilyrest.com/_next/image?url=%2Fimages%2Foutdoor%2FFront.jpeg&w=1200&q=90",
        alt: "Heritage Family Restaurant riverside view, Yatiyanthota",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage Family Restaurant | Treehouse Dining, Yatiyanthota",
    description:
      "Riverside Sri Lankan cuisine and The Magical Tree House experience beside the Kelani River near Kithulgala.",
    images: ["https://www.heritagefamilyrest.com/_next/image?url=%2Fimages%2Foutdoor%2FFront.jpeg&w=1200&q=90"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <Script
          id="restaurant-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <Script
          id="treehouse-attraction-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(treeHouseAttractionSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
