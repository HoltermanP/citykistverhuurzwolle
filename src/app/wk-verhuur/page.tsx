import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { Phone } from "lucide-react";

const NL_WEDSTRIJDEN = [
  { datum: "13 juni 2026", label: "Groepsfase 1", tegenstander: "Groepsfase wedstrijd" },
  { datum: "19 juni 2026", label: "Groepsfase 2", tegenstander: "Groepsfase wedstrijd" },
  { datum: "24 juni 2026", label: "Groepsfase 3", tegenstander: "Groepsfase wedstrijd" },
  { datum: "19 juli 2026", label: "🏆 Finale", tegenstander: "Finale WK 2026", finale: true },
];

export default async function WKVerhuurPage() {
  let beamers: (typeof products.$inferSelect)[] = [];
  let audioProducts: (typeof products.$inferSelect)[] = [];
  try {
    beamers = await db.select().from(products)
      .where(eq(products.categorie, "beamer"))
      .orderBy(asc(products.naam))
      .limit(4);
    audioProducts = await db.select().from(products)
      .where(eq(products.categorie, "audio"))
      .orderBy(asc(products.volgorde))
      .limit(4);
  } catch {
    // DB niet geconfigureerd
  }

  return (
    <>
      {/* ── WK HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-wk" />
        {/* Veld lijnen decoratie */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
          <div className="absolute left-1/2 inset-y-0 w-px bg-white" />
          <div className="absolute left-1/2 top-1/2 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-oranje/20 border border-oranje/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-lg">⚽</span>
              <span className="text-oranje-light font-semibold text-sm">FIFA World Cup 2026 — USA · Canada · Mexico</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              WK 2026 <span className="text-oranje-light">Verhuur</span>
            </h1>

            <p className="text-white/70 text-lg mt-6 leading-relaxed max-w-2xl">
              Kijk het WK in stijl! Huur een beamer, speaker of tent en beleef elke wedstrijd als op het veld.
              Speciaal WK-aanbod voor Zwolle en omgeving.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/producten?cat=beamer" className="bg-gradient-oranje hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-opacity">
                🏆 Beamer huren
              </Link>
              <Link href="/aanvraag" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                Direct aanvragen
              </Link>
            </div>

            {/* WK Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              {[
                { getal: "11 jun", label: "WK start" },
                { getal: "19 jul", label: "Grote finale" },
                { getal: "48", label: "Landen" },
                { getal: "104", label: "Wedstrijden" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-oranje-light">{s.getal}</div>
                  <div className="text-white/60 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NL SPEELSCHEMA ───────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🇳🇱</span>
                <h2 className="text-slate-900 font-black text-2xl md:text-3xl">Nederland op het WK</h2>
              </div>
              <p className="text-slate-600 mb-6">Boek op tijd voor de wedstrijddagen van Oranje!</p>

              <div className="space-y-3">
                {NL_WEDSTRIJDEN.map((w) => (
                  <div key={w.datum} className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    w.finale ? "bg-yellow-50 border border-yellow-300" : "bg-oranje/5 border border-oranje/20"
                  }`}>
                    <div>
                      <p className={`font-bold text-sm ${w.finale ? "text-yellow-700" : "text-oranje-dark"}`}>{w.label}</p>
                      <p className="text-slate-500 text-xs">{w.tegenstander}</p>
                    </div>
                    <span className="text-slate-700 text-sm">{w.datum}</span>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 text-xs mt-3">* Datums zijn indicatief. Verifieer via fifaworldcup.com</p>
            </div>

            {/* WK pakketten */}
            <div className="bg-navy border border-dark-border rounded-2xl p-6">
              <h3 className="text-slate-900 font-bold text-xl mb-5">Populaire WK combinaties</h3>
              <div className="space-y-4">
                {[
                  {
                    naam: "Tuin Kijkavond",
                    items: ["Beamer set + scherm", "Speaker 600W", "Verlengsnoer 10m"],
                    prijs: "vanaf €45/dag",
                    emoji: "🌿",
                  },
                  {
                    naam: "Grote Kijkparty",
                    items: ["Professionele HD Beamer", "Speaker set 1200W", "Bellenblaas machine", "Stroboscoop"],
                    prijs: "vanaf €120/dag",
                    emoji: "🎉",
                  },
                  {
                    naam: "Karaoke Finale Nacht",
                    items: ["Karaoke set compleet", "Verlichting set", "Microfoons"],
                    prijs: "vanaf €130/dag",
                    emoji: "🎤",
                  },
                ].map((pk) => (
                  <div key={pk.naam} className="bg-dark-card border border-dark-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pk.emoji}</span>
                        <span className="text-slate-900 font-semibold">{pk.naam}</span>
                      </div>
                      <span className="text-oranje-dark font-bold text-sm">{pk.prijs}</span>
                    </div>
                    <ul className="space-y-1">
                      {pk.items.map((item) => (
                        <li key={item} className="text-slate-600 text-xs flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-oranje" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href="/aanvraag" className="block w-full text-center bg-gradient-oranje hover:opacity-90 text-white py-3 rounded-xl font-bold mt-4 transition-opacity">
                Op maat aanvragen →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEAMERS ──────────────────────────────────────────── */}
      {beamers.length > 0 && (
        <section className="py-12 px-4 sm:px-6 bg-dark-card">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-slate-900 font-black text-2xl">📽️ Beamers voor het WK</h2>
              <Link href="/producten?cat=beamer" className="text-oranje-dark text-sm font-semibold hover:text-oranje transition-colors">
                Alle beamers →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {beamers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── AUDIO ────────────────────────────────────────────── */}
      {audioProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-slate-900 font-black text-2xl">🔊 Geluid & Speakers</h2>
              <Link href="/producten?cat=audio" className="text-oranje-dark text-sm font-semibold hover:text-oranje transition-colors">
                Alle speakers →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {audioProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-slate-900 font-black text-3xl">
            Klaar voor het <span className="text-oranje-dark">WK-feest</span>?
          </h2>
          <p className="text-slate-600 mt-3 mb-8">
            Bel ons voor persoonlijk advies of doe direct een aanvraag.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/aanvraag" className="bg-gradient-oranje hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-opacity">
              Aanvraag starten
            </Link>
            <a href="tel:0622632107" className="bg-dark-card hover:bg-slate-50 border border-dark-border text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center gap-2">
              <Phone size={18} />
              06-226 321 07
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
