"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Phone, PartyPopper } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { toggleCart, totaalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/producten", label: "Producten" },
    { href: "/wk-verhuur", label: "WK 2026 ⚽" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-dark-border shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-party to-pink-party text-white text-sm py-1.5 text-center font-medium">
        <PartyPopper className="inline w-4 h-4 mr-1" />
        Goedkoopste verhuur in Zwolle en omgeving — 7 dagen per week bereikbaar
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🎉</span>
            <div>
              <span className="text-slate-900 font-black text-lg leading-none block">
                City<span className="text-party">Kist</span>
              </span>
              <span className="text-slate-500 text-xs leading-none">Feest Verhuur Zwolle</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-party transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0622632107"
              className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-party text-sm transition-colors"
            >
              <Phone size={14} />
              <span>06-226 321 07</span>
            </a>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-gradient-party hover:opacity-90 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-opacity"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:block">Aanvraag</span>
              {totaalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-party text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {totaalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-slate-600 hover:text-party p-1"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-dark-border px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 hover:text-party py-2.5 text-base font-medium border-b border-dark-border"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:0622632107"
            className="flex items-center gap-2 text-party py-2 font-semibold"
          >
            <Phone size={16} />
            06-226 321 07
          </a>
        </div>
      )}
    </header>
  );
}
