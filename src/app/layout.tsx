import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.citykistverhuurzwolle.nl";

export const viewport: Viewport = {
  themeColor: "#0891B2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CityKist Verhuur — Feest & Evenementen Verhuur Zwolle",
    template: "%s — CityKist Verhuur Zwolle",
  },
  description:
    "De goedkoopste feest- en evenementenverhuur in Zwolle: beamers, geluid, karaoke, verlichting, rookmachines en glow-in-the-dark. 7 dagen bereikbaar. Bel 06-226 321 07.",
  keywords: [
    "feest verhuur zwolle",
    "evenementen verhuur zwolle",
    "beamer huren zwolle",
    "karaoke huren zwolle",
    "geluid huren zwolle",
    "speaker huren zwolle",
    "verlichting huren zwolle",
    "rookmachine huren",
    "bellenblaasmachine huren",
    "glow in the dark verhuur",
    "citykist",
    "citykist verhuur",
  ],
  applicationName: "CityKist Verhuur",
  authors: [{ name: "CityKist Verhuur Zwolle" }],
  creator: "CityKist Verhuur Zwolle",
  publisher: "CityKist Verhuur Zwolle",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: "CityKist Verhuur",
    title: "CityKist Verhuur — Feest & Evenementen Verhuur Zwolle",
    description:
      "Beamers, geluid, karaoke, verlichting en meer huren in Zwolle. Voordelig en met persoonlijke service.",
    images: [
      {
        url: "/images/sfeer/stage.jpg",
        width: 1600,
        height: 900,
        alt: "Podiumverlichting tijdens een evenement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CityKist Verhuur — Feest & Evenementen Verhuur Zwolle",
    description:
      "Beamers, geluid, karaoke, verlichting en meer huren in Zwolle. Voordelig en met persoonlijke service.",
    images: ["/images/sfeer/stage.jpg"],
  },
  // Verifieer je site in Google Search Console: kopieer de meta-content in
  // GOOGLE_SITE_VERIFICATION (Vercel-env). Zonder env-var wordt de tag niet
  // gerenderd en is het simpelweg afwezig — geen runtime-fouten.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "Rental",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Cart />
        </CartProvider>
        <StructuredData />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
