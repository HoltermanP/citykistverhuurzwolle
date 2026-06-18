import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met CityKist Verhuur in Zwolle. Bel 06-226 321 07 of mail naar info@citykistverhuurzwolle.nl. 7 dagen per week bereikbaar.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — CityKist Verhuur Zwolle",
    description: "Bel 06-226 321 07 of mail ons. 7 dagen bereikbaar.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/sfeer/lights.jpg"
          alt="Sfeerverlichting"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-party-dark/90 via-party-dark/75 to-pink-party/45" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <span className="inline-block text-cyan-300 font-bold text-sm uppercase tracking-wider mb-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">Neem contact op</span>
          <h1 className="text-white font-black text-3xl md:text-5xl [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">Contact</span>
          </h1>
          <p className="text-white/90 text-lg mt-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            Vragen? We zijn 7 dagen per week bereikbaar.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contactgegevens */}
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-slate-900 font-bold text-xl mb-5">Contactgegevens</h2>

            <div className="space-y-4">
              <a href="tel:0622632107" className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Telefoon</p>
                  <p className="text-slate-900 font-semibold group-hover:text-party transition-colors">06-226 321 07</p>
                  <p className="text-slate-500 text-xs mt-0.5">7 dagen per week bereikbaar</p>
                </div>
              </a>

              <a href="mailto:info@citykistverhuurzwolle.nl" className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">E-mail</p>
                  <p className="text-slate-900 font-semibold group-hover:text-party transition-colors break-all">info@citykistverhuurzwolle.nl</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Locatie</p>
                  <p className="text-slate-900 font-semibold">Zwolle en omgeving</p>
                  <p className="text-slate-500 text-xs mt-0.5">Ophalen in de regio Zwolle</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Openingstijden</p>
                  <p className="text-slate-900 font-semibold">Maandag – Zondag</p>
                  <p className="text-slate-500 text-xs mt-0.5">Ook weekends op afspraak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-slate-900 font-bold mb-3">Ophalen & retourneren</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>🚗 Ophalen op afgesproken locatie in Zwolle</p>
              <p>💳 Betaal vooraf met iDEAL of contant bij het ophalen</p>
              <p>✅ Apparatuur wordt getest voor gebruik</p>
            </div>
          </div>
        </div>

        {/* Contactformulier */}
        <div className="space-y-4">
          <ContactForm />
        </div>
      </div>
      </div>
    </>
  );
}
