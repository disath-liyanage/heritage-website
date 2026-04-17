
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cormorant, dmSans } from "./fonts";

export const metadata: Metadata = {
  title:
    "Heritage Family Restaurant | The Magical Tree House by Heritage Family Resturent",
  description:
    "Heritage Family Restaurant with family dining and The Magical Tree House by Heritage Family Resturent.",
  openGraph: {
    title:
      "Heritage Family Restaurant | The Magical Tree House by Heritage Family Resturent",
    description:
      "Heritage Family Restaurant with family dining and The Magical Tree House by Heritage Family Resturent.",
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
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
