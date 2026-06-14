import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Star, Truck, Phone, Music, Projector, Mic2, Lightbulb, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";

const CATEGORIEN = [
  { id: "beamer", naam: "Beamers & Schermen", emoji: "📽️", beschrijving: "Van standaard tot professionele HD beamers" },
  { id: "audio", naam: "Geluid & Speakers", emoji: "🔊", beschrijving: "Speakers van 600 tot 2800 watt" },
  { id: "karaoke", naam: "Karaoke", emoji: "🎤", beschrijving: "Digitale karaoke sets voor elk feest" },
  { id: "verlichting", naam: "Verlichting", emoji: "💡", beschrijving: "Disco, laser en moving head effecten" },
  { id: "effecten", naam: "Rook & Bellen", emoji: "🌫️", beschrijving: "Rook- en bellenblaas machines" },
  { id: "accessoires", naam: "Accessoires", emoji: "🔌", beschrijving: "Laptops, presenters en kabels" },
];

export default async function HomePage() {
  let populaireProducten: (typeof products.$inferSelect)[] = [];
  try {
    populaireProducten = await db
      .select()
      .from(products)
      .where(eq(products.populair, true))
      .orderBy(asc(products.volgorde))
      .limit(8);
  } catch {
    // DB nog niet geconfigureerd
  }

  return (
    <>
      {/* ── HERO ───────────────────���──────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-party-dark">
        {/* Achtergrondvideo — plaats je eigen video als /public/hero.mp4.
            Zolang die er niet is, blijft de tropical gradient zichtbaar. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-55 blur-[1px] scale-105"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Volledige overlay in huisstijlkleur — video blijft op de achtergrond, maar zichtbaarder */}
        <div className="absolute inset-0 bg-gradient-to-br from-party-dark/65 via-black/40 to-party-dark/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-party/30 backdrop-blur-sm border border-party/50 rounded-full px-4 py-1.5 mb-6">
              <span className="text-lg">🎉</span>
              <span className="text-white font-semibold text-sm [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                Dé feest verhuurder van Zwolle en omgeving
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
              Maak jouw{" "}
              <span className="text-transparent bg-clip-text bg-gradient-party">feest</span>{" "}
              onvergetelijk
            </h1>

            <p className="text-white/90 text-lg mt-6 leading-relaxed max-w-2xl [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              Beamers, geluidssets, karaoke, verlichting en meer — voor elk feest, evenement of bedrijfsbijeenkomst.
              De <strong className="text-white">goedkoopste verhuur</strong> in de regio Zwolle.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/producten"
                className="bg-gradient-party hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-opacity"
              >
                Bekijk alle producten
              </Link>
              <Link
                href="/aanvraag"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Direct aanvragen
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { getal: "7 dagen", label: "Per week bereikbaar" },
                { getal: "6 cat.", label: "Productcategorieën" },
                { getal: "€0", label: "Online betaling" },
                { getal: "Zwolle", label: "& omgeving" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-party-light">{s.getal}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIEËN ────────────────���────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6">
        {/* Decoratieve glow-accenten */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-party/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-80 h-80 bg-pink-party/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-party font-bold text-sm uppercase tracking-wider mb-2">Assortiment</span>
            <h2 className="text-slate-900 font-black text-3xl md:text-4xl">
              Wat wil jij <span className="text-transparent bg-clip-text bg-gradient-party">huren?</span>
            </h2>
            <p className="text-slate-600 mt-3">Kies een categorie om te beginnen</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIEN.map((cat) => (
              <Link
                key={cat.id}
                href={`/producten?cat=${cat.id}`}
                className="bg-dark-card border border-dark-border rounded-2xl p-5 text-center hover:border-party/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-party/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-party/10 to-pink-party/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:from-party/20 group-hover:to-pink-party/20 transition-all duration-300">
                  {cat.emoji}
                </div>
                <h3 className="text-slate-900 font-semibold text-sm">{cat.naam}</h3>
                <p className="text-slate-500 text-xs mt-1 hidden md:block">{cat.beschrijving}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAIRE PRODUCTEN ─────────────────────��─────────────── */}
      {populaireProducten.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-party/5 via-white to-white border-y border-dark-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="inline-block text-party font-bold text-sm uppercase tracking-wider mb-2">Topkeuzes</span>
                <h2 className="text-slate-900 font-black text-3xl md:text-4xl">
                  Populaire <span className="text-transparent bg-clip-text bg-gradient-party">Verhuur</span>
                </h2>
                <p className="text-slate-600 mt-2 text-sm">Meest gevraagde artikelen</p>
              </div>
              <Link href="/producten" className="text-party hover:text-party-dark text-sm font-semibold transition-colors hidden sm:block">
                Alle producten →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {populaireProducten.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SFEERBAND ─────────────────────────────────────────── */}
      <section className="relative h-[340px] md:h-[420px] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/sfeer/party-crowd.jpg"
          alt="Feest met publiek en lichtshow"
          fill
          priority={false}
          className="object-cover"
          sizes="100vw"
        />
        {/* Tropical overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-party-dark/85 via-black/55 to-pink-party/40" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-white font-black text-3xl md:text-5xl leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            Van intiem tuinfeest tot{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">groot evenement</span>
          </h2>
          <p className="text-white/90 text-lg mt-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            Alles om jouw moment onvergetelijk te maken — wij regelen de techniek, jij geniet.
          </p>
          <Link
            href="/producten"
            className="inline-block mt-7 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors"
          >
            Ontdek het assortiment
          </Link>
        </div>
      </section>

      {/* ── HOE WERKT HET ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-party font-bold text-sm uppercase tracking-wider mb-2">Zo simpel</span>
            <h2 className="text-slate-900 font-black text-3xl md:text-4xl">Hoe werkt het?</h2>
            <p className="text-slate-600 mt-2">In 4 eenvoudige stappen naar jouw perfecte feest</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { nr: "1", emoji: "🔍", titel: "Kies producten", tekst: "Browse ons uitgebreide assortiment en voeg gewenste artikelen toe aan je aanvraag." },
              { nr: "2", emoji: "📋", titel: "Dien aanvraag in", tekst: "Vul je gegevens en gewenste datums in. We nemen zo snel mogelijk contact op." },
              { nr: "3", emoji: "✅", titel: "Bevestiging", tekst: "Wij bevestigen de beschikbaarheid en stemmen de ophaal- of leverdatum af." },
              { nr: "4", emoji: "🎉", titel: "Geniet!", tekst: "Haal op of laat bezorgen. Betaling achteraf na gebruik." },
            ].map((stap) => (
              <div key={stap.nr} className="relative">
                <div className="h-full bg-dark-card border border-dark-border rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-party/10 transition-all duration-300">
                  <div className="w-11 h-11 bg-gradient-party shadow-lg shadow-party/30 rounded-full flex items-center justify-center text-white font-black mx-auto mb-3">
                    {stap.nr}
                  </div>
                  <div className="text-3xl mb-2">{stap.emoji}</div>
                  <h3 className="text-slate-900 font-bold mb-2">{stap.titel}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{stap.tekst}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP's ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-party/5 border-t border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { emoji: "💰", titel: "Laagste prijs", tekst: "Goedkoopste verhuur in Zwolle en omgeving" },
              { emoji: "🚗", titel: "Bezorging", tekst: "Bezorgen en ophalen in de regio Zwolle" },
              { emoji: "✅", titel: "Getest", tekst: "Alle apparatuur wordt vóór levering getest" },
              { emoji: "📞", titel: "7 dagen bereikbaar", tekst: "Ook in het weekend altijd bereikbaar" },
            ].map((u) => (
              <div key={u.titel} className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-party/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-party/10 transition-all duration-300">
                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-party/10 to-pink-party/10 flex items-center justify-center text-2xl">
                  {u.emoji}
                </div>
                <h3 className="text-slate-900 font-bold mb-1">{u.titel}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{u.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WK BANNER ────────────────────��────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-oranje/15 to-marine/15 border border-oranje/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-oranje/5">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-oranje/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative text-7xl">⚽</div>
            <div className="relative flex-1">
              <div className="inline-flex items-center gap-2 bg-oranje/20 border border-oranje/40 rounded-full px-3 py-1 mb-3">
                <span className="text-oranje font-semibold text-xs">Speciaal aanbod</span>
              </div>
              <h2 className="text-slate-900 font-black text-2xl md:text-3xl">WK 2026 — Feest huren voor het voetbal</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">
                Voor het WK 2026 (11 juni – 19 juli) hebben we speciale pakketten. Beamers, geluidssets en verlichting voor de perfecte kijkavond.
              </p>
            </div>
            <Link
              href="/wk-verhuur"
              className="relative flex-shrink-0 bg-gradient-oranje hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-opacity whitespace-nowrap shadow-lg shadow-oranje/30"
            >
              WK Verhuur →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────���───────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6">
        <Image
          src="/images/sfeer/confetti.jpg"
          alt="Confetti op een feest"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Tropical overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-party-dark/90 via-party-dark/80 to-pink-party/50" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-white font-black text-3xl md:text-5xl leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
            Klaar voor een{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">onvergetelijk feest</span>?
          </h2>
          <p className="text-white/90 mt-5 text-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            Geen online betaling bij aanvraag. Betaling achteraf na bevestiging.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/producten" className="bg-white text-party hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
              Producten bekijken
            </Link>
            <a href="tel:0622632107" className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center gap-2">
              <Phone size={18} />
              06-226 321 07
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
