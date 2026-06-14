import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎉</span>
              <div>
                <span className="text-slate-900 font-black text-lg leading-none block">
                  City<span className="text-party">Kist</span>
                </span>
                <span className="text-slate-400 text-xs">Citykist Verhuur Zwolle</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              De goedkoopste feest- en evenementenverhuur in Zwolle en omgeving. Al jaren hét adres voor beamers, geluidssets, karaoke en meer.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wide">Navigatie</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/producten", label: "Alle producten" },
                { href: "/wk-verhuur", label: "WK 2026 Verhuur" },
                { href: "/aanvraag", label: "Aanvraag indienen" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 hover:text-party text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorieën */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wide">Categorieën</h3>
            <ul className="space-y-2">
              {[
                { href: "/producten?cat=beamer", label: "📽️ Beamers & Schermen" },
                { href: "/producten?cat=audio", label: "🔊 Geluid & Speakers" },
                { href: "/producten?cat=karaoke", label: "🎤 Karaoke" },
                { href: "/producten?cat=verlichting", label: "💡 Verlichting" },
                { href: "/producten?cat=effecten", label: "🌫️ Rook & Bellen" },
                { href: "/producten?cat=accessoires", label: "🔌 Accessoires" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 hover:text-party text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={15} className="text-party-light mt-0.5 flex-shrink-0" />
                <a href="tel:0622632107" className="text-slate-600 hover:text-party text-sm transition-colors">
                  06-226 321 07
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={15} className="text-party-light mt-0.5 flex-shrink-0" />
                <a href="mailto:info@citykistverhuurzwolle.nl" className="text-slate-600 hover:text-party text-sm transition-colors break-all">
                  info@citykistverhuurzwolle.nl
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-party-light mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 text-sm">Zwolle en omgeving</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-party-light mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 text-sm">7 dagen per week bereikbaar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} CityKist Verhuur. Alle prijzen zijn dagprijzen excl. BTW.
          </p>
          <Link href="/admin" className="text-slate-300 hover:text-slate-500 text-xs transition-colors">
            Beheer
          </Link>
        </div>
      </div>
    </footer>
  );
}
