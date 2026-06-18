import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import { products, handleidingen, Handleiding, verhuringen } from "@/lib/schema";
import { eq, asc, isNotNull } from "drizzle-orm";
import { Periode } from "@/lib/beschikbaarheid";
import ProductCard from "@/components/ProductCard";
import ProductenFilter from "@/components/ProductenFilter";

export const metadata: Metadata = {
  title: "Alle producten",
  description:
    "Bekijk het volledige assortiment verhuur van CityKist Zwolle: beamers, geluid, karaoke, verlichting, rookmachines, glow-in-the-dark en accessoires. Dagprijzen excl. BTW.",
  alternates: { canonical: "/producten" },
  openGraph: {
    title: "Alle producten — CityKist Verhuur Zwolle",
    description:
      "Het volledige assortiment: beamers, geluid, karaoke, verlichting en meer.",
    url: "/producten",
  },
};

const CATEGORIEN = [
  { id: "alle", naam: "Alle producten", emoji: "✨" },
  { id: "beamer", naam: "Beamers & Schermen", emoji: "📽️" },
  { id: "audio", naam: "Geluid & Speakers", emoji: "🔊" },
  { id: "karaoke", naam: "Karaoke", emoji: "🎤" },
  { id: "verlichting", naam: "Verlichting", emoji: "💡" },
  { id: "effecten", naam: "Rook & Bellen", emoji: "🌫️" },
  { id: "accessoires", naam: "Accessoires", emoji: "🔌" },
  { id: "glow-in-the-dark", naam: "Glow in the Dark", emoji: "🪩" },
];

interface PageProps {
  searchParams: Promise<{ cat?: string; zoek?: string }>;
}

export default async function ProductenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const actieveCat = params.cat || "alle";
  const zoek = params.zoek || "";

  let allProducts: (typeof products.$inferSelect)[] = [];
  try {
    // Binnen elke categorie op prijs sorteren (laag → hoog). Bij gelijke prijs
    // op naam als secundaire sleutel zodat de volgorde stabiel blijft.
    allProducts = await db
      .select()
      .from(products)
      .where(eq(products.beschikbaar, true))
      .orderBy(asc(products.prijsPerDag), asc(products.naam));
  } catch {
    // DB nog niet geconfigureerd
  }

  // Aan producten gekoppelde handleidingen ophalen en per productId groeperen.
  const handleidingenPerProduct: Record<number, Handleiding[]> = {};
  try {
    const gekoppeld = await db
      .select()
      .from(handleidingen)
      .where(isNotNull(handleidingen.productId))
      .orderBy(asc(handleidingen.volgorde));
    for (const h of gekoppeld) {
      if (h.productId != null) (handleidingenPerProduct[h.productId] ||= []).push(h);
    }
  } catch {
    // geen handleidingen
  }

  // Geboekte verhuurperiodes per product — om beschikbaarheid op de kaart te tonen.
  const geboektPerProduct: Record<number, Periode[]> = {};
  try {
    const alle = await db.select().from(verhuringen);
    for (const v of alle) {
      (geboektPerProduct[v.productId] ||= []).push({ startDatum: v.startDatum, eindDatum: v.eindDatum });
    }
  } catch {
    // geen verhuringen
  }

  const gefilterd = allProducts.filter((p) => {
    const matchesCat = actieveCat === "alle" || p.categorie === actieveCat;
    const matchesZoek = !zoek || p.naam.toLowerCase().includes(zoek.toLowerCase());
    return matchesCat && matchesZoek;
  });

  const groepenMap: Record<string, typeof allProducts> = {};
  if (actieveCat === "alle") {
    for (const p of gefilterd) {
      if (!groepenMap[p.categorie]) groepenMap[p.categorie] = [];
      groepenMap[p.categorie].push(p);
    }
  }

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/sfeer/stage.jpg"
          alt="Podiumverlichting"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-party-dark/90 via-party-dark/75 to-pink-party/45" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="inline-block text-cyan-300 font-bold text-sm uppercase tracking-wider mb-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">Assortiment</span>
          <h1 className="text-white font-black text-3xl md:text-5xl [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
            Alle <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">Producten</span>
          </h1>
          <p className="text-white/90 mt-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            {allProducts.length > 0 ? `${allProducts.length} artikelen beschikbaar` : "Laden..."} — dagprijzen excl. BTW
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <ProductenFilter categorien={CATEGORIEN} actief={actieveCat} zoek={zoek} />

      {allProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-slate-900 text-xl font-bold mb-2">Database nog niet gekoppeld</h2>
          <p className="text-slate-600 mb-4">Stel je DATABASE_URL in .env.local in en voer de seed uit.</p>
          <p className="text-slate-500 text-sm">
            Daarna ga je naar <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded">/admin</code> voor het beheer.
          </p>
        </div>
      ) : gefilterd.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-600 text-lg">Geen producten gevonden</p>
          <p className="text-slate-500 text-sm mt-1">Probeer een andere zoekterm of categorie</p>
        </div>
      ) : actieveCat === "alle" ? (
        <div className="space-y-12">
          {CATEGORIEN.filter((c) => c.id !== "alle").map((cat) => {
            const items = groepenMap[cat.id] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
                  <span className="w-1.5 h-7 rounded-full bg-gradient-party" />
                  <span className="text-2xl">{cat.emoji}</span>
                  <h2 className="text-slate-900 font-black text-xl">{cat.naam}</h2>
                  <span className="text-slate-400 text-sm">({items.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} handleidingen={handleidingenPerProduct[product.id] || []} geboekt={geboektPerProduct[product.id] || []} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gefilterd.map((product) => (
            <ProductCard key={product.id} product={product} handleidingen={handleidingenPerProduct[product.id] || []} geboekt={geboektPerProduct[product.id] || []} />
          ))}
        </div>
      )}
      </div>
    </>
  );
}
