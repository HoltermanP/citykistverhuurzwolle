import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

export const metadata: Metadata = {
  title: "CityKist Verhuur — Feest & Evenementen Verhuur Zwolle",
  description:
    "Goedkoopste feest- en evenementenverhuur in Zwolle: beamers, geluid, karaoke, verlichting, rookmachines en meer. 7 dagen bereikbaar. Bel 06-226 321 07.",
  keywords: "feest verhuur zwolle, beamer huren, karaoke huren, geluid huren, speaker huren, verlichting huren, citykist",
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
      </body>
    </html>
  );
}
