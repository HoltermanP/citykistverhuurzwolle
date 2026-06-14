import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

              <a href="mailto:info@citykistverhuur.nl" className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">E-mail</p>
                  <p className="text-slate-900 font-semibold group-hover:text-party transition-colors break-all">info@citykistverhuur.nl</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-party" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Locatie</p>
                  <p className="text-slate-900 font-semibold">Zwolle en omgeving</p>
                  <p className="text-slate-500 text-xs mt-0.5">Bezorging & ophalen in de regio</p>
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
              <p>📦 Bezorging mogelijk in de regio (meerkosten)</p>
              <p>💳 Betaling achteraf na gebruik</p>
              <p>✅ Apparatuur wordt getest voor levering</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-party/10 to-pink-party/5 border border-party/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-slate-900 font-black text-2xl mb-3">Direct een aanvraag doen?</h2>
            <p className="text-slate-600 mb-6">
              Kies jouw producten, vul je gegevens in en wij nemen contact op ter bevestiging.
            </p>
            <Link
              href="/aanvraag"
              className="block w-full bg-gradient-party hover:opacity-90 text-white py-4 rounded-xl font-bold text-lg transition-opacity"
            >
              Aanvraag starten →
            </Link>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-party" />
              Veelgestelde vragen
            </h3>
            <div className="space-y-4">
              {[
                { v: "Wanneer moet ik betalen?", a: "Betaling vindt achteraf plaats na gebruik. Geen online betaling vereist bij de aanvraag." },
                { v: "Bezorgen jullie ook?", a: "Ja, bezorging is mogelijk in de regio Zwolle. Neem contact op voor de kosten." },
                { v: "Hoe ver van tevoren boeken?", a: "Zo snel mogelijk, zeker voor drukke periodes. Wij bevestigen de beschikbaarheid." },
                { v: "Wat als iets kapot gaat?", a: "Neem direct contact op. We kijken samen naar een oplossing." },
              ].map((faq, i) => (
                <div key={i} className="border-b border-dark-border last:border-0 pb-3 last:pb-0">
                  <p className="text-slate-900 text-sm font-semibold mb-1">{faq.v}</p>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
