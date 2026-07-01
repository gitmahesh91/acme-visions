import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Acme Visions | Ananth Vara Prasad — Luxury Editorial Wedding Photography",
  description: "Acme Visions by Ananth Vara Prasad. Luxury editorial wedding photographer based in India, capturing weddings worldwide. Artfully captured — for this life and the next.",
  keywords: ["Acme Visions", "Ananth Vara Prasad", "Luxury Wedding Photographer", "Editorial Photography", "India Wedding Photographer", "Newborn Photography"],
  authors: [{ name: "Ananth Vara Prasad - Acme Visions" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Acme Visions | Ananth Vara Prasad",
    description: "Luxury editorial wedding & portrait photography. Artfully captured — for this life and the next.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${raleway.variable} ${cormorant.variable} antialiased bg-[#BFB9B0] text-black font-body`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
